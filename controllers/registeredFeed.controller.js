const _ = require("lodash");
const RegisteredFeed = require("../models/registeredFeed.model");
const mongoose = require("mongoose");
const axios = require("axios");

exports.registeredFeed_show_all_feeds = (req, res, next) => {
  RegisteredFeed.find({})
    .sort({ creationTime: 'desc' })
    .exec()
    .then(registeredFeed => {
      res.status(200).json({
        message: "The list of all feeds received",
        data: registeredFeed
      });
    });
};

exports.registeredFeed_create_new_feed = (req, res, next) => {
  // create new feed according model 
  // using data from incoming request
  const feed = new RegisteredFeed({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    supplier: req.body.supplier,
    weight: req.body.weight,
    deliveryTime: req.body.deliveryTime,
    code: req.body.code,
    creationTime: req.body.creationTime,
    isArchived: req.body.isArchived,
    notes: req.body.notes
  })
  feed.save()
  res.status(200).json({
    message: "New feed created!",
    data: feed
  });

  // to save new feed to the report`s registeredfeeds collection
  const rsServerURL = `${process.env.RS_SERVER_URL}/api/registeredFeed/createFeed`;
  feed.feedId = feed._id;
  axios.post(rsServerURL, feed)
    .then((response) => {
      console.log(response.status);
    })
    .catch((error) => {
      console.log(error);
    });
}

// UPDATE the existing registered feed - archivate it
exports.feed_delete = (req, res, next) => {
  const feedId = req.params.feedId;
  RegisteredFeed.updateOne(
    { _id: feedId },
    { $set: { isArchived: true } }
  )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Registered feed updated",
      });

      // send DELETE request to the RS server
      // to delete this particular feed from its DB 
      const rsServerURL = `${process.env.RS_SERVER_URL}/api/registeredFeed/${feedId}`;
      axios.delete(rsServerURL)
        .then(response => console.log("Feed was deleted from RS server successfully!"));
    })
    .catch(err => {
      console.log("this is the request body: ", req.body);
      console.log(err);
      res.status(403).json({
        error: err
      });
    });
};
