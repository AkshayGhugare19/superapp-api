const { DataTypes } = require('sequelize');
const { messageStatus, messageTypes } = require('../../config/enums');
const { object } = require('joi');


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
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.ENUM(...Object.values(messageTypes)), // ✅ Added this
      defaultValue: messageTypes.Text,
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
    }
  );


  return Message;
};
