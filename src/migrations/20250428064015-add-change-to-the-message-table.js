'use strict';

const { messageTypes } = require("../config/enums");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Modify senderId to NOT NULL
    await queryInterface.changeColumn('Messages', 'senderId', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    // 2️⃣ Add type ENUM column
    await queryInterface.addColumn('Messages', 'messageType', {
      type: Sequelize.ENUM(...Object.values(messageTypes)),
      allowNull: false,
      defaultValue: messageTypes.Text,
    });

    // 3️⃣ Add deletedAt column for soft delete
    await queryInterface.addColumn('Messages', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback changes

    // 1️⃣ Make senderId nullable again (if needed)
    await queryInterface.changeColumn('Messages', 'senderId', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // 2️⃣ Remove type column
    await queryInterface.removeColumn('Messages', 'messageType');

    // 3️⃣ Remove deletedAt column
    await queryInterface.removeColumn('Messages', 'deletedAt');
  }
};
