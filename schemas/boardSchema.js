import Joi from "joi";

export const createBoardSchema = Joi.object({
  title: Joi.string().required(),
  icon: Joi.string(),
  background: Joi.string(),
});

export const updateBoardSchema = Joi.object({
  title: Joi.string(),
  icon: Joi.string(),
  background: Joi.string(),
});
