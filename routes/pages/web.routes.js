const router = require("express").Router();

const pages = [
  { path: "/", file: "index" },
  { path: "/contact", file: "contact.ejs" },
  { path: "/copyrights-issue", file: "copyrights-issue.ejs" },
  { path: "/demo", file: "demo.ejs" },
  { path: "/demo-video", file: "demoVideoPlayer.ejs" },
  { path: "/principal", file: "principal.ejs" },
  { path: "/privacy-policy", file: "privacy-policy.ejs" },
  { path: "/school", file: "school.ejs" },
  { path: "/students", file: "students.ejs" },
  { path: "/terms-and-conditions", file: "terms-and-conditions.ejs" },
  { path: "/video-player", file: "video-player.ejs" },
];

pages.forEach((page) => {
  router.get(page.path, (req, res) => {
    const filePath = `pages/web/${page.file}`;
    res.render(filePath, { currentPath: req.path });
  });
});

module.exports = router;
