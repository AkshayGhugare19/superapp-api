const { db } = require('../../../db/db');
const { Op } = require('sequelize');
const { messageStatus } = require('../../../config/enums');

const updateBulkMessages = async ({ conversationId }) => {
    try {
        const [affectedCount] = await db.Message.update(
            { status: messageStatus.Read },
            { where: { conversationId, status: { [Op.not]: messageStatus.Read } } }
        );

        if (affectedCount === 0) {
            return { status: false, msg: 'No messages found or already read', code: 400 };
        }

        return { status: true, data: "Success", code: 200 };

    } catch (error) {
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = updateBulkMessages;

