const { DataTypes } = require('sequelize');
const { messageStatus } = require('../../config/enums');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(messageStatus.Sent, messageStatus.Delivered, messageStatus.Read),
      defaultValue: messageStatus.Sent,
      allowNull: false,
    }
  },
    {
      timestamps: true,
    }
  );


  return Message;
};
