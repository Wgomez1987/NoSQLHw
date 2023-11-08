const User = require('../models/User.js');

const userController = {
  
  getAllUsers(req, res) {
    User.find({})
      .select('-__v') 
      .then(users => res.json(users))
      .catch(err => res.status(500).json(err));
  },

  
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

 
  createUser(req, res) {
    User.create(req.body)
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  },

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

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }

        res.json({ message: 'User successfully deleted!' });
      })
      .catch(err => res.status(500).json(err));
  },

  
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } }, 
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