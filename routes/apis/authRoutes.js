const router = require("express").Router();

const authController = require("../../controllers/authController");

router.post(
  "/login",
  authController.login,
  authController.createAuthenticationToken
);

router.patch(
  "/change-password",
  authController.authorizeAPI(["admin", "blogger"]),
  authController.changePassword
);

module.exports = router;
