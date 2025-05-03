'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new fields
    await queryInterface.addColumn('Groups', 'groupType', {
      type: Sequelize.ENUM('private', 'public'),
      defaultValue: 'private',
    });

    await queryInterface.addColumn('Groups', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.addColumn('Groups', 'lastMessageAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove new fields (rollback)
    await queryInterface.removeColumn('Groups', 'groupType');
    await queryInterface.removeColumn('Groups', 'isActive');
    await queryInterface.removeColumn('Groups', 'lastMessageAt');
  }
};
