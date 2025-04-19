const { db } = require('../../../db/db');

const updateMessage = async ({ messageId, status }) => {
    try {
        const message = await db.Message.findOne({ where: { id: messageId } });
        if (!message) {
            return { status: false, msg: 'Message not found', code: 400 };
        }

        const updatedMessage = await message.update({ status });

        return { status: true, data: updatedMessage, code: 200 };

    } catch (error) {
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = updateMessage;

