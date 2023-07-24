const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  sendUserEmail,
  forgotUserPassword,
  updateNewPassword,
} = require("../../controllers/admin/authController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/login").post(authUser);
router.route("/sendpasswordlink").post(sendUserEmail);
router.route("/forgot-password/:id/:token").get(forgotUserPassword);
router.route("/:id/:token").post(updateNewPassword);

module.exports = router;
