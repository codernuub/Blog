const CategoryModel = require("../models/Category.Model");
const BlogModel = require("../models/Blog.Model");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * @name fetchCategories
 * @description fetch categories for bloggers/readers
 */
exports.fetchCategories = catchAsync(async (req, res, next) => {
  const categories = await CategoryModel.find({ active: true })
    .select("title")
    .lean();

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
 * @description fetch categories for admin
 */
exports.fetchAllCategories = catchAsync(async (req, res, next) => {
  const categories = await CategoryModel.aggregate([
    {
      $lookup: {
        from: "blogs",
        localField: "_id",
        foreignField: "category",
        pipeline: [
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "blogs",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        blogs: { $size: "$blogs" },
        active: 1,
        createdAt: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res.status(200).json({
    status: "success",
    result: categories.length,
    data: {
      categories,
    },
  });
});

exports.fetchActiveCategories = catchAsync(async (req, res, next) => {
  const categories = await CategoryModel.aggregate([
    {
      $match: {
        active: true,
      },
    },
    {
      $lookup: {
        from: "blogs",
        let: {
          category: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$category", "$$category"] },
                  { $eq: ["$active", true] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "blogs",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        blogs: { $size: "$blogs" },
        active: 1,
        createdAt: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  req.categories = categories;
  return next();
});

/**
 * @name addCategory
 * @description add new category in database
 */
exports.addCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryModel.create({
    title: req.body.title,
    active: req.body.active,
    createdAt: Date.now(),
  });

  return res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

/**
 * @name updateCategory
 * @description update category
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  await CategoryModel.updateOne({ _id: req.params.categoryId }, req.body);

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

/**
 * @name deleteCategory
 * @description delete category
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

  const result = await CategoryModel.deleteOne({ _id: req.params.categoryId });

  if (!result.deletedCount) {
    return next(new AppError("Failed to delete category", 400));
  }

  return res.status(200).json({
    status: "success",
    data: {
      categoryId: req.params.categoryId,
    },
  });
});
