const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const Recipe = require("../models/Recipe.model");

const router = require("express").Router();


router.get("/recipes", async (req, res, next) => {
  try {
    const allRecipes await Recipe.find().populate("userId", {
      passwordHash: 0,
    });
    res.status(200).json(allRecipes);
  } catch (error) {
    next(error);
  }
});

router.get("/recipes/:recipeId", async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipe.findById(recipeId).populate("userId", {
      passwordHash: 0,
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    next(error);
  }
});

router.post("/recipes", isAuthenticated, async (req, res, next) => {
  try {
    const newRecipe = await Recipe.create({
      ...req.body,
      userId: req.tokenPayload.userId,
    });
    res.status(201).json(newRecipe);
  } catch (error) {
    next(error);
  }
});

router.delete("/recipes/:recipeId", isAuthenticated, async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const recipeTarget = await Recipe.findById(recipeId);
    if (!recipeTarget) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (recipeTarget.userId == req.tokenPayload.userId) {
      await Recipe.findByIdAndDelete(recipeId);
      res.status(200).json({ message: "Recipe deleted successfully" });
    } else {
      res
        .status(401)
        .json({ message: "You cannot delete recipes that are not yours" });
    }
  } catch (error) {
    next(error);
  }
});


router.put("/recipes/:recipeId", isAuthenticated, async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const recipeTarget = await Recipe.findById(recipeId);
    if (!recipeTarget) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (recipeTarget.userId == req.tokenPayload.userId) {
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { ...req.body },
        { new: true }
      );
      res.status(200).json(updatedRecipe);
    } else {
      res
        .status(401)
        .json({ message: "You cannot update recipes that are not yours" });
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
