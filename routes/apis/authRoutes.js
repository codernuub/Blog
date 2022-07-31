const router = require("express").Router();

const authController = require("../../controllers/authController");

router.post(
  "/login",
  authController.login,
  authController.createAuthenticationToken
);

module.exports = router;