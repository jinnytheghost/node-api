const _ = require("lodash");
const Batch = require("../models/batch.model");
const mongoose = require("mongoose");
const axios = require("axios");

exports.batch_show_all = (req, res, next) => {
  Batch.find({})
    .sort({ creationTime: 'desc' })
    .exec()
    .then(batches => {
      res.status(200).json({
        message: "The list of all Batches received",
        data: batches
      });
    });
};

exports.batch_create_new = (req, res, next) => {
  // create new Batch according model 
  // using data from incoming request
  const batch = new Batch({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    registrationTime: req.body.registrationTime,
    emanationTime: req.body.emanationTime,
    supplier: req.body.supplier,
    stageId: req.body.stageId,
    userId: req.body.userId,
    isArchived: req.body.isArchived,
    weight: req.body.weight,
    notes: req.body.notes
  })
  batch.save()
  res.status(200).json({
    message: "New Batch created!",
    data: batch
  });

  // to save new Batch to the report`s Batches collection
  const rsServerURL = `${process.env.RS_SERVER_URL}/api/batches/createBatch`;
  batch.batchId = batch._id;
  axios.post(rsServerURL, batch)
    .then((response) => {
      console.log(response.status);
    })
    .catch((error) => {
      console.log(error);
    });
}

// UPDATE the existing Batch - archivate it
exports.batch_delete = (req, res, next) => {
  const batchId = req.params.batchId;
  Batch.updateOne(
    { _id: batchId },
    { $set: { isArchived: true } }
  )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Batch updated",
      });

      // send DELETE request to the RS server
      // to delete this particular batch from its DB 
      const rsServerURL = `${process.env.RS_SERVER_URL}/api/batches/${batchId}`;
      axios.delete(rsServerURL)
        .then(response => console.log("Batch was deleted from RS server successfully!"));
    })
    .catch(err => {
      console.log("this is the request body: ", req.body);
      console.log(err);
      res.status(403).json({
        error: err
      });
    });
};
