const { User } = require("./userModel");
const express = require("express");
//const defaultImg = require("../../assets/user-default-image.png");
const {
  comparePassword,
  generateHashPassword,
} = require("../../services/bcrypt");
const auth = require("../../middlewares/middleware");
const router = express.Router();
const chalk = require("chalk");
const { validateRegistration } = require("./usersValidation/registration");
const validateLogIn = require("./usersValidation/logIn");
const { generateAuthToken } = require("../../services/token");

router.post("/register", async (req, res) => {
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("user already registered");

    user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      image: req.body.image
        ? req.body.image
        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };

    user = new User(user);
    user.password = generateHashPassword(user.password);
    await user.save();
    return res.send(user);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { error } = validateLogIn(req.body);
  if (error) return res.status(400).send("Invalid email or password.");

  let loggedUser = await User.findOne({ email: req.body.email });
  if (!loggedUser) return res.status(400).send("Invalid email or password.");

  const validPassword = comparePassword(req.body.password, loggedUser.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  res.json({
    token: generateAuthToken(loggedUser),
  });
});

router.get(
  "/allUsers",
  /* auth, */ async (req, res) => {
    try {
      const users = await User.find();
      return res.send(users);
    } catch (error) {
      console.log(chalk.redBright(error.message));
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
