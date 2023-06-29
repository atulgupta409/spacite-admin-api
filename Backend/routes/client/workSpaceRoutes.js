const express = require("express");
const {
  getWorkSpaces,
  getWorkSpacesById,
  searchWorkSpacesByName,
  getWorkSpacesbyCity,
  getWorkSpacesbyMicrolocation,
} = require("../../controllers/client/workSpaceController");
const router = express.Router();

router
  .get("/", getWorkSpaces)
  .get("/workspaces/search", searchWorkSpacesByName)
  .get("/:workSpaceId", getWorkSpacesById)
  .get("/coworking/:city", getWorkSpacesbyCity)
  .get("/coworking-details/:microlocation", getWorkSpacesbyMicrolocation);

module.exports = router;
