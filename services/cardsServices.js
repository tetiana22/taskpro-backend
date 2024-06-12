import HttpError from "../helpers/HttpError.js";
import { cardSchema } from "../models/Card.js";

const getAllCards = async (boardId, owner) => {
  const cards = await cardSchema.find({ boardId, owner });

  if (!cards) {
    throw HttpError(404);
  }

  return cards;
};

const addCards = async (owner, data) => {
  const newCard = await cardSchema.create({ ...data, owner });
  return newCard;
};

const updateCard = async (id, owner, data) => {
  const updatedCard = await cardSchema.findOneAndUpdate(
    {
      _id: id,
      owner,
    },
    data,
    {
      new: true,
    }
  );

  return updatedCard;
};

const removeCard = async (id, owner) => {
  const deletedCard = await cardSchema.findOneAndDelete({ _id: id, owner });

  return deletedCard;
};

const updateColumnIdInCard = async (id, owner, { columnId, index }) => {
  const updatedCard = await cardSchema.findOneAndUpdate(
    { _id: id, owner },
    { $set: { columnId, index } },
    { new: true }
  );

  return updatedCard;
};

export default {
  updateColumnIdInCard,
  removeCard,
  updateCard,
  getAllCards,
  addCards,
};
