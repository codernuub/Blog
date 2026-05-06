const Contact = require("../models/Contact.Model");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");

exports.createContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.create(req.body);

  return res.status(201).json({
    status: "success",
    data: {
      contact,
    },
  });
});

exports.fetchContacts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Contact.find({}), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields(["-__v"]);

  const contacts = await features.query.lean();

  const count = await Contact.countDocuments(features.queryObj);

  return res.status(200).json({
    status: "success",
    result: contacts.length,
    total: count,
    data: {
      contacts,
    },
  });
});

// GET SINGLE CONTACT
exports.fetchContactById = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id).lean();

  if (!contact) {
    return res.status(404).json({
      status: "fail",
      message: "Contact not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

// ADD FOLLOW-UP
exports.addFollowUp = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      status: "fail",
      message: "Contact not found",
    });
  }

  contact.followUps.push({
    message,
    addedBy: req?.user?.userId,
  });

  await contact.save();

  return res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

// UPDATE CONTACT STATUS
exports.updateContactStatus = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );

  if (!contact) {
    return res.status(404).json({
      status: "fail",
      message: "Contact not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

// DELETE CONTACT
exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return res.status(404).json({
      status: "fail",
      message: "Contact not found",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Contact deleted successfully",
  });
});
