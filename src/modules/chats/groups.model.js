const { DataTypes } = require('sequelize');

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
    adminId: {
      type: DataTypes.UUID,  // ID of the user who is an admin
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  });


  return Group;
};
