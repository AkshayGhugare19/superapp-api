// services/group.service.js

const { v4: uuidv4 } = require('uuid');
const { db, sequelize } = require('../../../../db/db');
const createConversation = require('../../conversations/services/createConversation.service');

const createGroup = async ({ groupName, groupDescription, groupImage, adminId, participantIds }) => {

  console.log("create conversation group")
  const t = await sequelize.transaction();

  try {
    if (!adminId || !participantIds || !Array.isArray(participantIds)) {
      return { status: false, code: 400, msg: 'adminId and participantIds are required.' };
    }

    const uniqueParticipantIds = [...new Set([...participantIds, adminId])];

    if (uniqueParticipantIds.length < 2) {
      return {
        status: false,
        code: 400,
        msg: 'At least two unique participants (including admin) are required to create a group.',
      };
    }

    // Step 1: Create Group
    const newGroup = await db.Group.create({
      id: uuidv4(),
      groupName,
      groupDescription,
      groupImage,
      adminId,
    }, { transaction: t });

    // Step 2: Create Conversation (ensure conversation.service supports external transactions)
    const conversation = await createConversation({
      participantIds: uniqueParticipantIds,
      initiatorId: adminId,
      groupName,
      transaction: t,  // ✅ Pass the transaction if supported in conversation.service
      groupId: newGroup.id,
    });

    console.log(conversation, "conversation124")

    if (!(conversation?.status)) {
      await t.rollback();
      return { status: false, code: 500, msg: conversation.msg || 'Conversation creation failed.' };
    }

    await t.commit();

    return {
      status: true,
      code: 201,
      msg: 'Group and conversation created successfully.',
      data: {
        group: newGroup,
        conversation,
      },
    };
  } catch (error) {
    await t.rollback();
    console.error('Group creation failed:', error);
    return { status: false, code: 500, msg: error.message };
  }
};

module.exports = createGroup;
