const { db, sequelize } = require('../../../../db/db');
const { Op } = require('sequelize');

const removeGroupMember = async ({ groupId, memberId, removedBy }) => {
  console.log('Starting removeGroupMember service with:', { groupId, memberId, removedBy });
  const t = await sequelize.transaction();

  try {
    if (!groupId || !memberId) {
      return { status: false, code: 400, msg: 'groupId and memberId are required.' };
    }

    // Validate group exists
    const group = await db.Group.findByPk(groupId);
    console.log('Found group:', group ? group.id : 'not found');
    
    if (!group) {
      return { status: false, code: 404, msg: 'Group not found.' };
    }

    // Find the conversation associated with the group
    const conversation = await db.Conversation.findOne({
      where: { groupId: groupId }
    });
    
    console.log('Found conversation:', conversation ? {
      id: conversation.id,
      groupId: conversation.groupId,
      participants: conversation.participants
    } : 'not found');

    if (!conversation) {
      return { status: false, code: 404, msg: 'Associated conversation not found.' };
    }

    // Check if member exists in the conversation
    const participant = await db.ConversationParticipants.findOne({
      where: {
        conversationId: conversation.id,
        userId: memberId
      }
    });

    if (!participant) {
      return { status: false, code: 404, msg: 'Member not found in the group.' };
    }

    // Check if the user is removing themselves or if they're an admin
    const isSelfRemoval = memberId === removedBy;
    const isAdmin = group.createdBy === removedBy;

    if (!isSelfRemoval && !isAdmin) {
      return { 
        status: false, 
        code: 403, 
        msg: 'You do not have permission to remove this member. Only admins can remove other members.' 
      };
    }

    // Check if trying to remove the admin
    if (memberId === group.createdBy) {
      return {
        status: false,
        code: 400,
        msg: 'Cannot remove the group admin. Please transfer admin rights first.'
      };
    }

    // Check if this would leave less than 2 members
    const currentParticipants = conversation.participants || [];
    if (currentParticipants.length <= 2) {
      return {
        status: false,
        code: 400,
        msg: 'Cannot remove member. A group must have at least 2 members.'
      };
    }

    // Remove the participant
    const removalType = isSelfRemoval ? 'self_removal' : 'admin_removal';
    await participant.update({
      removalType,
      leftAt: new Date()
    }, { transaction: t });
    
    // Update conversation participants array
    const updatedParticipants = conversation.participants.filter(id => id !== memberId);
    await conversation.update({ participants: updatedParticipants }, { transaction: t });
    console.log('Updated conversation participants:', updatedParticipants);

    await t.commit();

    // Get user details for the response
    const [removedUser, removedByUser] = await Promise.all([
      db.Users.findByPk(memberId, { attributes: ['id', 'name', 'email'] }),
      db.Users.findByPk(removedBy, { attributes: ['id', 'name', 'email'] })
    ]);

    return {
      status: true,
      code: 200,
      msg: isSelfRemoval ? 'You have left the group successfully.' : 'Member removed successfully.',
      data: {
        removedMember: {
          id: removedUser.id,
          name: removedUser.name,
          email: removedUser.email
        },
        removedBy: {
          id: removedByUser.id,
          name: removedByUser.name,
          email: removedByUser.email
        },
        removalType: removalType,
        totalParticipants: updatedParticipants.length,
        remainingParticipants: updatedParticipants
      }
    };
  } catch (error) {
    await t.rollback();
    console.error('Error in removeGroupMember:', error);
    return { status: false, code: 500, msg: error.message };
  }
};

module.exports = removeGroupMember; 