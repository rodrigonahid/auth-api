const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello windwos");
});

require("./controller/AuthController")(app);

app.listen(3000);
