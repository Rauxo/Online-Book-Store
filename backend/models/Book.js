const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length >= 1 && v.length <= 4;
      },
      message: 'A book must have between 1 and 4 images.'
    }
  },
  description: { type: String },
  category: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
