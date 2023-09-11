const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getMicroLocation,
  postMicroLocation,
  deleteMicroLocation,
  getMicrolocationByCity,
  getMicroBycityName,
  addOrEditMicrolocation,
  getMicrolocationWithPriority,
  changeOrderMicrolocation,
  changeOrderMicrolocationbyDrag,
  getMicrolocationForWorkspace,
  getActiveMicrolocation
} = require("../../controllers/admin/microlocationController");
const router = express.Router();

router
  .get("/microlocations", protect, getMicroLocation)
  .get(
    "/priority/:cityId",
    protect,

    getMicrolocationWithPriority
  )
  .get(
    "/priority-location/:cityId",
    protect,

    getMicrolocationForWorkspace
  )
  .get(
    "/active-location",
   getActiveMicrolocation
  )
  .put("/priority-microlocation/:id", protect, changeOrderMicrolocation)
  .put(
    "/update-microlocation-priority",
    protect,
    changeOrderMicrolocationbyDrag
  )
  .post("/microbycity", protect, getMicrolocationByCity)
  .post("/microlocations", protect, postMicroLocation)
  .delete("/delete/:microlocationId", protect, deleteMicroLocation)
  .get("/micro-locations/:cityname", protect, getMicroBycityName)
  .put("/micro-by-id/:id", protect, addOrEditMicrolocation);

module.exports = router;
