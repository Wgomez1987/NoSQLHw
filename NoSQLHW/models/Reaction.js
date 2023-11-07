const mongoose = require('mongoose');
const moment = require('moment');

const reactionSchema = new mongoose.Schema(
  {
    reactionId: {
      // This is like a primary key in SQL
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => {
        // Assuming you will use a date-formatting function like `moment`
        return moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
      }
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

module.exports = reactionSchema;