const HttpError = require("./HttpError.js");
const Joi = require("joi");

const validateBody = (schema) => {
  const func = (req, _, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(HttpError(400, "Body must have at least one field"));
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }

    next();
  };

  return func;
};

module.exports = validateBody;
