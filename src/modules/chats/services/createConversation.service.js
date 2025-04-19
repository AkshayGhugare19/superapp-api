const { db } = require('../../../db/db');

const createConversation = async ({ participant1Id, participant2Id, tenderId }) => {
    try {

        if (tenderId) {
            const existingConversation = await db.Conversation.findOne({
                where: {
                    participant1Id,
                    participant2Id,
                    tenderId
                }
            });
            if (existingConversation) {
                return { status: false, msg: "Conversation already exists", code: 400 };
            }
        }

        const newConversation = await db.Conversation.create({
            participant1Id, participant2Id, tenderId
        });

        return { status: true, data: newConversation, code: 200 };

    } catch (error) {
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = createConversation;

