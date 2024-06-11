const { Schema, model } = require('mongoose');
const handleMongooseError = require('../helpers/handleMongooseError');

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title for column'],
    },
    boardId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
columnSchema.post('save', handleMongooseError);
const Column = model('column', columnSchema);

module.exports = {
  Column,
};
