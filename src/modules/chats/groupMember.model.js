const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GroupMember = sequelize.define('GroupMember', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,  // The user who is part of the group
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,  // The group this user is part of
    },
    role: {
      type: DataTypes.ENUM('admin', 'member'), // Role of the user in the group
      defaultValue: 'member',  // Default role is member
    },
  },
  {
    timestamps: true,
    paranoid: true,
  });

  // Relationship with Group table
 

  return GroupMember;
};  