const router = require("express").Router();

const authController = require("../../controllers/authController");
const categoryController = require("../../controllers/categoryController");

router.post(
  "/",
  authController.authorizeAPI(["admin"]),
  categoryController.addCategory
);

router.get(
  "/",
  authController.authorizeAPI(["admin", "blogger"]),
  categoryController.fetchCategories
);

router.get(
  "/all-categories",
  authController.authorizeAPI(["admin"]),
  categoryController.fetchAllCategories
);

router.get(
  "/:categoryId",
  authController.authorizeAPI(["admin"]),
 categoryController.updateCategory
);

router.delete(
  "/:categoryId",
  authController.authorizeAPI(["admin", "blogger"]),
  categoryController.removeCategory
);

module.exports = router;