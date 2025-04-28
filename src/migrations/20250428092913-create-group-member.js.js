'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('GroupMembers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,  // The user who is part of the group
        references: {
          model: 'Users',  // Assuming you have a 'Users' table for user references
          key: 'id',
        },
        onDelete: 'CASCADE',  // If a user is deleted, the record in 'GroupMembers' will also be deleted
      },
      groupId: {
        type: Sequelize.UUID,
        allowNull: false,  // The group this user is part of
        references: {
          model: 'Groups',  // Assuming you have a 'Groups' table for group references
          key: 'id',
        },
        onDelete: 'CASCADE',  // If a group is deleted, the record in 'GroupMembers' will also be deleted
      },
      role: {
        type: Sequelize.ENUM('admin', 'member'),
        defaultValue: 'member',  // Default role is 'member'
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
    await queryInterface.dropTable('GroupMembers');
  },
};
