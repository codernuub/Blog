const router = require("express").Router();
const path = require("path");
const authController = require("../../controllers/authController");

router.get(
  "/",
  authController.authorizePage(["admin", "blogger"]),
  (req, res) => {
    return res.render("pages/admin/dashboard", {
      user: req.user,
    });
  },
);

router.get("/login", authController.checkAuth, (req, res) => {
  const file = path.resolve(path.join("client", "admin", "login.html"));
  return res.status(200).sendFile(file);
});

router.get(
  "/profile",
  authController.authorizePage(["admin", "blogger"]),
  (req, res) => {
    return res.render("pages/admin/profile", {
      user: req.user,
    });
  },
);

router.get(
  "/blogs",
  authController.authorizePage(["admin", "blogger"]),
  (req, res) => {
    return res.render("pages/admin/blogs", {
      user: req.user,
    });
  },
);

router.get(
  "/blogs/create",
  authController.authorizePage(["admin", "blogger"]),
  (req, res) => {
    return res.render("pages/admin/blogform", {
      user: req.user,
    });
  },
);

router.get(
  "/categories",
  authController.authorizePage(["admin"]),
  (req, res) => {
    return res.render("pages/admin/categories", {
      user: req.user,
    });
  },
);

router.get("/users", authController.authorizePage(["admin"]), (req, res) => {
  return res.render("pages/admin/users", {
    user: req.user,
  });
});

module.exports = router;