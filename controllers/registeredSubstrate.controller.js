const _ = require("lodash");
const RegisteredSubstrate = require("../models/registeredSubstrate.model");
const mongoose = require("mongoose");
const axios = require("axios");

exports.registeredSubstrate_show_all_substrates = (req, res, next) => {
  RegisteredSubstrate.find({})
    .sort({ creationTime: 'desc' })
    .exec()
    .then(registeredSubstrate => {
      res.status(200).json({
        message: "The list of all substrates that being made from existing feeds",
        data: registeredSubstrate
      });
    })
    .catch(err => {
      res.status(401).json({
        message: "Some error occured on the server.",
        error: err
      })
    });
};

exports.registeredSubstrate_create_new_substrate = (req, res, next) => {
  const substrate = new RegisteredSubstrate({
    name: req.body.name,
    batchName: req.body.batchName,
    ingredients: req.body.ingredients,
    moisture: req.body.moisture,
    weight: req.body.weight,
    deliveryTime: req.body.deliveryTime,
    creationTime: req.body.creationTime,
    isArchived: req.body.isArchived,
    notes: req.body.notes
  })
  substrate.save()
  res.status(200).json({
    message: "New substrate created!",
    data: substrate
  });

  // to save new substrate to the report`s registeredsubstrates collection
  const rsServerURL = `${process.env.RS_SERVER_URL}/api/registeredSubstrate/createSubstrate`;
  axios.post(rsServerURL, substrate)
    .then((response) => {
      console.log("new Substrate has been successfully pushed to RS server!");
    })
    .catch((error) => {
      console.log(error);
    });
}

// UPDATE the existing registered substrate with isArchived: true
exports.substrate_delete = (req, res, next) => {
  const substrateId = req.params.substrateId;

  RegisteredSubstrate.updateOne(
    { _id: substrateId },
    { $set: { isArchived: true } }
  )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Registered substrate archived",
      });

      // making DELETE request to the RS server
      // to delete from its DB this particular substrate as well
      const rsServerURL = `${process.env.RS_SERVER_URL}/api/registeredSubstrate/${substrateId}`;
      axios.delete(rsServerURL)
        .then(response => console.log("Substrate was deleted from RS server successfully!"));
    })
    .catch(err => {
      console.log("this is the request body: ", req.body);
      console.log(err);
      res.status(403).json({
        error: err
      });
    });
};
