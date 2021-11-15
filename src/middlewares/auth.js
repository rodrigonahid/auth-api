const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  }

  const parts = authHeader.split(" ");
  console.log(parts);
  if (!parts.length == 2) {
    return res.status(401).send({ error: "Token Error" });
  }
  const [scheme, token] = parts;
  if (!scheme.includes("Bearer")) {
    return res.status(401).send({ error: "Token Malformatted" });
  }
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token Invalid" });

    req.userId = decoded.id;
    return next();
  });
};
