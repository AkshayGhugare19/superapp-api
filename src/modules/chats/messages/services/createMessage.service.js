const { v4: uuidv4 } = require('uuid');
const { db } = require('../../../../db/db');

async function createMessage({
  user,
  senderId,
  conversationId,
  message,
  messageType,
  media = [],
}) {
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
  console.log(conversationId, "conversation data")
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
    const created = await db.Message.create({
      senderId,
      conversationId,
      message,
      messageType: 'text',
    });

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
        return db.Message.create({
          senderId,
          receiverId,
          conversationId,
          message: index === 0 ? message || null : null,
          messageType: messageType,
          mediaUrl: item.mediaUrl,
          mediaMimeType: item.mediaMimeType,
          groupId,
          order: groupId ? index + 1 : null,
        });
      })
    );

    return {
      status: true,
      code: 201,
      msg: 'Media message(s) sent',
      data: messages,
    };
  }

  return {
    status: false,
    code: 400,
    msg: 'Invalid message payload',
  };
}

module.exports = createMessage;
