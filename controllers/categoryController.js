const CategoryModel = require("../models/Category.Model");
const BlogModel = require("../models/Blog.Model");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const {
  getPublicCategories,
  getAdminCategories,
  clearCategoryCache,
} = require("../services/categoryCache.service");
const { createSlug } = require("../utils/text");

/**
 * @name fetchCategories
 * @description public categories
 */
exports.fetchCategories = catchAsync(async (req, res, next) => {
  const categories = await getPublicCategories();

  return res.status(200).json({
    status: "success",
    result: categories.length,
    data: {
      categories,
    },
  });
});

/**
 * @name fetchAllCategories
 * @description admin categories
 */
exports.fetchAllCategories = catchAsync(async (req, res, next) => {
  const categories = await getAdminCategories();

  return res.status(200).json({
    status: "success",
    result: categories.length,
    data: {
      categories,
    },
  });
});

exports.fetchActiveCategories = catchAsync(async (req, res, next) => {
  const categories = await getPublicCategories();

  req.categories = categories;
  return next();
});

/**
 * @name addCategory
 */
exports.addCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryModel.create({
    title: req.body.title,
    slug: createSlug(req.body.title),
    active: req.body.active,
    createdAt: Date.now(),
  });

  // clear cache
  clearCategoryCache();

  return res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

/**
 * @name updateCategory
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  if(req.body.title) {
    req.body.slug = createSlug(req.body.title);
  }
  await CategoryModel.updateOne(
    { _id: req.params.categoryId },
    req.body
  );

  // clear cache
  clearCategoryCache();

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

/**
 * @name deleteCategory
 */
exports.removeCategory = catchAsync(async (req, res, next) => {
  const blogsCount = await BlogModel.countDocuments({
    categoryId: req.params.categoryId,
  });

  if (blogsCount)
    return next(
      new AppError(
        `Cannot delete category, ${blogsCount} blogs already created with this category!`,
        400
      )
    );

  const result = await CategoryModel.deleteOne({
    _id: req.params.categoryId,
  });

  if (!result.deletedCount) {
    return next(new AppError("Failed to delete category", 400));
  }

  // clear cache
  clearCategoryCache();

  return res.status(200).json({
    status: "success",
    data: {
      categoryId: req.params.categoryId,
    },
  });
});