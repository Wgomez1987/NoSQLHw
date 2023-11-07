const Thought = require('../models/Thought');
const User = require('../models/User');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .then(thoughts => res.json(thoughts))
      .catch(err => res.status(500).json(err));
  },

  // Get a single thought by id
  getThoughtById(req, res) {
    Thought.findById(req.params.thoughtId)
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
      })
      .catch(err => res.status(500).json(err));
  },

  // Create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then(thought => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  },

  // Update a thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then(thought => {
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(thought);
    })
    .catch(err => res.status(500).json(err));
  },

  // Delete a thought by id
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json({ message: 'Thought successfully deleted!' });
      })
      .catch(err => res.status(500).json(err));
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
    .then(thought => {
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id to add a reaction to!' });
      }
      res.json(thought);
    })
    .catch(err => res.status(500).json(err));
  },

  // Remove a reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
    .then(thought => res.json(thought))
    .catch(err => res.status(500).json(err));
  }
};

module.exports = thoughtController;