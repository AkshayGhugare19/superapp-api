const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { db } = require('../db/db');

const jwtOptions = {
	secretOrKey: process.env.JWT_SECRET || config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
	try {
		if (payload.type !== tokenTypes.ACCESS) {
			throw new Error('Invalid token type');
		}
		if (payload.exp && payload.exp < Date.now() / 1000) {
			throw new Error('Token expired');
		}
		// Additional validation checks...
		const user = await db.Users.findOne({
			where: { id: payload.sub },
			include: [
				{
					model: db.SubRoles, // Reference your SubRole model from db
					as: 'subRoleObj'
				}
			]
		});
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		console.error('JWT verification error:', error);
		done(error, false);
	}
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
	jwtStrategy,
};

