const { DataTypes } = require('sequelize');
const { messageStatus, messageTypes } = require('../../../config/enums');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING, // Used as text message OR caption
      allowNull: true,        // ✅ allowNull true so media messages without caption are valid
    },
    messageType: {
      type: DataTypes.ENUM(...Object.values(messageTypes)), // e.g. "text", "image", "video"
      defaultValue: messageTypes.Text,
    },
    mediaUrl: {
      type: DataTypes.STRING, // ✅ path or URL to uploaded media
      allowNull: true
    },
    mediaMimeType: {
      type: DataTypes.STRING, // ✅ optional: "image/jpeg", "video/mp4", etc.
      allowNull: true
    },
    groupId: {
      type: DataTypes.UUID, // ✅ used to group media files in one batch (like WhatsApp album)
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER, // ✅ defines order within a group
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(messageStatus.Sent, messageStatus.Delivered, messageStatus.Read),
      defaultValue: messageStatus.Sent,
      allowNull: false,
    }
  },
  {
    timestamps: true,
    paranoid: true, // ✅ Adds deletedAt for soft delete
  });

  return Message;
};
