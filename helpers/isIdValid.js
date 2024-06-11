const { isValidObjectId } = require('mongoose');
const HttpError = require('./HttpError');

const isIdValid = (req, _, next) => {
  const { boardId, columnId, cardId } = req.params;

  const id = boardId || columnId || cardId;

  if (!isValidObjectId(id)) {
    next(HttpError(400, `Requested id(${id}) is invalid`));
    return;
  }

  next();
};

module.exports = isIdValid;
