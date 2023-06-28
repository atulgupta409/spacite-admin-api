const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getState,
  postState,
  addOrEditState,
  deleteState,
  getStateByCountry,
} = require("../../controllers/admin/stateController");
const router = express.Router();

router
  .get("/states", protect, getState)
  .post("/statesbycountry", protect, getStateByCountry)
  .post("/states", protect, postState)
  .put("/states/:stateId", protect, addOrEditState)
  .delete("/delete/:stateId", protect, deleteState);

module.exports = router;
