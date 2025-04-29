// services/conversation.service.js


const { v4: uuidv4 } = require('uuid');
const { Op, Sequelize } = require('sequelize');
const { db, sequelize } = require('../../../db/db');
const { chatType } = require('../../../config/enums');

async function createConversation({ participantIds, initiatorId, groupName, transaction: passedTransaction }) {

  participantIds = [...new Set(participantIds)];

  // ✅ Validate participants
  if (!participantIds || !Array.isArray(participantIds) || participantIds.length < 2) {
    return {
      status: false,
      code: 400,
      msg: "At least two participants are required to create a conversation.",
    };
  }

  if (!initiatorId) {
    return {
      status: false,
      code: 400,
      msg: "Initiator ID is required.",
    };
  }

  const isGroup = participantIds.length > 2 || !!groupName;

  // ✅ Optional: validate that initiator is in participantIds
  if (!participantIds.includes(initiatorId)) {
    return {
      status: false,
      code: 400,
      msg: "Initiator must be one of the participants.",
    };
  }

  const useLocalTransaction = !passedTransaction;
  const t = passedTransaction || await sequelize.transaction();


  try {


    const existingUsers = await db.Users.findAll({
      where: { id: { [Op.in]: participantIds } },
      attributes: ['id']
    });

    const foundIds = existingUsers.map(user => user.id);
    const invalidIds = participantIds.filter(id => !foundIds.includes(id));

    if (invalidIds.length) {
      return {
        status: false,
        code: 400,
        msg: `Invalid participant IDs: ${invalidIds.join(', ')}`
      };
    }

    // ✅ 1. One-to-one chat: Check if it already exists
    if (!isGroup) {
      const existingConversation = await db.Conversation.findOne({
        where: {
          chatType: chatType.OneToOne,
          [Op.or]: [
            Sequelize.literal(`JSON_CONTAINS(participants, '["${participantIds.join('","')}"]')`), // Check if all participantIds are in the conversation
            Sequelize.literal(`JSON_CONTAINS(participants, '["${[...participantIds].reverse().join('","')}"]')`) // Check for reverse order
          ],
        },
      });

      if (existingConversation) {
        await t.rollback();
        return {
          status: true,
          code: 200,
          data: { ...existingConversation.toJSON(), msg: "Conversation already exists." }
        };
      }
    }

    // ✅ 2. Create new conversation
    const newConversation = await db.Conversation.create({
      chatType: isGroup ? chatType.Group : chatType.OneToOne,
      participants: participantIds,
      initiatorId,
      ...(isGroup && groupName ? { name: groupName } : {}),
    }, { transaction: t });

    // ✅ 3. Create conversation participants
    const participantsData = participantIds.map((userId) => ({
      id: uuidv4(),
      conversationId: newConversation.id,
      userId,
      role: initiatorId === userId ? 'admin' : 'user',
      joinedAt: new Date(),
    }));

    await db.ConversationParticipant.bulkCreate(participantsData, { transaction: t });

    if (useLocalTransaction) await t.commit();

    return {
      status: true,
      code: 201,
      msg: "Conversation created successfully.",
      data: newConversation,
    };

  } catch (error) {
    console.log(error, "error  error in crerate conversation")
    await t.rollback();
    return {
      status: false,
      code: 500,
      msg: error.message || "Failed to create conversation.",
    };
  }
}

module.exports = createConversation;
