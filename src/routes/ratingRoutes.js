const express = require('express');
const {
  addOrUpdateRating,
  getStoreRatings
} = require('../controllers/ratingController');
const {
  authenticate,
  authorizeRoles
} = require('../middlewares/auth');

const router = express.Router();

// Debug log to ensure functions are loaded
console.log({
  addOrUpdateRating: typeof addOrUpdateRating,
  getStoreRatings: typeof getStoreRatings,
  authenticate: typeof authenticate,
  authorizeRoles: typeof authorizeRoles
});

// Normal user can add or update their rating
router.post('/', authenticate, authorizeRoles('normal'), addOrUpdateRating);

// Store owner can view ratings for their store
router.get('/:id', authenticate, authorizeRoles('store_owner'), getStoreRatings);

module.exports = router;
