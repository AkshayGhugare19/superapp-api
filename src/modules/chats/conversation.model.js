const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    participant1Id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    participant2Id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: true
    },
  },
    {
      timestamps: true,
    }
  );


  return Conversation;
};
