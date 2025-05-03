const Joi = require('joi');


const createGroupSchema = {
  body: Joi.object({
  groupName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.base': 'Group name must be a text.',
      'string.empty': 'Group name is required.',
      'any.required': 'Group name is required.',
      'string.max': 'Group name must be at most 100 characters.',
    }),

  groupDescription: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Group description must be at most 500 characters.',
    }),

  groupImage: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Group image must be a valid URL.',
    }),

  participantIds: Joi.array()
    .items(Joi.string().uuid().required().messages({
      'string.uuid': 'Each participant ID must be a valid UUID.',
    }))
    .min(1)
    .unique()
    .required()
    .messages({
      'array.base': 'Participant list must be an array.',
      'array.min': 'At least one participant (besides admin) is required.',
      'array.unique': 'Participant IDs must not contain duplicates.',
      'any.required': 'Participant list is required.',
    }),
})
};

const addMembersSchema = {
  body: Joi.object({
    participantIds: Joi.array()
      .items(Joi.string().uuid().required().messages({
        'string.uuid': 'Each participant ID must be a valid UUID.',
      }))
      .min(1)
      .unique()
      .required()
      .messages({
        'array.base': 'Participant list must be an array.',
        'array.min': 'At least one participant is required.',
        'array.unique': 'Participant IDs must not contain duplicates.',
        'any.required': 'Participant list is required.',
      }),
  })
};

module.exports = {
  createGroupSchema,
  addMembersSchema,
};
