const express = require("express");
const { getSeo } = require("../../controllers/client/seoController");
const router = express.Router();

router.get("/seos-data", getSeo);

module.exports = router;
