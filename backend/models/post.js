const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, require: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}      // THIS IS A STATIC PROPERY WHICH MEANS IT CANNOT BE INHERETED FROM  nor INSTANTIATED!!!!! SECURITY
});

module.exports = mongoose.model('Post', postSchema);
