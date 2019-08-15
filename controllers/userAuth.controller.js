const _ = require("lodash");
const UserAuth = require("../models/userAuth.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// import the jsonWebToken package to use tokens
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const axios = require('axios');

// SIGNUP user with POST
exports.userAuth_signup = (req, res, next) => {
  // checkout if there such email already exists
  UserAuth.find({ email: req.body.email })
    .exec()
    .then(userAuth => {
      if (userAuth.length >= 1) {
        return res.status(409).json({
          message: "Such email already exists"
        });
      } else {
        // need to hash our passwords with bcrypt package
        // bcrypt.hash(req.body.password, 10, (err, hash) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(404).json({
              error: err
            });
          } else {
            // generate the random string
            const secretToken = randomstring.generate();
            // flag the account as inactive
            const active = false;

            const userAuth = new UserAuth({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              secretToken: secretToken,
              active: active,
              name: req.body.name
            });

            userAuth
              .save()
              .then(result => {
                // add userAuth.userId for userAuth object which will be sent to RS server
                // to make deletion flow working properly
                userAuth.userId = userAuth._id;
                // send a request to create the same user on RS
                const rsServerURL = `${process.env.RS_SERVER_URL}/api/userAuths/createUser`;

                axios.post(rsServerURL, userAuth)
                  .then(user => {
                    console.log('User was created on RS server: ', user);
                  })
                  .catch(err => console.log(err));


                console.log(result);
                // generate the token from the userAuth info
                const token = jwt.sign(
                  {
                    email: userAuth.email,
                    userId: userAuth._id
                  },
                  process.env.JWT_KEY,
                  {
                    expiresIn: "8760h"
                  }
                );

                // send an email
                let transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: `${process.env.GMAIL_USER}`,
                    pass: `${process.env.GMAILPW}`
                  },
                  tls: { rejectUnauthorized: false } // delete on production to prevent the MitM attacks
                });

                let mailOptions = {
                  from: `${process.env.GMAIL_USER}`,
                  // email for testing - should replace with actual user email
                  to: `${process.env.GMAIL_USER}`, // userAuth.email
                  subject: "CONFIRMATION EMAIL 1",
                  text: `This is a Test email using Node.js Please, copy this secret code and paste it to the verification input field on the web-site: ${secretToken}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Email sent: ", info.response);
                  }
                });

                const bearer = "Bearer " + token;
                res
                  .header("x-auth-token", token)
                  .header("authorization", bearer)
                  .header("access-control-expose-headers", "x-auth-token")
                  .send(
                    _.pick(userAuth, [
                      "_id",
                      "password",
                      "email",
                      "active",
                      "secretToken",
                      "name"
                    ])
                  );
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

// LOGIN user
exports.userAuth_login = (req, res, next) => {
  UserAuth.findOne({ email: req.body.email })
    .exec()
    .then(userAuth => {
      console.log("userAuth from db:", userAuth);
      if (userAuth.length < 1) {
        return res.status(403).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, userAuth.password, (err, result) => {
        if (err) {
          return res.status(403).json({
            message: "Auth failed - wrong credentials entered"
          });
        }
        //to check if the user is verified the email
        if (result) {
          if (userAuth.active === true) {
            const token = jwt.sign(
              {
                email: userAuth.email,
                userId: userAuth._id,
                isAdmin: userAuth.isAdmin,
                active: userAuth.active
              },
              process.env.JWT_KEY,
              {
                expiresIn: "8760h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token,
              isAdmin: userAuth.isAdmin,
              active: userAuth.active
            });
          } else {
            return res.status(401).json({
              message: "Please, wait for activation of your account! It may takes some time. Thank you for your patience!"
            })
          }
        } else {
          return res.status(403).json({
            message: "Auth failed - wrong credentials entered."
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(403).json({ // change to 401 Unauthorized
        error: err,
        message: "Auth failed - wrong credentials entered."
      });
    });
};

// usersAuth delete userAuth
exports.userAuth_delete = (req, res) => {
  UserAuth.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "UserAuth deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// userAuth details
exports.userAuth_details = function (req, res) {
  UserAuth.findById(req.params.userId, function (err, userAuth) {
    if (err) return next(err);
    console.log('db working properly...', userAuth)
    res.status(200).json({
      message: "user details",
      data: userAuth
    });
    // res.send(userAuth);
  });
};

// userAuth verify
exports.userAuth_verify = function (req, res) {
  // code to verify the user
  // compare the entered secretToken with the
  // generated and saved to DB secretToken

  UserAuth.findOne({ secretToken: req.body.secretToken }, (err, result) => {
    if (err) {
      throw err;
    } else if (result) {
      result.active = true;
      result
        .save()
        .then(result => {
          console.log("result saved to DATA-BASE: ", result);
          res.status(201).json({
            message: "Auth verification passed - user can be logged in"
          });
        })
        .catch(err => {
          console.log(err);
          res.status(401).json({
            message:
              "Auth verification failed - please, enter the correct secretToken."
          });
        });
    } else {
      res.status(401).json({
        message:
          "Auth verification failed - please, enter the correct secretToken."
      });
    }
  });
};
