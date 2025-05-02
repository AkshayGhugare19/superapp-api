const { object } = require('joi');
const { DataTypes } = require('sequelize');
const { chatType } = require('../../../config/enums');

module.exports = (sequelize) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    chatType: {
      type: DataTypes.ENUM(...Object.values(chatType)),  // Type of chat: one-to-one or group
      defaultValue: chatType.OneToOne,
      allowNull: false,
    },
    participants: {
      type: DataTypes.JSONB, // Stores array of user IDs for group chats
      allowNull: false,
    },  
    initiatorId: {
      type: DataTypes.UUID, // The user who initiated the chat
      allowNull: false,
    }, 
  },
    {
      timestamps: true,
      paranoid: true,
    }
  );


  return Conversation;
};
