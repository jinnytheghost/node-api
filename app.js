// this is TEST comment
const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const axios = require("axios");
const jwt = require("jsonwebtoken");

// Imports routes for the users
const usersRouter = require("./routes/user");
const userAuthRoutes = require("./routes/userAuth");
const registeredFeedRoute = require("./routes/registeredFeedRoute");
const registeredSubstrateRoute = require("./routes/registeredSubstrateRoute");
const batchRoute = require("./routes/batchRoute");
const stagesRoute = require("./routes/stagesRoute");
const carryUnitsRoute = require("./routes/carryUnitsRoute");
const cors = require("cors");
// run our app with express framework
const app = express();

// use .env variables
const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// setting the port to use with node.js
app.listen(process.env.PORT || 3001, () => {
  console.log("Server is up and running on port number " + process.env.PORT || 3001);
  console.log("Used NODE_ENV: " + process.env.NODE_ENV);
  console.log("RS_SERVER_URL:  " + process.env.RS_SERVER_URL);
});

// Set up mongoose connection
const mongoose = require("mongoose");
// let dev_db_url = "mongodb://olexii1:olexii1@ds219983.mlab.com:19983/users";
// const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(
  // `mongodb://olysenko:oganyan1501@clusterreactusersapi-shard-00-00-havry.mongodb.net:27017,clusterreactusersapi-shard-00-01-havry.mongodb.net:27017,clusterreactusersapi-shard-00-02-havry.mongodb.net:27017/test?ssl=true&replicaSet=ClusterReactUsersAPI-shard-0&authSource=admin&retryWrites=true`,
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// user createIndex deprecated issue
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

app.use(cors());

// connect body-parser to parse the incoming request bodies in a middleware;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// defaults
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// create JWT token
const token = jwt.sign(
  {
    serverId: process.env.SERVER_ID
  },
  process.env.JWT_KEY,
  {
    expiresIn: "8760h"
  }
);

// add token to all axios requests headers
axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// using our routes
app.use("/api/users", usersRouter);
app.use("/api/userAuths", userAuthRoutes);
app.use("/api/registeredFeed", registeredFeedRoute);
app.use("/api/registeredSubstrate", registeredSubstrateRoute);
app.use("/api/batches", batchRoute);
app.use("/api/stages", stagesRoute);
app.use("/api/carryUnits", carryUnitsRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
