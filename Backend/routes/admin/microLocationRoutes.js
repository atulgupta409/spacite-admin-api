const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getMicroLocation,
  postMicroLocation,
  deleteMicroLocation,
  getMicrolocationByCity,
  getMicroBycityName,
  addOrEditMicrolocation,
} = require("../../controllers/admin/microlocationController");
const router = express.Router();

router
  .get("/microlocations", protect, getMicroLocation)
  .post("/microbycity", protect, getMicrolocationByCity)
  .post("/microlocations", protect, postMicroLocation)
  .delete("/delete/:microlocationId", protect, deleteMicroLocation)
  .get("/micro-locations/:cityname", protect, getMicroBycityName)
  .put("/micro-by-id/:id", protect, addOrEditMicrolocation);

module.exports = router;
