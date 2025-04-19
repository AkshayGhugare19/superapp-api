const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const {db} = require('../db/db');

function auth(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    const secret = process.env.JWT_SECRET;

    return [
        (req, res, next) => {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    statusCode: httpStatus.UNAUTHORIZED,
                    message: 'Unauthorized: Token not found',
                });
            }

            jwt.verify(token, secret, async (err, decoded) => {
                if (err) {
                    return res.status(httpStatus.UNAUTHORIZED).json({
                        statusCode: httpStatus.UNAUTHORIZED,
                        message: 'Unauthorized: Invalid token',
                    });
                }

                req.user = decoded;

                try {
                    const user = await db.Users.findOne({ where: { id: req.user.sub } });

                    if (!user) {
                        return res.status(httpStatus.UNAUTHORIZED).json({
                            statusCode: httpStatus.UNAUTHORIZED,
                            message: 'Unauthorized: User not found',
                        });
                    }

                    if (user.isAccountLocked) {
                        return res.status(httpStatus.FORBIDDEN).json({
                            statusCode: httpStatus.FORBIDDEN,
                            message: 'The account is blocked temporarily. Please check your email',
                        });
                    }

                    if (roles.length && !roles.includes(user.role)) {
                        return res.status(httpStatus.FORBIDDEN).json({
                            statusCode: httpStatus.FORBIDDEN,
                            message: 'Forbidden: Insufficient role privileges',
                        });
                    }

                    req.user = { ...req.user, ...user.get({ plain: true }) };
                    next();
                } catch (error) {
                    console.error('Authorization error:', error);
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Internal server error',
                    });
                }
            });
        },
    ];
}

module.exports = auth;
