const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const Recipe = require("../models/Recipe.model");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const router = require("express").Router();

const multer = require("multer");

const upload = multer();

router.get("/recipes", async (req, res, next) => {
  try {
    const allRecipes = await Recipe.find().populate("userId", {
      passwordHash: 0,
    });
    res.status(200).json(allRecipes);
  } catch (error) {
    next(error);
  }
});

router.get("/api/recipes/search", async (req, res) => {
  const { ingredients } = req.query;
  if (!ingredients) {
    return res.status(400).json({ error: "Ingredients are required" });
  }

  const ingredientArray = ingredients.split(",").map((ing) => ing.trim());

  try {
    const recipes = await Recipe.find({
      ingredients: { $elemMatch: { name: { $in: ingredientArray } } },
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
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

router.post(
  "/recipes",
  isAuthenticated,
  upload.single("imageUrl"),
  async (req, res, next) => {
    const upload_stream = cloudinary.uploader.upload_stream(
      { public_id: "...id", resource_type: "auto", folder: "Recipes" },
      async (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json("error uploading image");
        } else {
          console.log("uploaded image", results);
          const ingredients = [];
          for (const [key, value] of Object.entries(req.body.ingredients)) {
            ingredients.push(JSON.parse(value));
          }
          const recipeToCreate = { ...req.body, ingredients };
          console.log(recipeToCreate.ingredients);
          try {
            const newRecipe = await Recipe.create({
              ...recipeToCreate,
              userId: req.tokenPayload.userId,
              imageUrl: results.url,
            });
            return res.status(201).json(newRecipe);
          } catch (error) {
            next(error);
          }
        }
      }
    );
    upload_stream.end(req.file.buffer);
  }
);

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

router.put(
  "/recipes/:recipeId",
  isAuthenticated,
  upload.single("imageUrl"),
  async (req, res, next) => {
    const { recipeId } = req.params;
    try {
      const recipeTarget = await Recipe.findById(recipeId);
      if (!recipeTarget) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      if (recipeTarget.userId == req.tokenPayload.userId) {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          recipeId,
          {
            ...req.body,
            imageUrl: req.file ? req.file.path : recipeTarget.imageUrl,
          },
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
  }
);

module.exports = router;
