'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Groups', 'conversationId'); // Remove conversationId from Groups table
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Groups', 'conversationId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Conversations',
        key: 'id',
      },
    });
  },
};
