'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ConversationParticipants', 'AddedBy', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ConversationParticipants', 'AddedBy');
  }
};
