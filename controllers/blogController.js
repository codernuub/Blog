const BlogModel = require("../models/Blog.Model");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/APIFeatures");

exports.createBlog = catchAsync(async (req, res, next) => {
  if (req.body.active && !req.body.content) {
    return next(new AppError("Cannot publish blog without main content!", 400));
  }

  const blog = await BlogModel.create({
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

exports.updateBlog = catchAsync(async (req, res, next) => {
  //remove restricted fields
  ["block"].forEach((field) => {
    if (req.body[field]) delete req.body[field];
  });

  if (req.body.title) {
    req.body["slug"] = req.body.title.replace(/["&/"]/g, "");
  }

  await BlogModel.updateOne(
    { _id: req.params.blogId, author: req.user.userId },
    req.body
  );

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