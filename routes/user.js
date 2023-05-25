const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const base64 = require("crypto-js/enc-base64");

const User = require("../models/User");

//Route signup
router.post("/user/signup", async (req, res) => {
  try {
    // console.log(req.body);

    const { username, email, password, newsletter } = req.body;

    if (username && email && password && newsletter !== undefined) {
      const isUserExist = await User.findOne({ email });
      console.log(isUserExist);
      if (!isUserExist) {
        const salt = uid2(12);
        const token = uid2(16);
        const hash = SHA256(password + salt).toString(base64);
        console.log(hash);

        const newUser = new User({
          email,
          account: {
            username,
          },
          newsletter,
          token,
          hash,
          salt,
        });
        await newUser.save();
        return res.status(201).json({
          _id: newUser._id,
          token: newUser.token,
          account: {
            username: newUser.account.username,
          },
        });
      } else {
        return res.status(409).json({ message: "This email is not available" });
      }
    } else {
      return res.status(400).json({ message: "Missing parameters" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

//Route login
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email: email });
    console.log(userFound);
    if (userFound) {
      const newHash = SHA256(password + userFound.salt).toString(base64);
      console.log(newHash);
      if (userFound.hash === newHash) {
        return res.status(200).json({
          _id: userFound._id,
          token: userFound.token,
          account: {
            username: userFound.account.username,
          },
        });
      } else {
        return res.status(400).json({ message: "email or password not valid" });
      }
    } else {
      return res.status(400).json({ message: "email or password not valid" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
