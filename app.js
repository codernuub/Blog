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
const contactRoutes = require("./routes/apis/contact.routes");
//page routes
const adminRoutes = require("./routes/pages/admin.routes");
const webRoutes = require("./routes/pages/web.routes");
//parse body object
app.use(express.json());
//parse cookie
app.use(cookieParser());

//serve static files
app.use("/public", express.static("client"));
//config views
app.set("view engine", "ejs");

app.use("/", webRoutes);
app.use("/dashboard", adminRoutes);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/contacts", contactRoutes);

//Handle unhandled routes
app.all("*", (req, res, next) => {
  const message = `${req.originalUrl} not found`;
  return next(new AppError(message, 404));
});

//Handle errors occured in routes
app.use(globalErrorHandler);

module.exports = app;
