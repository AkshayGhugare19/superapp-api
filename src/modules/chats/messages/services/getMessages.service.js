const { Op } = require('sequelize');
const { db } = require('../../../db/db');

const getMessages = async ({ senderId, receiverId, conversationId }) => {
  try {
    const whereCondition = {
      [Op.or]: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ],
    }
    if (conversationId) {
      whereCondition.conversationId = conversationId;
    }
    const messageRequests = await db.Message.findAll({
      where: whereCondition,
      order: [['createdAt', 'ASC']],
    });

    if (!messageRequests.length) {
      return { status: true, data: [], code: 200 };
    }

    return { status: true, data: messageRequests, code: 200 };
  } catch (error) {
    return { msg: error.message, status: false, code: 500 };
  }
};

module.exports = getMessages;
