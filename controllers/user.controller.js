const User = require("../models/user.model");
const mongoose = require("mongoose");

// CREATE user with the create enpoint POST
exports.user_create = (req, res, next) => {
  let user = new User({
    _id: new mongoose.Types.ObjectId(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  });
  user
    .save()
    .then(result => {
      console.log(result);
    res.header(
      "Access-Control-Allow-Headers",
      "x-requested-with, x-requested-by"
    );

  res.status(201).json({
    message: "Handling POST request to users",
    createdUser: user
  });
      res.send(user);
    })
    .catch(err => console.log(err));
  res.header(
    "Access-Control-Allow-Headers",
    "x-requested-with, x-requested-by"
  );

  res.status(201).json({
    message: "Handling POST request to users",
    createdUser: user
  });
};

// GET ALL users
exports.user_details_all = function(req, res) {
  User.find({}, function(err, user) {
    res.send(user);
  });
};

// READ the data from the database using GET
// an existing user from the user id being sent in the request
exports.user_details = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return next(err);
    res.send(user);
    res.status(200).json({
      message: "user details",
      data: user
    });
  });
};

// UPDATE the existing user
exports.user_update = (req, res, next) => {
  const id = req.params.id;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  User.update(
    { _id: id },
    { $set: { firstname: firstname, lastname: lastname, email: email } }
  )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "User updated",
        request: {
          type: "GET",
          url: "http://localhost:3001/api/users/" + id
        }
      });
    })
    .catch(err => {
      console.log("this is the request body: ", req.body);
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//DELETE with DELETE method on Postman
exports.user_delete = (req, res, next) => {
  const id = req.params.id;
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "authentication successfull!!!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: "The user has been deleted successfully",
        userId: id
      });
    });
};
