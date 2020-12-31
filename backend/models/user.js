const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },    // unique nije validator pa ne mozemo da dobije error
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator) // sad mozemo da dobijemo error ako je duplikat e-maila

module.exports = mongoose.model('User', userSchema);
