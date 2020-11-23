const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://localhost:27017";
const MONGO_URL =
  "mongodb+srv://cisco:ah103111216@blog.tbhh5.mongodb.net/Blog?retryWrites=true&w=majority";
const connectDB = async () => {
  await mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("db connect");
};
module.exports = connectDB;
