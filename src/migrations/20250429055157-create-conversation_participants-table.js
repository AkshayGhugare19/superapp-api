const { participantRole } = require("../config/enums");

// migrations/XXXXXX-create-conversation-participants.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ConversationParticipants', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      conversationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Conversations',  // Ensure this matches the actual Conversations table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',  // Ensure this matches the actual Users table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.ENUM(...Object.values(participantRole)),
        allowNull: false,
        defaultValue: 'user',
      },
      joinedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      leftAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ConversationParticipants');
  },
};
