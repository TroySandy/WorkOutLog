require("dotenv").config();
const Express = require("express");
const router = Express.Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  let { username, passwordhash } = req.body.user;
  try {
    const User = await UserModel.create({
      username,
      passwordhash: bcrypt.hashSync(passwordhash, 15),
    });
    let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
    res.status(201).json({
      message: "User Registered",
      user: User,
      sessionToken: token,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Username already taken",
      });
    } else {
      res.status(500).json({
        message: "Failed to register user",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  let { username, passwordhash } = req.body.user;
  try {
    let loginUser = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (loginUser) {
      let passwordhashComparison = await bcrypt.compare(
        passwordhash,
        loginUser.passwordhash
      );

      if (passwordhashComparison) {
        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
        res.status(200).json({
          user: loginUser,
          message: "You are logged in",
          sessionToken: token,
        });
      } else {
        res.status(401).json({
          message: "Incorrect Login Information",
        });
      }
    } else {
      res.status(401).json({
        message: "Incorrect Login Information",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Incorrect Login Information",
    });
  }
});

module.exports = router;
