const { Board } = require('../models/Board.js');
const { Card } = require('../models/Card.js');
const { Column } = require('../models/Column.js');
const { HttpError } = require('../helpers');

const listBoards = owner => Board.find({ owner });

const getOneBoardByFilter = filter => Board.findOne(filter);

const addBoard = async (owner, data) => {
  const exist = await Board.findOne({ owner, title: data.title });

  if (exist) {
    return {
      error: 'Board with such name already exists',
    };
  }

  const board = await Board.create({ owner, ...data });

  return board;
};

const updateBoard = async (boardId, owner, data) => {
  try {
    const updatedBoard = await Board.findOneAndUpdate(
      {
        _id: boardId,
        owner,
      },
      data,
      {
        new: true,
      }
    );

    return updatedBoard;
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return null;
    } else {
      throw error;
    }
  }
};

const removeBoard = async (owner, boardId) => {
  const deletedBoard = await Board.findOneAndDelete({
    _id: boardId,
    owner,
  });
  await Column.deleteMany({ boardId, owner });
  await Card.deleteMany({ boardId, owner });

  if (!deletedBoard) {
    throw HttpError(404);
  }

  return true;
};

module.exports = {
  listBoards,
  getOneBoardByFilter,
  addBoard,
  updateBoard,
  removeBoard,
};
