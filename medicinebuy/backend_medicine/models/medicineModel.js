const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  product: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  manufacturer: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  expiryDate: { type: Date, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true, minlength: 2, maxlength: 255 },
  category: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  imageUrl: { type: String, required: true }, // imageUrl is not required by default, adjust as needed
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;