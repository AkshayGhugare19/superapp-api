const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Kyc = sequelize.define('Kyc', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    result: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    tableName: 'kyc',
    defaultScope: {
      attributes: { exclude: [] },
    },
    scopes: {
      withResult: {
        attributes: { include: ['result'] },
      },
    },
  });

  return Kyc;
};
