const Joi = require('joi');

const submitKycSchema = {
	body: Joi.object({
		country: Joi.string().length(2).required().messages({
			'string.length': `'country' must be a valid 2-letter country code.`,
			'any.required': `'country' field is required.`,
			'string.empty': `'country' field cannot be empty.`
		}),
		id_type: Joi.string().valid('PASSPORT', 'ID_CARD', 'DRIVERS_LICENSE').required().messages({
			'any.only': `'id_type' must be one of 'PASSPORT', 'ID_CARD', 'DRIVERS_LICENSE'.`,
			'any.required': `'id_type' field is required.`
		}),
		selfie: Joi.string().required().messages({
			'any.required': `'selfie' field is required.`,
			'string.empty': `'selfie' field cannot be empty.`
		}),
		id_front: Joi.string().required().messages({
			'any.required': `'id_front' field is required.`,
			'string.empty': `'id_front' field cannot be empty.`
		}),
		id_back: Joi.string().when('id_type', {
			is: 'PASSPORT',
			then: Joi.forbidden().messages({
				'any.unknown': `'id_back' is not required when id_type is 'PASSPORT'.`
			}),
			otherwise: Joi.required().messages({
				'any.required': `'id_back' is required when id_type is not 'PASSPORT'.`
			})
		})
	})
};

const kycCallbackSchema = {
	body: Joi.object({
		SmileJobID: Joi.string().required().messages({
			'any.required': `'SmileJobID' is required.`,
			'string.empty': `'SmileJobID' cannot be empty.`
		}),
		ResultCode: Joi.string().required().messages({
			'any.required': `'ResultCode' is required.`,
			'string.empty': `'ResultCode' cannot be empty.`
		}),
		ResultText: Joi.string().required().messages({
			'any.required': `'ResultText' is required.`,
			'string.empty': `'ResultText' cannot be empty.`
		}),
		IsFinalResult: Joi.boolean().required().messages({
			'any.required': `'IsFinalResult' is required.`,
			'boolean.base': `'IsFinalResult' must be a boolean.`
		}),
		Actions: Joi.object({
			Liveness_Check: Joi.string().optional(),
			Register_Selfie: Joi.string().optional(),
			Verify_Document: Joi.string().optional(),
			Human_Review_Compare: Joi.string().optional(),
			Return_Personal_Info: Joi.string().optional(),
			Selfie_To_ID_Card_Compare: Joi.string().optional(),
			Human_Review_Liveness_Check: Joi.string().optional()
		}).required().messages({
			'any.required': `'Actions' field is required.`,
			'object.base': `'Actions' must be an object.`
		}),
		PartnerParams: Joi.object({
			job_id: Joi.string().required().messages({
				'any.required': `'job_id' is required in PartnerParams.`,
				'string.empty': `'job_id' in PartnerParams cannot be empty.`
			}),
			user_id: Joi.string().required().messages({
				'any.required': `'user_id' is required in PartnerParams.`,
				'string.empty': `'user_id' in PartnerParams cannot be empty.`
			}),
			job_type: Joi.string().required().messages({
				'any.required': `'job_type' is required in PartnerParams.`,
				'string.empty': `'job_type' in PartnerParams cannot be empty.`
			})
		}).required().messages({
			'any.required': `'PartnerParams' is required.`,
			'object.base': `'PartnerParams' must be an object.`
		}),
		signature: Joi.string().required().messages({
			'any.required': `'signature' field is required.`,
			'string.empty': `'signature' field cannot be empty.`
		}),
		timestamp: Joi.string().required().messages({
			'any.required': `'timestamp' field is required.`,
			'string.empty': `'timestamp' field cannot be empty.`
		})
	})
};


module.exports = {
  submitKycSchema,
  kycCallbackSchema
}; 