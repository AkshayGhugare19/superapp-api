'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      // Remove old fields
      queryInterface.removeColumn('Conversations', 'participant1Id'),
      queryInterface.removeColumn('Conversations', 'participant2Id'),

      // Add new fields
      queryInterface.addColumn('Conversations', 'chatType', {
        type: Sequelize.ENUM('one-to-one', 'group'),
        allowNull: false,
        defaultValue: 'one-to-one',
      }),
      queryInterface.addColumn('Conversations', 'participants', {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      }),
      queryInterface.addColumn('Conversations', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      // Rollback: Add back old fields
      queryInterface.addColumn('Conversations', 'participant1Id', {
        type: Sequelize.UUID,
        allowNull: true,
      }),
      queryInterface.addColumn('Conversations', 'participant2Id', {
        type: Sequelize.UUID,
        allowNull: true,
      }),
      // Rollback: Remove new fields
      queryInterface.removeColumn('Conversations', 'chatType'),
      queryInterface.removeColumn('Conversations', 'participants'),
      queryInterface.removeColumn('Conversations', 'deletedAt'),
    ]);
  }
};
