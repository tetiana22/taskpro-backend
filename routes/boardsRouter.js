const express = require('express');
const boardsControllers = require('../controllers/boardsControllers.js');
const { authenticate, validateBody } = require('../helpers');
const {
  createBoardSchema,
  updateBoardSchema,
} = require('../schemas/boardSchema.js');
const { isIdValid } = require('../helpers');

const boardsRouter = express.Router();

boardsRouter.get('/', authenticate, boardsControllers.getAllBoards);

boardsRouter.post(
  '/',
  authenticate,
  validateBody(createBoardSchema),
  boardsControllers.addBoard
);

boardsRouter.put(
  '/:boardId',
  authenticate,
  isIdValid,
  validateBody(updateBoardSchema),
  boardsControllers.updateBoard
);

boardsRouter.delete(
  '/:boardId',
  authenticate,
  isIdValid,
  boardsControllers.deleteBoard
);

module.exports = boardsRouter;
