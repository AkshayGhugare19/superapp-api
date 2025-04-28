'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the initiatorId field to the Conversations table
    await queryInterface.addColumn('Conversations', 'initiatorId', {
      type: Sequelize.UUID,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the initiatorId field if we rollback the migration
    await queryInterface.removeColumn('Conversations', 'initiatorId');
  }
};
