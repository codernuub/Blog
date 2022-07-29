const UserModel = require("../models/User.Model");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * @name addUser
 */
exports.addUser = catchAsync(async (req, res, next) => {
  const user = await UserModel.create({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    createdAt: Date.now(),
  });

  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/**
 * @name addAdmin
 * @description add admin in database
 */
exports.addAdmin = catchAsync(async (req, res, next) => {
  const user = await UserModel.create({
    name: req.body.name,
    role: "admin",
    username: req.body.username,
    password: req.body.password,
    createdAt: Date.now(),
  });

  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/**
 * @name fetchUsers
 * @description fetch list of registered users
 */
exports.fetchUsers = catchAsync(async (req, res, next) => {
  const users = await UserModel.aggregate([
    {
      $lookup: {
        from: "blogs",
        localField: "_id",
        foreignField: "author",
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
        name: 1,
        username: 1,
        role: 1,
        blogs: { $size: "$blogs" },
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
    result: users.length,
    data: {
      users,
    },
  });
});

/**
 * @name fetchUser
 * @description fetch user detail
 */
exports.fetchUser = catchAsync(async (req, res, next) => {
  const user = await UserModel.findOne({ _id: req.params.userId })
    .select("profile name username role createdAt")
    .lean();

  if (!user) return next(new AppError("User not found!", 400));

  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/**
 * @name updateUser
 * @description update name of customer
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  //prevent restricted data manipulation
  if (req.user.role !== "admin") {
    req.params.userId = req.user.userId;
    //remove restricted fields
    ["role", "active", "createdAt"].forEach((field) => {
      if (req.body[field]) delete req.body[field];
    });
  }

  await UserModel.updateOne({ _id: req.params.userId }, req.body);

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

/**
 * @name uploadProfile;
 * @description upload profile
 */
exports.uploadProfile = catchAsync(async (req, res, next) => {
  const user = await UserModel.findOne({ _id: req.user.userId });
  if (!user) return next(new AppError("User not found!", 400));

  if (!req.body.filesInfo.length)
    return next(new AppError("Please upload profile image!", 400));
  //update new file
  user["image"] = req.body.filesInfo[0].fileurl;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    status: "success",
    data: {
      image: user.image,
    },
  });
});

/**
 * @name removeUser
 * @description remove user from database
 */
exports.removeUser = catchAsync(async (req, res, user) => {
  const user = await UserModel.deleteOne({ _id: req.params.userId });

  //disable all blogs of user
  if (user.deletedCount) {
    await BlogModel.updateMany(
      { author: req.params.userId },
      { active: false }
    );
  }

  return res.status(200).json({
    status: "success",
    data: null,
  });
});
