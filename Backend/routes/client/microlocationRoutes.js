const express = require("express");
const {
  getMicroLocation,
  getMicrolocationByCity,
  getMicroBycityName,
} = require("../../controllers/client/microlocationController");
const router = express.Router();

router
  .get("/microlocations", getMicroLocation)
  .post("/microbycity", getMicrolocationByCity)
  .get("/micro-locations/:cityname", getMicroBycityName);

module.exports = router;
