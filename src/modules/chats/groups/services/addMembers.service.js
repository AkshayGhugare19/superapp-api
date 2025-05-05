const { v4: uuidv4 } = require('uuid');
const { db, sequelize } = require('../../../../db/db');
const { Op, Transaction } = require('sequelize');

const addGroupMembers = async ({ groupId, participantIds, addedBy }) => {
  console.log('Starting addGroupMembers service with:', { groupId, participantIds, addedBy });
  
  // Set transaction timeout to 30 seconds
  const t = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    timeout: 30000 // 30 seconds timeout
  });
 
  try {
    if (!groupId || !participantIds || !Array.isArray(participantIds)) {
      console.log('Validation failed:', { groupId, participantIds });
      return { status: false, code: 400, msg: 'groupId and participantIds are required.' };
    }

    // Validate group exists and get conversation in a single query
    const [group, conversation] = await Promise.all([
      db.Group.findByPk(groupId),
      db.Conversation.findOne({
        where: { groupId: groupId }
      })
    ]);
    
    console.log('Found group:', group ? group.id : 'not found');
    console.log('Found conversation:', conversation ? {
      id: conversation.id,
      groupId: conversation.groupId,
      participants: conversation.participants
    } : 'not found');
    
    if (!group) {
      return { status: false, code: 404, msg: 'Group not found.' };
    }

    if (!conversation) {
      return { status: false, code: 404, msg: 'Associated conversation not found.' };
    }

    // Validate users exist and are active in a single query
    const existingUsers = await db.Users.findAll({
      where: { 
        id: { [Op.in]: participantIds },
        isActive: true
      },
      attributes: ['id'],
      transaction: t
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
      },
      transaction: t
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
      { 
        transaction: t,
        timeout: 10000 // 10 second timeout for bulk create
      }
    );
    console.log('Created new participants:', newParticipants.map(p => p.userId));

    // Update conversation participants array
    const updatedParticipants = [...new Set([...conversation.participants, ...newParticipantIds])];
    await conversation.update(
      { participants: updatedParticipants },
      { 
        transaction: t,
        timeout: 5000 // 5 second timeout for update
      }
    );
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
    
    // Handle specific timeout errors
    if (error.name === 'SequelizeTimeoutError') {
      return { 
        status: false, 
        code: 500, 
        msg: 'Operation timed out. Please try again.' 
      };
    }
    
    return { 
      status: false, 
      code: 500, 
      msg: error.message || 'An unexpected error occurred'
    };
  }
};

module.exports = addGroupMembers;
