const express = require("express");
const {
  getMicroLocation,
  getMicrolocationByCity,
  getMicrolocationByCityName,
} = require("../controller/microlocationController");
const router = express.Router();

router
  .get("/microlocations", getMicroLocation)
  .post("/microbycity", getMicrolocationByCity)
  .get("/microlocations/:cityName", getMicrolocationByCityName);

module.exports = router;
