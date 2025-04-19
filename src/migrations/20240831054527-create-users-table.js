'use strict';

const {roles, gender } = require('../config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: true,
				unique: true,
			},
			phone: {
				type: Sequelize.BIGINT,
				allowNull: true,
				unique: true,
			},
			countryCode: {
				  type: Sequelize.STRING,
				  allowNull: true,
				  defaultValue: null
				},
			email: {
				type: Sequelize.STRING,
				allowNull: true,
				unique: true,
				validate: { isEmail: true },
			},
			password: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			profilePic: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			role: {
				type: Sequelize.ENUM(roles.admin, roles.consumer, roles.merchant, roles.agent),
				allowNull: false,
				defaultValue: roles.consumer,
			},
			dateOfBirth: {
				type: Sequelize.DATEONLY,
				allowNull: true,
			},
			gender: {
				type: Sequelize.ENUM(gender.male, gender.female, gender.other),
				allowNull: true,
			},
			location: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			language: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: true,
			},
			isProfileCompleted: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			isAccountLocked: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			accountLockingReason: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			isMobileVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			isEmailVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			isPrivate: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			loginAttempts: {
				type: Sequelize.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			resetToken: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
			updatedAt: { type: Sequelize.DATE },
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users');
	}
};
