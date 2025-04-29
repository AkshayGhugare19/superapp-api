const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const logger = require('../config/logger');

// Database configuration
const config = {
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	host: process.env.MYSQL_HOST,
	dbPort: process.env.MYSQL_PORT,
	dialect: 'mysql',
};

// Create a connection to the MySQL server and ensure the database exists
const createDatabaseIfNotExists = async () => {
	const connection = await mysql.createConnection({
		host: config.host,
		user: config.username,
		password: config.password,
	});

	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
	await connection.end();
};

// Test connection and create database if it doesn't exist
const initializeDatabase = async () => {
	try {
		await createDatabaseIfNotExists();
		await sequelize.authenticate();
		logger.info('MySQL connection has been established successfully.');
	} catch (error) {
		logger.error('Unable to connect to the database:', error);
	}
};

// Create Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: config.dialect,
	port: config.dbPort,
	logging: false, // Set to `console.log` to enable SQL query logging
});

// Import models
const db = {
	Tokens: require('../modules/tokens/token.model')(sequelize),
	Users: require('../modules/users/user.model')(sequelize),
	Otps: require('../modules/otps/otp.model')(sequelize),
	Message: require('../modules/chats/message.model')(sequelize),
	Conversation: require('../modules/chats/conversation.model')(sequelize),
	Group: require('../modules/chats/groups.model')(sequelize)

};

// Tables associations

//Users table relationships
db.Tokens.belongsTo(db.Users, {
	foreignKey: 'userId',
});

// Message and Conversation table relationships
db.Conversation.hasMany(db.Message, {
	foreignKey: 'conversationId',
	as: 'Messages',
});

db.Message.belongsTo(db.Conversation, {
	foreignKey: 'conversationId',
});

db.Users.belongsToMany(db.Conversation, {
	through: 'UserConversations'
});

db.Conversation.belongsToMany(db.Users, {
	through: 'UserConversations'
});

db.Users.hasMany(db.Message, {
	foreignKey: 'senderId',
	as: 'SentMessages',
});

db.Conversation.belongsTo(db.Users, {
	as: 'participant1',
	foreignKey: 'participant1Id',
	targetKey: 'id'
});

db.Conversation.belongsTo(db.Users, {
	as: 'participant2',
	foreignKey: 'participant2Id',
	targetKey: 'id'
});

db.Users.hasMany(db.Conversation, {
	as: 'participant1',
	foreignKey: 'participant1Id',
	targetKey: 'id'
});

db.Users.hasMany(db.Conversation, {
	as: 'participant2',
	foreignKey: 'participant2Id',
	targetKey: 'id'
});

db.Group.belongsTo(db.Conversation, {
    foreignKey: 'conversationId', // Foreign key in Group table linking to Conversation table
    as: 'conversation',
  });



db.Sequelize = Sequelize;

module.exports = {
	sequelize,
	db,
	initializeDatabase
};