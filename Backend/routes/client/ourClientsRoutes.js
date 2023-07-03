const express = require("express");
const {
  getOurClients,
} = require("../../controllers/client/ourClientController");

const router = express.Router();

router.get("/myclient", getOurClients);

module.exports = router;
