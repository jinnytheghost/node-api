const _ = require("lodash");
const Stages = require("../models/stages.model");
const mongoose = require("mongoose");
const axios = require("axios");

exports.stages_show_all = (req, res, next) => {
  Stages.find({})
    .exec()
    .then(stages => {
      res.status(200).json({
        message: "The list of all stages received",
        data: stages
      });
    });
};

exports.stages_create_new = (req, res, next) => {
  // create new Stage according model 
  // using data from incoming request
  const stage = new Stages({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    creationTime: req.body.creationTime,
  })
  stage.save()
  res.status(200).json({
    message: "New Stage created on RDS server!",
    data: stage
  });

  // to save new stage to the report`s Stages collection
  const rsServerURL = `${process.env.RS_SERVER_URL}/api/stages/createStage`;
  stage.stageId = stage._id;
  axios.post(rsServerURL, stage)
    .then((response) => {
      console.log(response.status);
    })
    .catch((error) => {
      console.log(error);
    });
}

// UPDATE the existing Stage - archivate it
exports.stages_delete = (req, res, next) => {
  const stageId = req.params.stageId;
  Stages.updateOne(
    { _id: stageId },
    { $set: { isArchived: true } }
  )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Stage updated",
      });

      // send DELETE request to the RS server
      // to delete this particular Stage from its DB 
      const rsServerURL = `${process.env.RS_SERVER_URL}/api/stages/${stageId}`;
      axios.delete(rsServerURL)
        .then(response => console.log("Stage was deleted from RS server successfully!"));
    })
    .catch(err => {
      console.log("this is the request body: ", req.body);
      console.log(err);
      res.status(403).json({
        error: err
      });
    });
};
