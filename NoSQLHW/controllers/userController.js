const User = require('../models/User');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find({})
      .select('-__v') // Exclude the version key
      .then(users => res.json(users))
      .catch(err => res.status(500).json(err));
  },

  // Get a single user by id and populate thought and friend data
  getUserById(req, res) {
    User.findById(req.params.userId)
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(user);
      })
      .catch(err => res.status(500).json(err));
  },

  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  },

  // Update a user by id
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
  },

  // Delete a user by id
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        // Optional: Delete the user's thoughts when the user is deleted
        // Thought.deleteMany({ _id: { $in: user.thoughts } })
        res.json({ message: 'User successfully deleted!' });
      })
      .catch(err => res.status(500).json(err));
  },

  // Add a friend to a user's friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } }, // $addToSet prevents duplicates
      { new: true }
    )
    .populate('friends')
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
  },

  // Remove a friend from a user's friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    .populate('friends')
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
  }
};

module.exports = userController;