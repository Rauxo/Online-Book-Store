const express = require('express');
const router = express.Router();
const { getFavourites, addToFavourites, removeFromFavourites } = require('../controllers/favouriteController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFavourites);
router.post('/:bookId', protect, addToFavourites);
router.delete('/:bookId', protect, removeFromFavourites);

module.exports = router;
