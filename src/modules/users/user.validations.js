const Joi = require('joi');
const { userRoles, roles, gender } = require('../../config/enums');

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const registerUser = {
	body: Joi.object({
		phone: Joi.string().trim().pattern(/^\d{6,15}$/).messages({
			'string.pattern.base': `The 'phone number' field must be a valid phone number with 6 to 15 digits including the country code.`,
			'string.empty': `The 'phone number' field cannot be empty.`,
		}),
		email: Joi.string().trim().email().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'string.empty': `The 'email' field cannot be empty.`,
		}),
		role: Joi.string().valid(...Object.values(userRoles)).default('user').required().messages({
			'any.only': `The 'role' field must be one of ${Object.values(userRoles).join(", ")}.`,
			'any.required': `The 'role' field is required. Please include it in your request.`,
		}),
	}).or('phone', 'email').messages({
		'object.missing': `At least one of 'phone' or 'email' must be provided.`,
	}),
};


const loginUser = {
	body: Joi.object({
		email: Joi.string().trim().custom((value, helper) => {
			const phoneRegex = /^\d{6,15}$/;
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

			if (emailRegex.test(value)) {
				return value;
			}

			if (phoneRegex.test(value)) {
				return value;
			}

			return helper.message('Email or phone number must be valid.');
		}).required().messages({
			'any.required': `The 'email' field is required. Please include it in your request.`,
		}),
		password: Joi.string().trim().required().custom((value, helpers) => {
			if (value && value.length < 42) {
				return helpers.message('Password must be encrypted');
			}
			return value;
		}).messages({
			'any.required': `The 'password' field is required. Please include it in your request.`,
			'string.empty': `The 'password' field cannot be empty. Please provide a valid password.`,
		}),
		role: Joi.string().valid(...Object.values(userRoles)).default('user').required().messages({
			'any.only': `The 'role' field must be one of ${Object.values(userRoles).join(", ")}.`,
			'any.required': `The 'role' field is required. Please include it in your request.`,
		}),
	}),
};

const updateUser = {
	body: Joi.object({
		name: Joi.string().trim().min(1).max(255).optional().messages({
			'string.empty': `The 'name' field cannot be empty.`,
		}),
		username: Joi.string().trim().min(1).max(255).optional().messages({
			'string.empty': `The 'username' field cannot be empty.`,
		}),
		phone: Joi.number().integer().min(1000000000).max(999999999999).optional().messages({
			'number.base': `The 'phone' field must be a valid number.`,
			'number.min': `The 'phone' number seems too short.`,
			'number.max': `The 'phone' number seems too long.`,
		}),
		countryCode: Joi.string().trim().optional(),
		email: Joi.string().trim().email().optional().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'string.empty': `The 'email' field cannot be empty.`,
		}),
		password: Joi.string().optional().custom((value, helpers) => {
			if (value && value.length < 42) {
				return helpers.message('Password must be encrypted');
			}
			return value;
		}),
		profilePic: Joi.string().trim().uri().optional().messages({
			'string.uri': `The 'profilePic' field must be a valid URL.`,
		}),
		role: Joi.string().valid(...Object.values(roles)).optional().messages({
			'any.only': `The 'role' must be one of [${Object.values(roles).join(', ')}]`,
		}),
		dateOfBirth: Joi.date().iso().optional().messages({
			'date.base': `The 'dateOfBirth' must be a valid date.`,
		}),
		gender: Joi.string().valid(...Object.values(gender)).optional().messages({
			'any.only': `The 'gender' must be one of [${Object.values(gender).join(', ')}]`,
		}),
		location: Joi.string().trim().max(255).optional().messages({
			'string.max': `The 'location' field must be less than 255 characters.`,
		}),
		language: Joi.string().trim().max(255).optional().messages({
			'string.max': `The 'language' field must be less than 255 characters.`,
		}),
		isPrivate: Joi.boolean().optional(),
		isProfileCompleted: Joi.boolean().optional(),
		isAccountLocked: Joi.boolean().optional(),
		accountLockingReason: Joi.string().trim().max(255).optional(),
		isMobileVerified: Joi.boolean().optional(),
		isEmailVerified: Joi.boolean().optional(),
		loginAttempts: Joi.number().integer().optional(),
		resetToken: Joi.string().optional(),
	}),
};

const getbyId = {
	params: Joi.object({
		id: Joi.string().trim().guid({ version: 'uuidv4' }).required().messages({
			'string.empty': 'The "User Id" field cannot be empty.',
			'string.guid': 'The "User Id" must be a valid UUID.',
			'any.required': 'The "User Id" field is required. Please include it in your request.',
		}),
	}),
}

const sendOTP = {
	body: Joi.object({
		type: Joi.string().valid('phone', 'email').required()
			.messages({
				'any.only': `'type' must be either 'phone' or 'email'.`,
				'any.required': `'type' field is required.`,
			}),

		phone: Joi.alternatives().conditional('type', {
			is: 'phone',
			then: Joi.string().trim().pattern(/^\d{6,15}$/).required()
				.messages({
					'string.pattern.base': `Please enter a valid phone number.`,
					'string.empty': `The 'phone' field cannot be empty.`,
					'any.required': `The 'phone' field is required.`,
				}),
			otherwise: Joi.forbidden()
		}),

		countryCode: Joi.alternatives().conditional('type', {
			is: 'phone',
			then: Joi.string().trim().min(1).max(5).required()
				.messages({
					'string.empty': `The 'countryCode' field cannot be empty.`,
					'string.min': `The 'countryCode' is Invalid.`,
					'string.max': `The 'countryCode' is Invalid.`,
					'any.required': `The 'countryCode' field is required.`,
				}),
			otherwise: Joi.forbidden()
		}),

		email: Joi.alternatives().conditional('type', {
			is: 'email',
			then: Joi.string().trim().email().required()
				.messages({
					'string.email': `Please enter a valid email address.`,
					'string.empty': `The 'email' field cannot be empty.`,
					'any.required': `The 'email' field is required.`,
				}),
			otherwise: Joi.forbidden()
		}),
	})
};

const verifyOTP = {
	body: Joi.object({
		type: Joi.string().valid('phone', 'email').required()
			.messages({
				'any.required': `The 'type' field is required.`,
				'any.only': `The 'type' must be either 'phone' or 'email'.`,
			}),

		phone: Joi.alternatives().conditional('type', {
			is: 'phone',
			then: Joi.string().trim().pattern(/^\d{6,15}$/).required()
				.messages({
					'any.required': `The 'phone' field is required when type is 'phone'.`,
					'string.empty': `The 'phone' field cannot be empty.`,
					'string.pattern.base': `Please enter a valid phone number.`,
				}),
			otherwise: Joi.forbidden().messages({
				'any.unknown': `The 'phone' field is not allowed when type is 'email'.`
			})
		}),

		countryCode: Joi.alternatives().conditional('type', {
			is: 'phone',
			then: Joi.string().trim().min(1).max(5).optional()
				.messages({
					'string.empty': `The 'countryCode' cannot be empty.`,
					'string.min': `The 'countryCode' is invalid.`,
					'string.max': `The 'countryCode' is invalid.`,
				}),
			otherwise: Joi.forbidden().messages({
				'any.unknown': `The 'countryCode' field is not allowed when type is 'email'.`
			})
		}),

		email: Joi.alternatives().conditional('type', {
			is: 'email',
			then: Joi.string().trim().email().required()
				.messages({
					'any.required': `The 'email' field is required when type is 'email'.`,
					'string.email': `Please enter a valid email address.`,
				}),
			otherwise: Joi.forbidden().messages({
				'any.unknown': `The 'email' field is not allowed when type is 'phone'.`
			})
		}),

		otp: Joi.string().trim().length(6).required()
			.messages({
				'any.required': `The 'otp' field is required.`,
				'string.length': `The 'otp' must be exactly 6 digits.`,
			}),

		role: Joi.string().trim().valid('user', 'brand', 'consumer').required()
			.messages({
				'any.required': `The 'role' field is required.`,
				'any.only': `The 'role' must be either 'user', 'brand', or 'consumer'.`,
			}),
	}),
};

const verifyResetToken = {
	body: Joi.object({
		resetToken: Joi.string().trim().min(60).pattern(/^[a-z0-9]+$/).required()
			.messages({
				'string.required': `The 'resetToken' field is required.`,
				'string.empty': `The 'resetToken' field cannot be empty.`,
				'string.min': `Please enter a valid reset token.`,
				'string.pattern.base': `Please enter a valid reset token.`,
			}),
		otp: Joi.string().trim().min(6).max(6).required()
			.messages({
				'string.required': `The 'otp' field is required.`,
				'string.empty': `The 'otp' field cannot be empty.`,
				'string.min': `The 'otp' must be of 6 digit.`,
			}),
	}),
};

const resetPassword = {
	body: Joi.object({
		resetToken: Joi.string().trim().min(60).pattern(/^[a-z0-9]+$/).required()
			.messages({
				'string.required': `The 'resetToken' field is required.`,
				'string.empty': `The 'resetToken' field cannot be empty.`,
				'string.min': `Please enter a valid reset token.`,
				'string.pattern.base': `Please enter a valid reset token.`,
			}),
		password: Joi.string().trim().required().custom((value, helpers) => {
			if (value && value.length < 42) {
				return helpers.message('Password must be encrypted');
			}
			return value;
		}).messages({
			'any.required': `The 'password' field is required. Please include it in your request.`,
			'string.empty': `The 'password' field cannot be empty. Please provide a valid password.`,
		}),
	}),
};

module.exports = {
	registerUser,
	loginUser,
	updateUser,
	getbyId,
	sendOTP,
	verifyOTP,
	verifyResetToken,
	resetPassword
};
