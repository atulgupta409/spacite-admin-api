const express = require("express");
const {
  getWorkSpaces,
  getWorkSpacesById,
  searchWorkSpacesByName,
  getWorkSpacesbyCity,
  getWorkSpacesbyMicrolocation,
  getWorkSpacesbyMicrolocationId,
  getWorkSpacesbyCityId,
  getWorkSpacesbyBrand,
  getWorkSpacesbySlug,
} = require("../../controllers/client/workSpaceController");
const router = express.Router();

router
  .get("/workSpace", getWorkSpaces)
  .get("/workspaces/search", searchWorkSpacesByName)
  .get("/:workSpaceId", getWorkSpacesById)
  .get("/coworking/:city", getWorkSpacesbyCity)
  .get("/coworking-details-byid/:cityId", getWorkSpacesbyCityId)
  .get("/workSpace-details/:microlocation", getWorkSpacesbyMicrolocation)
  .get("/coworking-details/:microlocation", getWorkSpacesbyMicrolocationId)
  .get("/coworking-details-brand/:brand", getWorkSpacesbyBrand)
  .get("/coworking-details-slug/:slug", getWorkSpacesbySlug);

module.exports = router;
