const connectDB = require("./src/config/connection");
const signinRoutes = require("./src/router/signin");
const postRoutes = require("./src/router/post");
const apiRoutes = require("./src/router/api");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

let port = process.env.PORT || 9000;
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
app.get("/", (req, res) => {
  res.send("hello wellcom");
});
//localhost 9000 port deer =================================>
app.listen(port, () => {
  console.log(`Example app is listening on port http://localhost:${port}`);
});
//monogo db cloud connect ======================================>
connectDB();

//========Routes=====================>
app.use("/signin", signinRoutes);
app.use("/post", postRoutes);
app.use("/api", apiRoutes);
app.use((req, res, next) => {
  const error = new Error("Note found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
