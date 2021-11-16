const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fde3fc36052810",
    pass: "b85bd3acf3b30c",
  },
});

const handlebarsBoiler = {
  viewEngine: "handlebars",
  viewPath: path.resolve(),
  extName: ".html",
};

transport.use("compile", hbs(handlebarsBoiler));

module.exports = transport;
