const Book = require('../models/Book');

// @desc    Get all books or search books
// @route   GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const { keyword } = req.query;
    let query = {};
    if (keyword) {
      query = {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { author: { $regex: keyword, $options: 'i' } }
        ]
      };
    }
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Add new book (Admin only)
// @route   POST /api/books
exports.addBook = async (req, res) => {
  const { title, author, price, description, category } = req.body;
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'At least one image is required.' });
  }

  const images = req.files.map(file => `/uploads/${file.filename}`);

  try {
    const book = await Book.create({
      title,
      author,
      price,
      images,
      description,
      category
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update book (Admin only)
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If new images are uploaded, update the images array
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete book (Admin only)
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
