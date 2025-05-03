'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Conversations', 'groupId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Groups',  // Assuming 'Groups' is the table name
        key: 'id',
      },
    });

    await queryInterface.addColumn('Conversations', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,  // Soft-disable flag
    });

    await queryInterface.addColumn('Conversations', 'lastMessageAt', {
      type: Sequelize.DATE,
      allowNull: true,  // Nullable for optional last message timestamp
    });

    await queryInterface.addColumn('Conversations', 'lastMessage', {
      type: Sequelize.STRING,
      allowNull: true,  // Nullable for optional last message content
    });

    await queryInterface.addColumn('Conversations', 'deletedBy', {
      type: Sequelize.UUID,
      allowNull: true,  // Nullable for tracking who deleted the conversation
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback changes if necessary
    await queryInterface.removeColumn('Conversations', 'groupId');
    await queryInterface.removeColumn('Conversations', 'isActive');
    await queryInterface.removeColumn('Conversations', 'lastMessageAt');
    await queryInterface.removeColumn('Conversations', 'lastMessage');
    await queryInterface.removeColumn('Conversations', 'deletedBy');
  },
};
