const connectDB = require("./src/config/connection");
const signinRoutes = require("./src/router/signin");
const postRoutes = require("./src/router/post");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

let port = process.env.PORT || 9001;

app.get("/", (req, res) => {
  res.send("hello cisoc api");
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
app.use((req, res, next) => {
  const error = new Error("Note found iim url alagdaa");
  error.status = 404;
  next(error);
});

module.exports = app;
