
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, trim: true,maxlength: 50 },
  specialization: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  location: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  experience: { type: Number, required: true, min: 1, max: 100 }, // Example min and max values, adjust as needed
  availability: { type: [String], required: true, validate: [arrayMaxLengthValidator, 'Array exceeds maximum length'] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

function arrayMaxLengthValidator(arr) {
  return arr.length <= 7; 
}

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;