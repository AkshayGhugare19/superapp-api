// models/conversationParticipants.js
const { DataTypes } = require('sequelize');
const { participantRole } = require('../../../config/enums');

module.exports = (sequelize) => {
  const ConversationParticipants = sequelize.define('ConversationParticipants', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Conversations',  // Ensure this matches the actual Conversations table name
        key: 'id',
      },
      onDelete: 'CASCADE',  // Delete participants when the conversation is deleted
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',  // Ensure this matches the actual Users table name
        key: 'id',
      },
      onDelete: 'CASCADE',  // Remove user from conversation when user is deleted
    },
    role: {
      type: DataTypes.ENUM(...Object.values(participantRole)),  // Adjust roles as necessary
      defaultValue: 'user',
      allowNull: false,
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    leftAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    AddedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    removalType: {
      type: DataTypes.ENUM('self_removal', 'admin_removal'),
      allowNull: true,
      comment: 'Indicates how the participant was removed from the conversation'
    }
  }, {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
    paranoid: true,    // Soft delete support (deletedAt field)
    tableName: 'ConversationParticipants',  // Explicitly set the table name
    modelName: 'ConversationParticipants',  // Explicitly set the model name
    freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
  });

  // Define associations
  ConversationParticipants.associate = (models) => {
    // A participant belongs to a conversation
    ConversationParticipants.belongsTo(models.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation',
    });

    // A participant belongs to a user
    ConversationParticipants.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return ConversationParticipants;
};
