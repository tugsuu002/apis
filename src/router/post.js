const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Posts = require("../models/post");
const checkAuth = require("../middleware/checkAuth");

// Handle incoming GET requests to
//pull post get post list========================>
router.get("/", async (req, res) => {
  try {
    const getpost = await Posts.find();
    res.json(getpost);
  } catch (err) {
    res.json({ message: err });
  }
});
//new post add push ======================>
router.post("", checkAuth, (req, res) => {
  const posts = new Posts({
    _id: new mongoose.Types.ObjectId(),
    PostDate: req.body.PostDate,
    title: req.body.title,
    post: req.body.post,
    userId: req.body.userId,
    userName: req.body.userName,
  });
  posts
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "post upload",
        createdPosts: posts,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// edit post=================================>
router.get("/:postId", (req, res, next) => {
  Posts.findById({ _id: req.params.postId })
    .exec()
    .then((doc) => {
      console.log("from database", doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
//post update database==========================>
router.put("/:postId", async (req, res, next) => {
  try {
    const id = req.params.postId;
    const updates = req.body;
    // const options = { new: true };
    result = await Posts.findByIdAndUpdate(id, updates);
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});
//post delete ===============================>
router.delete("/:postId", (req, res, next) => {
  Posts.remove({ _id: req.params.postId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "post DELETE",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
module.exports = router;
