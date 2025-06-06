const { db } = require('../../../db/db');

const sendMessage = async ({ senderId, receiverId, message, conversationId }) => {
    try {
        console.log('Debug :: senderId, receiverId, message, conversationId', { senderId, receiverId, message, conversationId });
        const newMessage = await db.Message.create({
            senderId,
            receiverId,
            message,
            conversationId
        });

        return { status: true, data: newMessage, code: 200 };

    } catch (error) {
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = sendMessage;

