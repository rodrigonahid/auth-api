const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../modules/mailer");

const User = require("../model/User");

const AuthController = {
  register: async (req, res) => {
    const { email, id } = req.body;
    try {
      if (await User.findOne({ email })) {
        return res.status(400).send({ error: "User already exists" });
      }
      const user = await User.create(req.body);
      user.password = undefined;

      const token = AuthController.generateToken(id);

      return res.send({ user, token });
    } catch (err) {
      return res.status(400).send({ error: "Registration failed" });
    }
  },
  authenticate: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).send({ error: "Invalid user" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    user.password = undefined;

    const token = AuthController.generateToken(user.id);
    res.send({ user, token });
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send({ error: "user not found" });
      const token = crypto.randomBytes(20).toString("hex");
      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
      });
      mailer.sendMail(
        {
          to: email,
          from: "rodrigonahid1@gmail.com",
          template: "auth/forgot_password",
          context: { token },
        },
        (err) => {
          if (err) {
            console.log(err);
            return res
              .status(400)
              .send({ error: "Cannot send forgot password email" });
          }
          return res.send();
        }
      );
    } catch (err) {
      res.status(400).send({ err: "Erro on forgot pwd" });
    }
  },
  generateToken: (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRET_JWT, {
      expiresIn: 86400,
    });
  },
};

module.exports = AuthController;
