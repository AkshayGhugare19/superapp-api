const { DataTypes } = require('sequelize');
const { groupType } = require('../../../config/enums');

module.exports = (sequelize) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional field for group name
    },
    groupDescription: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional field for group description
    },
    groupImage: {
      type: DataTypes.STRING,  // For storing a URL to the group image (optional)
      allowNull: true,
    },

    groupType: {
      type: DataTypes.ENUM(...Object.values(groupType)),
      defaultValue: groupType.Private,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users', // assuming your users table is named Users
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
  },
  {
    timestamps: true,
    paranoid: true,
  });


  return Group;
};
