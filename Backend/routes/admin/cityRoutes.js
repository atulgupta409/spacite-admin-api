const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getCity,
  postCity,
  deleteCity,
  getCityByState,
  addOrEditCity,
  getActiveCity
} = require("../../controllers/admin/manageCity");
const router = express.Router();

router
  .get("/cities", protect, getCity)
  .get("/active-cities", getActiveCity)
  .post("/cities", protect, postCity)
  .delete("/delete/:cityId", protect, deleteCity)
  .post("/citybystate", protect, getCityByState)
  .put("/city-by-id/:id", protect, addOrEditCity);

module.exports = router;
