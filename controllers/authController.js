const UserModel = require("../models/User.Model");

const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * @name login
 * @deprecated verify user credential
 */
exports.login = catchAsync(async (req, res, next) => {
  //find user with email
  const user = await UserModel.findOne({ username: req.body.username }).select(
    "role password active"
  );

  //if user not found send error response
  if (!user) return next(new AppError("User not found!", 404));

  if (!user.active)
  return next(
    new AppError("Your account is suspended!. Please contact admin", 400)
  );

  //if password not matched send error response
  if (!user.isPasswordMatched(req.body.password, user.password || ""))
    return next(new AppError("Password is incorrect!", 400));

  //store user details in req object
  req.body.user = {
    userId: user._id,
    role: user.role,
  };

  //move to next function to generate jwt token
  return next();
});

/**
 * @name createAuthenticationToken
 * @description create jwt token after login/signup
 */
exports.createAuthenticationToken = catchAsync(async (req, res, next) => {
  //store user details in payload
  const payload = req.body.user;
  //sign payload with token secret
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: `${process.env.TOKEN_EXPIRES_IN_MIN}m`,
  });

  //send token to user in response
  return res
    .status(200)
    .cookie("token", token, {
      expiresIn: Date.now() + process.env.TOKEN_EXPIRES_IN_MIN * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      status: "authorized",
      data: null,
    });
});

/**
 * @name authorizeAPI
 * @description allow only registered users to access the resource
 */
exports.authorizeAPI = (roles) => {
  return async (req, res, next) => {
    //get jwt token from cookies or headers
    const token = req.cookies.token;
    //if token not available send error resposne
    if (!token) return next(new AppError("You are not authorized!", 401));

    try {
      //verify user token
      const userPayload = jwt.verify(token, process.env.TOKEN_SECRET);
      //if route roles does not match with user role prevent user from accessing route
      if (!roles.includes(userPayload.role))
        throw { message: "Permision denied" };
      //store user payload in req.body object to access in next function
      req.user = userPayload;
    } catch (err) {
      return res.status(401).json({
        status: "unauthorized",
        message: err.message,
      });
    }
    //move to next function
    return next();
  };
};

/**
 * @name authorizePage
 * @description redirect unauthorized user to login page
 */
exports.authorizePage = (roles) => {
  //return function
  return async (req, res, next) => {
    //get jwt token from cookies or headers
    const token = req.cookies.token;
    //if token not available send error resposne
    if (!token) {
      return res.redirect("/dashboard/login");
    }

    try {
      //verify user token
      const userPayload = jwt.verify(token, process.env.TOKEN_SECRET);
      //if route roles does not match with user role prevent user from accessing route
      if (!roles.includes(userPayload.role)) throw { message: "unauthorized" };
      //store user payload in req.body object to access in next function
      req.user = await UserModel.findOne({ _id: userPayload.userId }).lean();

      if (!req.user) throw { message: "unauthorized" };
    } catch (err) {
      return res.redirect("/dashboard/login");
    }
    //move to next function
    return next();
  };
};
