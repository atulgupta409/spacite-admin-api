const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getOurClients,
  postOurClients,
  deleteClient,
} = require("../../controllers/admin/ourClientsController");
const router = express.Router();

router
  .get("/clients", getOurClients)
  .post("/client", postOurClients)
  .delete("/delete/:id", deleteClient);

module.exports = router;
