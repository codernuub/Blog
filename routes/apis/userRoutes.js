const router = require("express").Router();

const authController = require("../../controllers/authController");
const userController = require("../../controllers/userController");

router.post(
  "/",
  authController.authorizeAPI(["admin"]),
  userController.addUser
);

router.get(
  "/",
  authController.authorizeAPI(["admin"]),
  userController.fetchUsers
);

router.post(
  "/add-admin",
  authController.authorizeAPI(["admin"]),
  userController.addAdmin
);

router.get(
  "/:userId",
  authController.authorizeAPI(["admin", "blogger"]),
  userController.fetchUser
);

router.patch(
  "/:userId",
  authController.authorizeAPI(["admin", "blogger"]),
  userController.updateUser
);

router.delete(
  "/:userId",
  authController.authorizeAPI(["admin"]),
  userController.removeUser
);

module.exports = router;
