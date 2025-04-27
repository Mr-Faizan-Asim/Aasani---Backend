// routes/providerRoutes.js
const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providerController");
const multer = require("multer");

// Set up multer with memory storage for inline file buffers.
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (/jpeg|jpg|png|gif/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Register a new provider (with CNIC and user pictures)
router.post(
  "/register",
  upload.fields([
    { name: "cnicPicFront", maxCount: 1 },
    { name: "cnicPicBack", maxCount: 1 },
    { name: "userPic", maxCount: 1 }
  ]),
  providerController.registerProvider
);

// Find services by category & price query parameters
// e.g. GET /providers/find?category=plumbing&offerPrice=1000
router.get("/find", providerController.findServices);

// Get all authorized services
// GET /providers/all
router.get("/all", providerController.getAllServices);

// Get services filtered by category
// e.g. GET /providers/category/electrical
router.get("/category/:category", providerController.getServicesByCategory);

module.exports = router;
