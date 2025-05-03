'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove old adminId column
    await queryInterface.removeColumn('Groups', 'adminId');

    // Add new createdBy column with foreign key
    await queryInterface.addColumn('Groups', 'createdBy', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert: Add back adminId and remove createdBy
    await queryInterface.removeColumn('Groups', 'createdBy');

    await queryInterface.addColumn('Groups', 'adminId', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  }
};
