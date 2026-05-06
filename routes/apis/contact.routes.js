const express = require("express");
const router = express.Router();

const contactController = require("../../controllers/contact.controller");
const authController = require("../../controllers/authController");

router.post("/", contactController.createContact);

router.get(
  "/",
  authController.authorizeAPI(["admin"]),
  contactController.fetchContacts,
);

router.get(
  "/:id",
  authController.authorizeAPI(["admin"]),
  contactController.fetchContactById,
);

router.post(
  "/:id/follow-up",
  authController.authorizeAPI(["admin"]),
  contactController.addFollowUp,
);

router.patch(
  "/:id/status",
  authController.authorizeAPI(["admin"]),
  contactController.updateContactStatus,
);

router.delete(
  "/:id",
  authController.authorizeAPI(["admin"]),
  contactController.deleteContact,
);

module.exports = router;
