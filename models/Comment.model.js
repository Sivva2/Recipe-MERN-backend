const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
