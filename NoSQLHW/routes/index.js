const express = require('express');
const router = express.Router();

// Import other route files
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// Set up the routes
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

// Export the router
module.exports = router;