const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema(
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
    amountRequested: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'PENDING',
      enum: ['PENDING', 'APPROVED', 'DECLINED'],
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Request', requestSchema);
