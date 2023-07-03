const express = require("express");
const {
  getOurClients,
} = require("../../controllers/client/ourClientController");
const router = express.Router();

router.get("/clientss", getOurClients);

module.exports = router;
