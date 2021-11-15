const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello windwos");
});

require("./controller/AuthController")(app);
require("./controller/ProjectController")(app);

app.listen(3000);
