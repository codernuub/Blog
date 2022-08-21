const router = require("express").Router();

const authController = require("../../controllers/authController");
const blogController = require("../../controllers/blogController");

router.post(
  "/",
  authController.authorizeAPI(["admin", "blogger"]),
  blogController.createBlog
);

router.get(
  "/",
  authController.authorizeAPI(["admin", "blogger", "guest"]),
  blogController.fetchBlogs
);

router.get(
  "/:blogId",
  authController.authorizeAPI(["admin", "blogger"]),
  blogController.fetchBlog
);

router.patch(
  "/:blogId",
  authController.authorizeAPI(["admin", "blogger"]),
  blogController.updateBlog
);

router.delete(
  "/:blogId",
  authController.authorizeAPI(["admin", "blogger"]),
  blogController.deleteBlog
);

router.patch(
  "/:blogId/block",
  authController.authorizeAPI(["admin"]),
  blogController.blockBlog
);

module.exports = router;
