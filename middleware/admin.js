const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden

  // checkout if the user is Admin
  // take token - decode it and then get the property isAdmin from it
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token);
  req.userData = decoded;
  console.log("decoded userAuth form admin.js: ", req.userData);
  if (!req.userData.isAdmin) return res.status(403).send("Access denied.");

  next();
};

