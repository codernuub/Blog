const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.get("/dashboard/blogs", (req, res) => {
  const file = path.resolve(path.join("client", "admin", "blogs.html"));
  return res.status(200).sendFile(file);
});

app.listen(3000, () => console.log(`UP AND RUNNING ON PORT ${PORT}`));
