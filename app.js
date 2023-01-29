const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
//utility modules
const AppError = require("./utils/appError");
//controller modules
const authController = require("./controllers/authController");
const categoryController = require("./controllers/categoryController");
const blogController = require("./controllers/blogController");
const globalErrorHandler = require("./controllers/errorController");
//api routes
const authRoutes = require("./routes/apis/authRoutes");
const userRoutes = require("./routes/apis/userRoutes");
const categoryRoutes = require("./routes/apis/categoryRoutes");
const blogRoutes = require("./routes/apis/blogRoutes");

//parse body object
app.use(express.json());
//parse cookie
app.use(cookieParser());

//serve static files
app.use("/public", express.static("client"));
//config views
app.set("view engine", "ejs");

app.get("/", categoryController.fetchActiveCategories, (req, res) => {
  return res.render("pages/index", {
    categories: req.categories,
  });
});

app.get(
  "/dashboard",
  authController.authorizePage(["admin", "blogger"]),
  (req, res) => {
    return res.render("pages/dashboard", {
      user: req.user,
    });
  }
);

app.get("/dashboard/login", authController.checkAuth, (req, res) => {
  const file = path.resolve(path.join("client", "admin", "login.html"));
  return res.status(200).sendFile(file);
});

app.get(
  "/dashboard/profile",
  authController.authorizePage(["admin", "blogger"]),
  (req, res) => {
    return res.render("pages/profile", {
      user: req.user,
    });
  }
);

app.get(
  "/dashboard/blogs",
  authController.authorizePage(["admin", "blogger"]),
  (req, res) => {
    return res.render("pages/blogs", {
      user: req.user,
    });
  }
);

app.get(
  "/dashboard/blogs/create",
  authController.authorizePage(["admin", "blogger"]),
  (req, res) => {
    return res.render("pages/blogform", {
      user: req.user,
    });
  }
);

app.get(
  "/dashboard/categories",
  authController.authorizePage(["admin"]),
  (req, res) => {
    return res.render("pages/categories", {
      user: req.user,
    });
  }
);

app.get(
  "/dashboard/users",
  authController.authorizePage(["admin"]),
  (req, res) => {
    return res.render("pages/users", {
      user: req.user,
    });
  }
);

app.get(
  "/:title",
  categoryController.fetchActiveCategories,
  blogController.fetchActiveBlog,
  (req, res) => {
    return res.render("pages/blog", {
      categories: req.categories,
      blog: req.blog || {},
    });
  }
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/blogs", blogRoutes);

//Handle unhandled routes
app.all("*", (req, res, next) => {
  const message = `${req.originalUrl} not found`;
  return next(new AppError(message, 404));
});

//Handle errors occured in routes
app.use(globalErrorHandler);

module.exports = app;
