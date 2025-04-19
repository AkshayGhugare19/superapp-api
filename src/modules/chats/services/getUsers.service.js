const { Op } = require('sequelize');
const { db } = require('../../../db/db');
const { messageStatus } = require('../../../config/enums');

const getUsers = async ({ userId, tenderId }) => {
    try {

        // Step 1: Fetch all conversations where the logged-in user is involved,
        // and include participant user details (for both participant1 and participant2)
        const whereStatement = {
            [Op.or]: [
                { participant1Id: userId },
                { participant2Id: userId }
            ],
        };

        if (tenderId) {
            whereStatement.tenderId = tenderId;
        } else {
            whereStatement.tenderId = { [Op.is]: null };
        }

        const conversations = await db.Conversation.findAll({
            where: whereStatement,
            include: [
                {
                    model: db.Users,
                    as: 'participant1',
                    attributes: ['id', 'name', 'username', 'profilePic']
                },
                {
                    model: db.Users,
                    as: 'participant2',
                    attributes: ['id', 'name', 'username', 'profilePic']
                }
            ]
        });

        // Step 2: Use a Set to track unique users
        const uniqueUsersSet = new Set();
        const uniqueUsers = [];

        for (const conversation of conversations) {
            // Fetch recent message for the conversation
            const recentMessage = await db.Message.findOne({
                where: { conversationId: conversation.id },
                order: [['createdAt', 'DESC']],
                limit: 1
            });

            const messagesList = await db.Message.findAll({
                where: {
                    conversationId: conversation.id,
                    receiverId: userId,
                    status: {
                        [Op.not]: messageStatus.Read
                    }
                },
            });

            const messageText = recentMessage ? recentMessage.message : "No recent messages";

            // Check participant1 (exclude if it's the logged-in user)
            if (conversation.participant1 && conversation.participant1.id !== userId && !uniqueUsersSet.has(conversation.participant1.id)) {
                uniqueUsers.push({
                    ...conversation.participant1.toJSON(),
                    conversationId: conversation.id,
                    createdAt: recentMessage?.createdAt || conversation?.createdAt,
                    recentMessage: messageText,
                    messageCount: messagesList?.length || 0
                });
                uniqueUsersSet.add(conversation.participant1.id);
            }

            // Check participant2 (exclude if it's the logged-in user)
            if (conversation.participant2 && conversation.participant2.id !== userId && !uniqueUsersSet.has(conversation.participant2.id)) {
                uniqueUsers.push({
                    ...conversation.participant2.toJSON(),
                    conversationId: conversation.id,
                    createdAt: recentMessage?.createdAt || conversation?.createdAt,
                    recentMessage: messageText,
                    messageCount: messagesList?.length || 0
                });
                uniqueUsersSet.add(conversation.participant2.id);
            }
        }

        // Step 3: Sort the uniqueUsers array based on the recent message's createdAt (or conversation createdAt if no recent message)
        uniqueUsers.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });

        return { status: true, data: uniqueUsers, code: 200 };

    } catch (error) {
        console.error(error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getUsers;
