const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
//utility modules
const AppError = require("./utils/appError");
//controller modules
const authController = require("./controllers/authController");
const globalErrorHandler = require("./controllers/errorController");
//api routes
const authRoutes = require("./routes/apis/authRoutes");
const userRoutes = require("./routes/apis/userRoutes");
const categoryRoutes = require("./routes/apis/categoryRoutes");

//parse body object
app.use(express.json());
//parse cookie
app.use(cookieParser());

//serve static files
app.use("/public", express.static("client"));

app.get("/", (req, res) => {
  const file = path.resolve(path.join("client", "index.html"));
  return res.status(200).sendFile(file);
});

app.get("/dashboard", (req, res) => {
  const file = path.resolve(path.join("client", "admin", "dashboard.html"));
  return res.status(200).sendFile(file);
});

app.get("/dashboard/login", authController.checkAuth, (req, res) => {
  const file = path.resolve(path.join("client", "admin", "login.html"));
  return res.status(200).sendFile(file);
});

app.get("/dashboard/blogs", (req, res) => {
  const file = path.resolve(path.join("client", "admin", "blogs.html"));
  return res.status(200).sendFile(file);
});

app.get("/dashboard/categories", (req, res) => {
  const file = path.resolve(path.join("client", "admin", "categories.html"));
  return res.status(200).sendFile(file);
});

app.get("/dashboard/users", (req, res) => {
  const file = path.resolve(path.join("client", "admin", "users.html"));
  return res.status(200).sendFile(file);
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);

//Handle unhandled routes
app.all("*", (req, res, next) => {
  const message = `${req.originalUrl} not found`;
  return next(new AppError(message, 404));
});

//Handle errors occured in routes
app.use(globalErrorHandler);

module.exports = app;
