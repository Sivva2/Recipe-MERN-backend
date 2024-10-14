const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const router = require("express").Router();

router.post("/signup", async (req, res, next) => {
  const userToCreate = req.body;

  const salt = bcrypt.genSaltSync(13);

  userToCreate.passwordHash = bcrypt.hashSync(req.body.password, salt);

  try {
    const newUser = await User.create(userToCreate);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const potentialUser = await User.findOne({ username: req.body.username });
    if (potentialUser) {
      if (bcrypt.compareSync(req.body.password, potentialUser.passwordHash)) {
        // Password is correct
        const authToken = jwt.sign(
          { userId: potentialUser._id },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "6h",
          }
        );
        res.json({ token: authToken });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "No user with this username" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.tokenPayload.userId);
    res.json(currentUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
