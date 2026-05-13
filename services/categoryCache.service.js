const CategoryModel = require("../models/Category.Model");
const cache = require("../utils/memoryCache");

const CATEGORY_CACHE_KEYS = {
  PUBLIC: "categories_public",
  ADMIN: "categories_admin",
};

const CACHE_TTL = 1000 * 60 * 30; // 30 mins

/**
 * Public categories
 * Used in footer/navbar/ejs/public APIs
 */
exports.getPublicCategories = async () => {
  return cache.getOrSet(
    CATEGORY_CACHE_KEYS.PUBLIC,
    async () => {
      return await CategoryModel.find({ active: true })
        .select("title slug")
        .sort({ createdAt: -1 })
        .lean();
    },
    CACHE_TTL
  );
};

exports.getCategoryBySlug = async (slug) => {
  return cache.getOrSet(
    slug,
    async () => {
      return await CategoryModel.findOne({ slug, active: true }).lean();
    },
    CACHE_TTL
  );
};

/**
 * Admin categories
 */
exports.getAdminCategories = async () => {
  return cache.getOrSet(
    CATEGORY_CACHE_KEYS.ADMIN,
    async () => {
      return await CategoryModel.aggregate([
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
    },
    CACHE_TTL
  );
};

/**
 * Clear all category cache
 */
exports.clearCategoryCache = () => {
  cache.delete(CATEGORY_CACHE_KEYS.PUBLIC);
  cache.delete(CATEGORY_CACHE_KEYS.ADMIN);
};