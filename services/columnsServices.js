import { HttpError } from "../helpers/index.js";
import { cardSchema } from "../models/Card.js";
import { columnSchema } from "../models/Column.js";

const getAllColumns = async (id, owner) => {
  const columns = await columnSchema.find({ boardId: id, owner });

  if (!columns) {
    throw HttpError(404);
  }

  return columns;
};

const addColumn = async (owner, data) => {
  const exist = await columnSchema.findOne({ title: data.title });

  if (exist) {
    return {
      error: "Column with such title already exists",
    };
  }
  const newColumn = await columnSchema.create({ ...data, owner });

  return newColumn;
};

const updateColumn = async (id, owner, data) => {
  const updatedColumn = await columnSchema.findOneAndUpdate(
    { _id: id, owner },
    data,
    { new: true }
  );

  return updatedColumn;
};

const removeColumn = async (id, owner) => {
  const deletedColumn = await columnSchema.findOneAndDelete({
    _id: id,
    owner,
  });

  await cardSchema.deleteMany({ columnId: id, owner });

  return deletedColumn;
};

export default {
  getAllColumns,
  addColumn,
  updateColumn,
  removeColumn,
};
