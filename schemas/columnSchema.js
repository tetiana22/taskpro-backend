const Joi = require('joi');

const createColumnSchema = Joi.object({
  title: Joi.string().required(),
  cards: Joi.array(),
  boardId: Joi.string().required(),
});

const updateColumnSchema = Joi.object({
  title: Joi.string(),
  cards: Joi.array(),
  boardId: Joi.string(),
});

module.exports = {
  createColumnSchema,
  updateColumnSchema,
};
