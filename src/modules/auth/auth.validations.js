const Joi = require('joi');
const { gender, roles } = require('../../config/enums');

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const renewToken = {
	body: Joi.object({
		refreshToken: Joi.string().trim().required().messages({
			'string.base': `Refresh token must be a string.`,
			'string.empty': `Refresh token cannot be empty.`,
			'any.required': `Refresh token is required.`
		}),
	}),
};

const verifyEmail = {
	query: Joi.object({
		token: Joi.string().trim().required().messages({
			'string.base': `Token must be a string.`,
			'string.empty': `Token cannot be empty.`,
			'any.required': `Token is required.`
		}),
	}),
};

const changePassword = {
	body: Joi.object({
		newPassword: Joi.string().trim().required().messages({
			'string.base': `newPassword must be a string.`,
			'string.empty': `newPassword cannot be empty.`,
			'any.required': `newPassword is required.`
		}),
		currentPassword: Joi.string().trim().required().messages({
			'string.base': `currentPassword must be a string.`,
			'string.empty': `currentPassword cannot be empty.`,
			'any.required': `currentPassword is required.`
		}),
	}),
};

const registerAdmin = {
	body: Joi.object({
		firstName: Joi.string().trim().pattern(/^[A-Za-z ]+$/).required().messages({
			'string.pattern.base': `Only alphabetic characters are allowed for the 'first name' field.`,
			'string.empty': `The 'first name' field is required and cannot be empty. Please provide a valid first name.`,
			'any.required': `The 'first name' field is required. Please include it in your request.`,
		}),
		middleName: Joi.string().trim().pattern(/^[A-Za-z ]+$/).required().messages({
			'string.pattern.base': `Only alphabetic characters are allowed for the 'middle name' field.`,
			'string.empty': `The 'middle name' field is required and cannot be empty. Please provide a valid middle name.`,
			'any.required': `The 'middle name' field is required. Please include it in your request.`,
		}),
		lastName: Joi.string().trim().pattern(/^[A-Za-z ]+$/).required().messages({
			'string.pattern.base': `Only alphabetic characters are allowed for the 'last name' field.`,
			'string.empty': `The 'last name' field is required and cannot be empty. Please provide a valid last name.`,
			'any.required': `The 'last name' field is required. Please include it in your request.`,
		}),
		phone: Joi.string().trim().pattern(/^\+?([1-9]\d{0,2})(\d{10,12})$/).required().messages({
			'string.pattern.base': `The 'phone number' field must be a valid phone number with at least 11 digits with country code.`,
			'any.required': `The 'phone number' field is required. Please include it in your request.`,
			'string.empty': `The 'phone number' field cannot be empty. Please provide a valid phone number.`,
		}),
		email: Joi.string().trim().email().required().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`,
			'string.empty': `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
		dateOfBirth: Joi.date().iso().less(new Date()).max(eighteenYearsAgo).required().messages({
			'date.base': `The 'birth date' field must be a valid date.`,
			'date.less': `The 'birth date' field must be a date in the past.`,
			'date.max': `The 'birth date' field must be at least 18 years ago from today.`,
			'any.required': `The 'birth date' field is required. Please include it in your request.`,
		}),
		gender: Joi.string().trim().required().valid(...Object.values(gender)).messages({
			'string.empty': `The 'gender' field is required and cannot be empty. Please provide a valid gender.`,
			'any.required': `The 'gender' field is required. Please include it in your request.`,
			'any.only': `The 'gender' field must be one of ${Object.values(gender).join(", ")}.`,
		}),
		password: Joi.string().trim().min(8).pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/).required().messages({
			'string.min': `The 'password' field must be at least 8 characters long.`,
			'string.pattern.base': `The 'password' field must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`,
			'any.required': `The 'password' field is required. Please include it in your request.`,
			'string.empty': `The 'password' field cannot be empty. Please provide a valid password.`,
		}),
	}),
};


const loginAdmin = {
	body: Joi.object({
		email: Joi.string().trim().custom((value, helper) => {
			const phoneRegex = /^\+?([1-9]\d{0,2})(\d{10,12})$/;
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
		role: Joi.string().valid(...Object.values(roles)).default('user').required().messages({
			'any.only': `The 'role' field must be one of ${Object.values(roles).join(", ")}.`,
			'any.required': `The 'role' field is required. Please include it in your request.`,
		}),
	})
};

module.exports = {
	renewToken, verifyEmail,
	registerAdmin, loginAdmin, changePassword
};
