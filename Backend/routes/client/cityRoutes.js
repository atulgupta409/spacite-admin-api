const express = require("express");
const { getCity, getCityByState } = require("../controller/cityController");
const router = express.Router();

router.get("/cities", getCity).post("/citybystate", getCityByState);

module.exports = router;
