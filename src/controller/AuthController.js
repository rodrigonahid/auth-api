const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_JWT, {
    expiresIn: 86400,
  });
};

router.post("/register", async (req, res) => {
  const { email, id } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }
    const user = await User.create(req.body);
    user.password = undefined;

    const token = generateToken(id);

    return res.send({ user, token });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).send({ error: "Invalid user" });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Invalid credentials" });
  }
  user.password = undefined;

  const token = generateToken(user.id);
  res.send({ user, token });
});

module.exports = (app) => app.use("/auth", router);
