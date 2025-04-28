'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Groups', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      groupName: {
        type: Sequelize.STRING,
        allowNull: true,  // Optional field for group name
      },
      groupDescription: {
        type: Sequelize.STRING,
        allowNull: true,  // Optional field for group description
      },
      groupImage: {
        type: Sequelize.STRING,  // For storing a URL to the group image (optional)
        allowNull: true,
      },
      adminId: {
        type: Sequelize.UUID,  // ID of the user who is an admin
        allowNull: true,
      },
      conversationId: {
        type: Sequelize.UUID,
        references: {
          model: 'Conversations',  // Assuming you have a Conversations table
          key: 'id',
        },
        allowNull: true, // A group will be linked to a conversation, but this can be null for certain cases
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Groups');
  },
};
