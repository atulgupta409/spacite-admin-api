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
  popularWorkSpaceOrder,
  popularWorkSpaceOrderByDrag,
  getWorkSpacesbyCityId,
  getPopularWorkSpacesbyCity,
  deleteProjectImage
} = require("../../controllers/admin/coworkingSpaceController");
const router = express.Router();

router
  .get("/workSpaces", protect, getWorkSpaces)
  .get("/workspaces/search", searchWorkSpacesByName)
  .get("/workSpaces/:workSpaceId", getWorkSpacesById)
  .delete("/:projectId/images/:imageId",protect, deleteProjectImage)
  .get("/coworking/:microlocation", getWorkSpacesbyMicrolocation)
  .get(
    "/priority-workspace/:microlocation",

    getWorkSpacesbyMicrolocationWithPriority
  )
  .get(
    "/popular-workspace/:city",
    protect,

    getPopularWorkSpacesbyCity
  )
  .post("/workSpaces", postWorkSpaces)
  .put("/workSpaces/changeStatus/:workSpaceId", protect, changeWorkSpaceStatus)
  .put("/coworkingspaces/:id", protect, changeWorkSpaceOrder)
  .put("/update-priority", protect, changeWorkSpaceOrderbyDrag)
  .put("/popular-spaces/:id", protect, popularWorkSpaceOrder)
  .put("/update-popular", protect, popularWorkSpaceOrderByDrag)
  .put("/workSpaces/:workSpaceId", protect, editWorkSpaces)
  .get("/coworking-details/:cityId", protect, getWorkSpacesbyCityId)
  .delete("/delete/:workSpaceId", protect, deleteWorkSpaces);

module.exports = router;
