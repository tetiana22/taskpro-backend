const Joi = require('joi');

const createBoardSchema = Joi.object({
  title: Joi.string().required(),
  icon: Joi.string(),
  background: Joi.string(),
});

const updateBoardSchema = Joi.object({
  title: Joi.string(),
  icon: Joi.string(),
  background: Joi.string(),
});

module.exports = {
  createBoardSchema,
  updateBoardSchema,
};
