const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getAmenities,
  postAmenities,
  deleteAmenities,
} = require("../../controllers/admin/amenitiesController");
const router = express.Router();

router
  .get("/amenities", protect, getAmenities)
  .post("/amenities", protect, postAmenities)
  .delete("/delete/:amenityId", protect, deleteAmenities);

module.exports = router;
