const express = require("express");
const middleware = require("../middlewares/auth");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ ok: true });
});

module.exports = (app) => app.use("/projects", middleware, router);
