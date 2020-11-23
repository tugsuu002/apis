const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("check auth: ", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    console.log("authHeader:", authHeader);

    if (!authHeader) {
      res.status(401).send();
      return;
    }

    const token = authHeader.split(" ")[1];
    console.log("token:", token);

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    console.log("decoded:", decoded);

    req.userDate = decoded;
    next();
  } catch (error) {
    console.log("error:", error);
    return res.status(401).send();
  }
};
