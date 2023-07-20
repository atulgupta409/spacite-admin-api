const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getWorkSpaces,
  postWorkSpaces,
  editWorkSpaces,
  deleteWorkSpaces,
  getWorkSpacesById,
  searchWorkSpacesByName,
  changeWorkSpaceStatus,
  getWorkSpacesbyMicrolocation,
  changeWorkSpaceOrder,
  getWorkSpacesbyMicrolocationWithPriority,
  changeWorkSpaceOrderbyDrag,
} = require("../../controllers/admin/coworkingSpaceController");
const router = express.Router();

router
  .get("/workSpaces", protect, getWorkSpaces)
  .get("/workspaces/search", searchWorkSpacesByName)
  .get("/workSpaces/:workSpaceId", protect, getWorkSpacesById)
  .get("/coworking/:microlocation", protect, getWorkSpacesbyMicrolocation)
  .get(
    "/priority-workspace/:microlocation",
    protect,

    getWorkSpacesbyMicrolocationWithPriority
  )
  .post("/workSpaces", protect, postWorkSpaces)
  .put("/workSpaces/changeStatus/:workSpaceId", protect, changeWorkSpaceStatus)
  .put("/coworkingspaces/:id", protect, changeWorkSpaceOrder)
  .put("/update-priority", protect, changeWorkSpaceOrderbyDrag)
  .put("/workSpaces/:workSpaceId", protect, editWorkSpaces)
  .delete("/delete/:workSpaceId", protect, deleteWorkSpaces);

module.exports = router;
