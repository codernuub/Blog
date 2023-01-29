const BlogModel = require("../models/Blog.Model");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/APIFeatures");

exports.createBlog = catchAsync(async (req, res, next) => {
  if (req.body.active && !req.body.content) {
    return next(new AppError("Cannot publish blog without main content!", 400));
  }

  const blog = await BlogModel.create({
    thumbnail: req.body.thumbnail,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    category: req.body.category,
    author: req.user.userId,
    active: req.body.active,
    createdAt: Date.now(),
  });

  return res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.fetchBlogs = catchAsync(async (req, res, next) => {
  //fetch only active blogs for guest user
  if (!req.user) {
    req.query["active"] = true;
    req.query["block"] = false;
  }
  //fetch only blogger blogs
  if (req?.user?.role === "blogger") {
    req.query["author"] = req.user.userId;
  }

  const features = new APIFeatures(BlogModel.find({}), req.query)
    .filter()
    .paginate()
    .sort()
    .limitFields(["-__v"])
    .populatePath([
      { path: "category", select: "title" },
      { path: "author", select: "name" },
    ]);

  const blogs = await features.query.lean();
  return res.status(200).json({
    status: "success",
    result: blogs.length,
    data: {
      blogs,
    },
  });
});

/**
 * @name fetchBlog
 * @description fetch blog details with blog Id and accessiible only for admin and blogger
 */
exports.fetchBlog = catchAsync(async (req, res, next) => {
  const query = {
    _id: req.params.blogId,
  };
  if (req.user.role === "blogger") {
    query.author = req.user.userId;
  }
  const blog = await BlogModel.findOne(query).lean();

  if (!blog) return next(new AppError("Blog not found!"));

  return res.status(200).json({
    status: "success",
    data: {
      blog: blog,
    },
  });
});

/**
 * @name fetchActiveBlog
 */
exports.fetchActiveBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogModel.findOne({
    slug: req.params.title,
    active: true,
    block: false,
  })
    .populate([
      {
        path: "author",
        select: "name profile",
      },
      { path: "category", select: "title" },
    ])
    .lean();

  req.blog = blog;

  return next();
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  //remove restricted fields
  ["block"].forEach((field) => {
    if (req.body[field]) delete req.body[field];
  });

  if (req.body.title) {
    req.body["slug"] = req.body.title.replace(/["&/"]/g, "");
  }

  await BlogModel.updateOne({ _id: req.params.blogId }, req.body);

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.blockBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogModel.findOne({ _id: req.params.blogId });

  if (!blog) return next(new AppError("Blog not found!", 404));

  blog.block = !blog.block;
  await blog.save();

  return res.status(200).json({
    status: "success",
    data: {
      block: blog.block,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogModel.deleteOne({
    _id: req.params.blogId,
    author: req.user.userId,
  });

  if (!blog.deletedCount)
    return next(new AppError("Failed to delete blog!", 404));

  return res.status(200).json({
    status: "success",
    data: null,
  });
});
