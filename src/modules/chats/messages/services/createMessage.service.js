const { v4: uuidv4 } = require('uuid');
const { db, sequelize } = require('../../../../db/db');

async function createMessage({
  user,
  senderId,
  conversationId,
  message,
  messageType,
  media = [],
  receiverId = null,  // Optional, will be null if not used
}) {
  // Start a new transaction
  const transaction = await sequelize.transaction();

  try {
    // Validate required fields
    const missing = [];
    if (!senderId) missing.push('senderId');
    if (!conversationId) missing.push('conversationId');
    if (!message && (!Array.isArray(media) || media.length === 0)) {
      missing.push('message or media');
    }

    if (missing.length > 0) {
      return {
        status: false,
        code: 400,
        msg: `Missing field(s): ${missing.join(', ')}`,
      };
    }

    // Validate related entities
    const [sender, conversation] = await Promise.all([
      db.Users.findByPk(senderId),
      db.Conversation.findByPk(conversationId),
    ]);

    if (!sender) return { status: false, code: 404, msg: 'Sender not found' };
    if (!conversation) return { status: false, code: 404, msg: 'Conversation not found' };

    if (!conversation.participants.includes(user.id)) {
      return {
        status: false,
        code: 403,
        msg: 'You are not authorized to send messages in this conversation',
      };
    }

    // Handle simple text message
    if (message && messageType === 'text') {
      const created = await db.Message.create(
        {
          senderId,
          conversationId,
          message,
          messageType: 'text',
          receiverId,  // Add receiverId here
        },
        { transaction } // Pass the transaction to ensure it's part of the same transaction
      );

      // Update conversation with the latest message and timestamp
      await db.Conversation.update(
        {
          lastMessage: message,
          lastMessageAt: new Date(),
        },
        {
          where: { id: conversationId },
          transaction, // Use transaction here as well
        }
      );

      // Commit the transaction
      await transaction.commit();

      return {
        status: true,
        code: 201,
        msg: 'Message sent',
        data: created,
      };
    }

    // Handle media-based messages
    if (Array.isArray(media) && media.length > 0) {
      const groupId = media.length > 1 ? uuidv4() : null;

      const messages = await Promise.all(
        media.map((item, index) => {
          return db.Message.create(
            {
              senderId,
              receiverId, // Add receiverId here
              conversationId,
              message: index === 0 ? message || null : null,
              messageType,
              mediaUrl: item.mediaUrl,
              mediaMimeType: item.mediaMimeType,
              groupId,
              order: groupId ? index + 1 : null,
            },
            { transaction } // Pass transaction here
          );
        })
      );

      // Update conversation with the latest message and timestamp
      await db.Conversation.update(
        {
          lastMessage: message || media[0].mediaUrl, // Store media URL if no text message
          lastMessageAt: new Date(),
        },
        {
          where: { id: conversationId },
          transaction, // Use transaction here
        }
      );

      // Commit the transaction
      await transaction.commit();

      return {
        status: true,
        code: 201,
        msg: 'Media message(s) sent',
        data: messages,
      };
    }

    // If no valid message or media
    return {
      status: false,
      code: 400,
      msg: 'Invalid message payload',
    };
  } catch (error) {
    // If any error occurs, rollback the transaction
    await transaction.rollback();

    return {
      status: false,
      code: 500,
      msg: 'Internal Server Error',
      error: error.message,
    };
  }
}

module.exports = createMessage;
