const _ = require("lodash");
const CarryUnitTypes = require("../models/carryUnitType.model");
const mongoose = require("mongoose");
const axios = require("axios");

exports.cut_show_all = (req, res, next) => {
  CarryUnitTypes.find({})
    .sort({ creationTime: 'desc' })
    .exec()
    .then(carryUnits => {
      res.status(200).json({
        message: "The list of all Carry Units received",
        data: carryUnits
      });
    });
};

exports.cut_create_new = async (req, res, next) => {
  const createCarryUnitPromise = new Promise((resolve) => {

    const carryUnitType = new CarryUnitTypes({
      _id: new mongoose.Types.ObjectId(),
      type: req.body.type,
      height: req.body.height,
      width: req.body.width,
      length: req.body.length,
      weight: req.body.weight,
      registrationTime: req.body.registrationTime,
      creationTime: req.body.creationTime
    })
    carryUnitType.save()
    res.status(200).json({
      message: "New Carry Unit created!",
      data: carryUnitType
    });
    resolve(carryUnitType)
  });

  const updatedCarryUnit = createCarryUnitPromise.then((carryUnitType) => {
    // to save new carryUnit to the report`s carryunits collection
    const rsServerURL = `${process.env.RS_SERVER_URL}/api/carryUnits/types/createCarryUnit`;
    carryUnitType.carryUnitId = carryUnitType._id;
    console.log('CARRY UNIT: ', carryUnitType);
    axios.post(rsServerURL, carryUnitType)
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error);
      });
  })
    .catch((err) => {
      console.log(err)
    })
}

// UPDATE the existing registered Carry Unit - archivate it
exports.cut_delete = (req, res, next) => {
  const carryUnitId = req.params.carryUnitId;
  CarryUnitTypes.updateOne(
    { _id: carryUnitId },
    { $set: { isArchived: true } }
  )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Registered Carry Unit updated",
      });

      // send DELETE request to the RS server
      // to delete this particular Carry Unit from its DB 
      const rsServerURL = `${process.env.RS_SERVER_URL}/api/carryUnits/types/${carryUnitId}`;
      axios.delete(rsServerURL)
        .then(response => console.log("Carry Unit was deleted from RS server successfully!"));
    })
    .catch(err => {
      console.log("this is the request body: ", req.body);
      console.log(err);
      res.status(403).json({
        error: err
      });
    });
};

// UPDATE the existing registered Carry Unit - archivate it
exports.cut_details = (req, res, next) => {
  const carryUnitId = req.params.carryUnitId;
  CarryUnitTypes.findOne({ _id: carryUnitId })
    .exec()
    .then(carryUnit => {
      console.log('CARRY UNIT: ', carryUnit);
      res.status(200).json({
        message: "Details of particular Carry Unit received!",
        data: carryUnit
      });
    })
    .catch(err => {
      console.log("Request BODY: ", req.body);
      console.log(err);
      res.status(403).json({
        error: err
      });
    });
};
