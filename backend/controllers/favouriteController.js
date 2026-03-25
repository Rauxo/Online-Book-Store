const Favourite = require('../models/Favourite');

// @desc    Get user favourites
// @route   GET /api/favourites
exports.getFavourites = async (req, res) => {
  try {
    const favs = await Favourite.findOne({ user: req.user._id }).populate('books');
    res.json(favs ? favs.books : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add book to favourites
// @route   POST /api/favourites/:bookId
exports.addToFavourites = async (req, res) => {
  try {
    let fav = await Favourite.findOne({ user: req.user._id });
    if (!fav) {
      fav = await Favourite.create({ user: req.user._id, books: [req.params.bookId] });
    } else {
      if (!fav.books.includes(req.params.bookId)) {
        fav.books.push(req.params.bookId);
        await fav.save();
      }
    }
    res.json(fav);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove book from favourites
// @route   DELETE /api/favourites/:bookId
exports.removeFromFavourites = async (req, res) => {
  try {
    const fav = await Favourite.findOne({ user: req.user._id });
    if (fav) {
      fav.books = fav.books.filter(id => id.toString() !== req.params.bookId);
      await fav.save();
    }
    res.json(fav ? fav.books : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
