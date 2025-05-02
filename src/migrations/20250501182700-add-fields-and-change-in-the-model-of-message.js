'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('Messages', 'mediaUrl', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Messages', 'mediaMimeType', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Messages', 'groupId', {
        type: Sequelize.UUID,
        allowNull: true,
      }),
      queryInterface.addColumn('Messages', 'order', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('Messages', 'mediaUrl'),
      queryInterface.removeColumn('Messages', 'mediaMimeType'),
      queryInterface.removeColumn('Messages', 'groupId'),
      queryInterface.removeColumn('Messages', 'order'),
    ]);
  }
};
