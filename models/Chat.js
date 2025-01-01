const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    sponsor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    startup: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
