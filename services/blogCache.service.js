const BlogModel = require('../models/Blog.Model');

exports.getBlog = async (slug) => {
  const blog = await BlogModel.findOne({ slug })
    .populate("author", "name")
    .populate("category", "title");
  return blog;
};

exports.getBlogs = async ({
  page = 1,
  limit = 9,
  categoryId = null,
}) => {
  const currentPage = Number(page) || 1;

  const skip = (currentPage - 1) * limit;

  // filters
  const filter = {
    active: true,
    block: false,
  };

  // category filter
  if (categoryId) {
    filter.category = categoryId;
  }

  // total blogs
  const totalBlogs = await BlogModel.countDocuments(filter);

  // total pages
  const totalPages = Math.ceil(totalBlogs / limit);

  // blogs
  const blogs = await BlogModel.find(filter)
    .populate("author", "name")
    .populate("category", "title")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    blogs,
    currentPage,
    totalPages,
    totalBlogs,
  };
};