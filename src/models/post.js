const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  PostDate: { type: Date, required: true },
  title: { type: String, required: true },
  post: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
});
module.exports = mongoose.model("Posts", postsSchema);
