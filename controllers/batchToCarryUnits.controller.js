const _ = require("lodash");
const BatchToCarryUnit = require("../models/batchToCarryUnit.model");
const mongoose = require("mongoose");
const axios = require("axios");

exports.batchToCarryUnits_show_all = (req, res, next) => {
  BatchToCarryUnit.find({})
    .sort({ creationTime: 'desc' })
    .populate('batchId')
    .populate('carryUnitId')
    .exec()
    .then(batchesToCarryUnits => {
      res.status(200).json({
        message: "The list of all Batches received",
        data: batchesToCarryUnits
      });
    });
};

exports.batchToCarryUnits_create_new = (req, res, next) => {
  // create new BatchToCarryUnit according model 
  // using data from incoming request
  const batchToCarryUnit = new BatchToCarryUnit({
    _id: new mongoose.Types.ObjectId(),
    batchId: req.body.batchId,
    carryUnitId: req.body.carryUnitId,
  })
  batchToCarryUnit.save()
  res.status(200).json({
    message: "New BatchToCarryUnit created!",
    data: batchToCarryUnit
  });

  // to save new BatchToCarryUnit to the report`s Batches collection
  const rsServerURL = `${process.env.RS_SERVER_URL}/api/batches/createBatchToCarryUnit`;
  batchToCarryUnit.batchToCarryUnitId = batchToCarryUnit._id;
  axios.post(rsServerURL, batchToCarryUnit)
    .then((response) => {
      console.log(response.status);
    })
    .catch((error) => {
      console.log(error);
    });
}

// UPDATE the existing BatchToCarryUnit - archivate it
exports.batchToCarryUnits_delete = (req, res, next) => {
  const batchToCarryUnitId = req.params.batchToCarryUnitId;
  BatchToCarryUnit.updateOne(
    { _id: batchToCarryUnitId },
    { $set: { isArchived: true } }
  )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "BatchToCarryUnit updated",
      });

      // send DELETE request to the RS server
      // to delete this particular batchToCarryUnit from its DB 
      const rsServerURL = `${process.env.RS_SERVER_URL}/api/batches/${batchToCarryUnitId}`;
      axios.delete(rsServerURL)
        .then(response => console.log("BatchToCarryUnit was deleted from RS server successfully!"));
    })
    .catch(err => {
      console.log("this is the request body: ", req.body);
      console.log(err);
      res.status(403).json({
        error: err
      });
    });
};
