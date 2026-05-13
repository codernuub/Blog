const { getBlog } = require("../../services/blogCache.service");
const { getPublicCategories,getCategoryBySlug } = require("../../services/categoryCache.service");
const { getBlogs } = require("../../services/blogCache.service");

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

router.get("/blogs/:slug", async (req, res) => {
  const blog = await getBlog(req.params.slug);
  const categories = await getPublicCategories();

  return res.render("pages/web/blog", {
    blog,
    categories,
    currentPath: "/blogs",
  });
});

router.get("/blogs", async (req, res) => {
  try {
    const page = req.query.page || 1;

    // fetch blogs
    const data = await getBlogs({
      page,
      limit: 9,
    });

    return res.render("pages/web/blogs", {
      ...data,
      // seo
      pageTitle: "Latest Blogs",
      pageDescription:
        "Explore latest blogs, educational articles, technology insights and updates.",
      // headings
      heading: "Latest Blogs",
      subHeading:
        "Explore insightful blogs, educational articles, trending technologies and industry updates.",
      // error
      error: null,
      currentPath:"/blogs"
    });
  } catch (error) {
    console.log(error);
    return res.render("pages/web/blogs", {
      blogs: [],
      currentPage: 1,
      totalPages: 0,
      totalBlogs: 0,

      // seo
      pageTitle: "Blogs",

      pageDescription: "Explore latest blogs and articles.",

      // headings
      heading: "Blogs",

      subHeading: "Unable to fetch blogs right now.",

      // error
      error:
        "Something went wrong while fetching blogs. Please try again later.",
        
      currentPath:"/blogs"
    });
  }
});

router.get("/blogs/category/:category_slug", async (req, res) => {
  try {
    const page = req.query.page || 1;
    // category
    const category = await getCategoryBySlug(req.params.category_slug)
    // fetch blogs
    const data = await getBlogs({
      page,
      limit: 9,
      categoryId:category._id,
    });

    return res.render("pages/web/blogs", {
      ...data,

      // seo
      pageTitle: category ? `${category.title} Blogs` : "Blogs",

      pageDescription: category
        ? `Explore latest ${category.title} blogs and articles.`
        : "Explore latest blogs and articles.",

      // headings
      heading: category ? `${category.title} Blogs` : "Blogs",

      subHeading: category
        ? `Explore all blogs related to ${category.title}.`
        : "Explore latest blogs and articles.",

      // error
      error: null,
      currentPath:"/blogs"
    });
  } catch (error) {
    console.log(error);

    return res.render("pages/web/blogs", {
      blogs: [],
      currentPage: 1,
      totalPages: 0,
      totalBlogs: 0,

      // seo
      pageTitle: "Blogs",

      pageDescription: "Explore latest blogs and articles.",

      // headings
      heading: "Blogs",

      subHeading: "Unable to fetch category blogs right now.",

      // error
      error:
        "Something went wrong while fetching category blogs. Please try again later.",
        currentPath:"/blogs"
    });
  }
});

module.exports = router;
