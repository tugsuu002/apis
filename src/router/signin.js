const Signin = require("../models/signin");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", async (req, res) => {
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
router.post("/", (req, res, next) => {
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
//login pass shalgah token ugun ----------------------------->
router.get("/login", async (req, res) => {
  try {
    const getlogin = await Signin.find();
    res.json(getlogin);
  } catch (err) {
    res.json({ message: err });
  }
});
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

router.get("/:signinId", (req, res, next) => {
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

router.patch("/:signinId", (req, res, next) => {
  res.status(200).json({
    message: "update signins!",
  });
});

router.delete("/:signinId", (req, res, next) => {
  Signin.remove({ _id: req.params.signinId })
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
  res.status(200).json({
    message: "Deleted signins!",
  });
});

module.exports = router;
