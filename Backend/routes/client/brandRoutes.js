const express = require("express");

const { getBrand } = require("../../controllers/admin/brandController");
const router = express.Router();

router.get("/all-brands", getBrand);

module.exports = router;
