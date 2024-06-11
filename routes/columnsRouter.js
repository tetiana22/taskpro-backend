const express = require('express');
const { authenticate, validateBody } = require('../helpers');
const columnsControllers = require('../controllers/columnsControllers.js');
const {
  createColumnSchema,
  updateColumnSchema,
} = require('../schemas/columnSchema.js');
const { isIdValid } = require('../helpers');

const columnsRouter = express.Router();

columnsRouter.get('/:boardId', authenticate, columnsControllers.getAllColumns);

columnsRouter.post(
  '/',
  authenticate,
  validateBody(createColumnSchema),
  columnsControllers.addColumn
);

columnsRouter.put(
  '/:columnId',
  authenticate,
  isIdValid,
  validateBody(updateColumnSchema),
  columnsControllers.updateColumn
);

columnsRouter.delete(
  '/:columnId',
  authenticate,
  isIdValid,
  columnsControllers.deleteColumn
);

module.exports = columnsRouter;
