const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const Comment = require("../models/Comment.model");
const Recipe = require("../models/Recipe.model");

router.post(
  "/recipes/:recipeId/comments",
  isAuthenticated,
  async (req, res, next) => {
    const { recipeId } = req.params;
    const { text } = req.body;

    try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      const newComment = await Comment.create({
        userId: req.tokenPayload.userId,
        recipeId: recipeId,
        text: text,
      });

      return res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/recipes/:recipeId/comments", async (req, res, next) => {
  const { recipeId } = req.params;

  try {
    const comments = await Comment.find({ recipeId }).populate(
      "userId",
      "username"
    );
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

router.put("/comments/:commentId", isAuthenticated, async (req, res, next) => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.tokenPayload.userId) {
      return res
        .status(401)
        .json({ message: "You can only update your own comments" });
    }

    comment.text = text;
    const updatedComment = await comment.save();

    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/comments/:commentId",
  isAuthenticated,
  async (req, res, next) => {
    const { commentId } = req.params;

    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.userId.toString() !== req.tokenPayload.userId) {
        return res
          .status(401)
          .json({ message: "You can only delete your own comments" });
      }

      await Comment.findByIdAndDelete(commentId);
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
