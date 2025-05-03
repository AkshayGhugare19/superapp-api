const { v4: uuidv4 } = require('uuid');
const { db, sequelize } = require('../../../../db/db');
const { Op } = require('sequelize');

const addGroupMembers = async ({ groupId, participantIds, addedBy }) => {
  console.log('Starting addGroupMembers service with:', { groupId, participantIds, addedBy });
  const t = await sequelize.transaction();
 
  try {
    if (!groupId || !participantIds || !Array.isArray(participantIds)) {
      console.log('Validation failed:', { groupId, participantIds });
      return { status: false, code: 400, msg: 'groupId and participantIds are required.' };
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

    // Validate users exist and are active
    const existingUsers = await db.Users.findAll({
      where: { 
        id: { [Op.in]: participantIds },
        isActive: true
      },
      attributes: ['id']
    });
    console.log('Found active users:', existingUsers.map(u => u.id));

    const foundIds = existingUsers.map(user => user.id);
    const invalidIds = participantIds.filter(id => !foundIds.includes(id));

    if (invalidIds.length > 0) {
      return { 
        status: false, 
        code: 400, 
        msg: `Invalid or inactive participant IDs: ${invalidIds.join(', ')}` 
      };
    }

    // Check for existing participants
    const existingParticipants = await db.ConversationParticipants.findAll({
      where: {
        conversationId: conversation.id,
        userId: { [Op.in]: participantIds }
      }
    });
    console.log('Found existing participants:', existingParticipants.map(p => p.userId));

    const existingParticipantIds = existingParticipants.map(p => p.userId);
    const newParticipantIds = participantIds.filter(id => !existingParticipantIds.includes(id));
    console.log('New participant IDs to add:', newParticipantIds);

    if (newParticipantIds.length === 0) {
      return { status: false, code: 400, msg: 'All participants are already members of the group.' };
    }

    // Create new conversation participants
    const newParticipants = await db.ConversationParticipants.bulkCreate(
      newParticipantIds.map(userId => ({
        id: uuidv4(),
        conversationId: conversation.id,
        userId,
        role: 'user',
        AddedBy: addedBy
      })),
      { transaction: t }
    );
    console.log('Created new participants:', newParticipants.map(p => p.userId));

    // Update conversation participants array
    const updatedParticipants = [...new Set([...conversation.participants, ...newParticipantIds])];
    await conversation.update({ participants: updatedParticipants }, { transaction: t });
    console.log('Updated conversation participants:', updatedParticipants);

    await t.commit();

    return {
      status: true,
      code: 200,
      msg: 'Members added successfully.',
      data: {
        addedParticipants: newParticipants,
        totalParticipants: updatedParticipants.length
      }
    };
  } catch (error) {
    await t.rollback();
    console.error('Error in addGroupMembers:', error);
    return { status: false, code: 500, msg: error.message };
  }
};

module.exports = addGroupMembers;
