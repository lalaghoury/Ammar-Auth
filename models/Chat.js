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
    messages: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Message',
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
