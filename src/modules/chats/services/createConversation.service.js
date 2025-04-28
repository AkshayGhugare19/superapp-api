const { db } = require('../../../db/db');

const createConversation = async ({ chatType, participants, user }) => {
    try {
            const existingConversation = await db.Conversation.findOne({
                where: {
                  chatType,
                  participants: {
                    [Op.contains]: participants, // Check if the participants array contains the current participants
                  },
                },
              });

              if (existingConversation) {
                return { status: false, msg: "Conversation already exists", code: 400 };
              }


              if (!participants.includes(user.id)) {
                return res.status(400).json({
                  message: 'user must be a participant in the conversation.',
                });
              }
        
             // Ensure the user is not starting a conversation with themselves
    if (participants.length === 1 || participants.includes(req.userId)) {
        return res.status(400).json({
          message: 'You cannot start a conversation with yourself.',
        });
      }
    

        const newConversation = await db.Conversation.create({
            chatType,
            participants,
            initiatorId: user.id, s
        });

        return { status: true, data: newConversation, code: 200 };

    } catch (error) {
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = createConversation;

