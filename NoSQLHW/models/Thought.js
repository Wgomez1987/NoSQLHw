const mongoose = require('mongoose');
const reactionSchema = require('./Reaction'); // Assuming you will have a Reaction.js for the schema
const moment = require('moment');
const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => {
        // Assuming you will use a date-formatting function like `moment`
        return moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
      }
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema] // Embedding reactionSchema as an array
  },
  {
    toJSON: {
      virtuals: true, // We need this to include our virtual when data is requested
      getters: true // We need this to transform data by getters
    },
    id: false // Prevent id virtuals from being created
  }
);

// Virtual called reactionCount that retrieves the length of the thought's reactions array field on query
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;