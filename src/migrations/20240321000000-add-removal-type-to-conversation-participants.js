'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ConversationParticipants', 'removalType', {
      type: Sequelize.ENUM('self_removal', 'admin_removal'),
      allowNull: true,
      comment: 'Indicates how the participant was removed from the conversation'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ConversationParticipants', 'removalType');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_ConversationParticipants_removalType;');
  }
}; 