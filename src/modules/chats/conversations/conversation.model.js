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
    groupId: {
      type: DataTypes.UUID, // Optional: The group ID for group chats
      allowNull: true,      // Can be null for one-to-one chats
      references: {
        model: 'Groups',    // Assuming the Group model is named 'Group'
        key: 'id',          // The foreign key reference to the Group table
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // to soft-disable conversations
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true, // to track the last message's timestamp
    },
    lastMessage: {
      type: DataTypes.STRING,  // Store the last message content
      allowNull: true,         // Optional field to hold the message text or media link
    },
    deletedBy: {
      type: DataTypes.UUID,
      allowNull: true, // for tracking who deleted the conversation (if paranoid delete is used)
    },
  },
    {
      timestamps: true,
      paranoid: true,
    }
  );


  return Conversation;
};
