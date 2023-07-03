const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getMicroLocation,
  postMicroLocation,
  deleteMicroLocation,
  getMicrolocationByCity,
  getMicroBycityName,
} = require("../../controllers/admin/microlocationController");
const router = express.Router();

router
  .get("/microlocations", protect, getMicroLocation)
  .post("/microbycity", protect, getMicrolocationByCity)
  .post("/microlocations", protect, postMicroLocation)
  .delete("/delete/:microlocationId", protect, deleteMicroLocation)
  .get("/micro-locations/:cityname", protect, getMicroBycityName);

module.exports = router;
