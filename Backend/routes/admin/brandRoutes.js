const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getBrand,
  postBrand,
  addOrEditBrand,
  deleteBrand,
  getBrandById,
} = require("../../controllers/admin/brandController");
const router = express.Router();

router
  .get("/brands", protect, getBrand)
  .get("/brands/:brandId", protect, getBrandById)
  .post("/brands", protect, postBrand)
  .put("/brands/:brandId", protect, addOrEditBrand)
  .delete("/delete/:brandId", protect, deleteBrand);

module.exports = router;
