const express = require('express');
const { authenticate, validateBody } = require('../helpers');
const cardsControllers = require('../controllers/cardsControllers.js');
const {
  createCardSchema,
  updateCardSchema,
  updateColumnIdInCardSchema,
} = require('../schemas/cardSchema.js');
const { isIdValid } = require('../helpers');

const cardsRouter = express.Router();

cardsRouter.get('/:boardId', authenticate, cardsControllers.getAllCards);

cardsRouter.post(
  '/',
  authenticate,
  validateBody(createCardSchema),
  cardsControllers.addCard
);

cardsRouter.put(
  '/:cardId',
  authenticate,
  isIdValid,
  validateBody(updateCardSchema),
  cardsControllers.updateCard
);

cardsRouter.patch(
  '/:cardId',
  authenticate,
  isIdValid,
  validateBody(updateColumnIdInCardSchema),
  cardsControllers.updateColumnIdInCard
);

cardsRouter.delete(
  '/:cardId',
  authenticate,
  isIdValid,
  cardsControllers.deleteCard
);

module.exports = cardsRouter;
