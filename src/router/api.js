const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Signin = require("../models/signin");
const Posts = require("../models/post");
const checkAuth = require("../middleware/checkAuth");

// Handle incoming GET requests to
router.get("/", (req, res) => {
  res.send("hello cisoc api");
});
//pull post get post list========================>
router.get("/post", async (req, res) => {
  try {
    const getpost = await Posts.find();
    res.json(getpost);
  } catch (err) {
    res.json({ message: err });
  }
});
//new post add push ======================>
router.post("/post", checkAuth, (req, res) => {
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
router.get("/post/:postId", (req, res, next) => {
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
router.put("/post/:postId", async (req, res, next) => {
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
router.delete("/post/:postId", (req, res, next) => {
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

//signin api code ================================================>
//-----------signin get--------------------------->
router.get("/signin", async (req, res) => {
  try {
    const posts = await Signin.find();
    res.json(posts.filter((post) => post.email === req.user.email));
  } catch (err) {
    res.json({ message: err });
  }
  res.status(200).json({
    message: "handling GET requaests to /signins",
  });
});
//signin medeelel burtgeh---------------------------=>
router.post("/signin", (req, res, next) => {
  Signin.find({ email: req.body.email })
    .exec()
    .then((signin) => {
      if (signin.length > 1) {
        return res.status(401).json({
          message: "user failed",
        });
      } else {
        bcrypt.hash(req.body.password, 5, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const signin = new Signin({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash,
              phone: req.body.phone,
            });
            signin
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "user created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});
//--------------Get ------------------------>
router.get("/signin/:signinId", (req, res, next) => {
  Signin.findById({ _id: req.params.postId })
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
//end signin api code================================<

//Login code ======================>
router.post("/login", (req, res, next) => {
  Signin.find({ email: req.body.email })
    .exec()
    .then((signin) => {
      if (signin.length < 1) {
        return res.status(401).json({
          message: "user failed",
        });
      }
      bcrypt.compare(req.body.password, signin[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "pass taarsangui",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              name: signin[0].name,
              singinId: signin[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Amjiltain newterlee",
            token: token,
            name: signin[0].name,
            userId: signin[0]._id,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
//end login code ================<
module.exports = router;
