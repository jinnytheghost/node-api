const _ = require("lodash");
const CarryUnits = require("../models/carryUnit.model");
const mongoose = require("mongoose");
const axios = require("axios");

exports.cu_show_all = (req, res, next) => {
  CarryUnits.find({})
    .sort({ creationTime: 'desc' })
    .populate("typeId")
    .exec()
    .then(carryUnits => {
      res.status(200).json({
        message: "The list of all Carry Units on the farm received",
        data: carryUnits
      });
    });
};

exports.cu_create_new = async (req, res, next) => {
  const createCarryUnitPromise = new Promise((resolve) => {

    const carryUnit = new CarryUnits({
      _id: new mongoose.Types.ObjectId(),
      typeId: req.body.typeId,
      externalCarryUnitId: req.body.externalCarryUnitId,
      carryUnitId: req.body.carryUnitId,
      isArchived: req.body.isArchived,
      creationTime: req.body.creationTime
    })
    carryUnit.save()

    // get the _id of the carryUnit and populate it
    const carryUnitId = carryUnit._id;
    CarryUnits.findOne({ _id: carryUnitId })
      .populate('typeId')
      .exec((err, currentCarryUnit) => {
        if (err) console.log(err);
        console.log("current CarryUnit: ", currentCarryUnit);
        res.status(200).json({
          message: "New Carry Unit created on RDS server successfully!",
          data: carryUnit
        });
      })
    resolve(carryUnit)
  });

  const updatedCarryUnit = createCarryUnitPromise.then((carryUnit) => {
    // to save new carryUnit to the report`s carryunits collection
    const rsServerURL = `${process.env.RS_SERVER_URL}/api/carryUnits/createCarryUnit`;
    carryUnit.carryUnitId = carryUnit._id;
    console.log('CARRY UNIT: ', carryUnit);
    axios.post(rsServerURL, carryUnit)
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
exports.cu_delete = (req, res, next) => {
  const carryUnitId = req.params.carryUnitId;
  CarryUnits.updateOne(
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
      const rsServerURL = `${process.env.RS_SERVER_URL}/api/carryUnits/${carryUnitId}`;
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
exports.cu_details = (req, res, next) => {
  const carryUnitId = req.params.carryUnitId;
  CarryUnits.findOne({ _id: carryUnitId })
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
