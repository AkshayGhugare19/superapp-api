const { DataTypes } = require('sequelize');
const { otpType } = require('../../config/enums');

module.exports = (sequelize) => {
	const Otp = sequelize.define('Otp', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		otpCode: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				len: [6, 6], // Ensure the OTP is exactly 6 digits long
			},
		},
		otpFor: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [[otpType.phoneVerify,otpType.emailVerify, otpType.forgotPassword]], // Example values; adjust as needed
			},
		},
		expiresAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	}, {
		timestamps: true,
		hooks: {
			// Define hooks here if needed
		},
		defaultScope: {
			// Define default scopes here if needed
		},
		scopes: {
			// Additional scopes can be defined here
		},
	});

	return Otp;
};
