// routes/serviceRoutes.js
const express = require("express");
const multer  = require("multer");
const { protect } = require("../middleware/auth");
const {
  createService,
  authorizeService,
  getAllServices,
  getMyServices,
  getServiceById,
  updateService,
  deleteService,
  findProviders      // ← import the new method
} = require("../controllers/serviceController");

const upload = multer();
const router = express.Router();

// Find (public)
router.get("/find", findProviders);

// Create
router.post(
  "/",
  upload.fields([
    { name: "cnicPicFront", maxCount: 1 },
    { name: "cnicPicBack",  maxCount: 1 },
    { name: "userPic",      maxCount: 1 },
  ]),
  protect,             // if you want only signed-in providers to call this
  createService
);

// ... the rest of your routes follow
router.put("/:id/authorize", authorizeService);
router.get("/", getAllServices);
router.get("/my-services", protect, getMyServices);
router.get("/:id", getServiceById);
router.put(
  "/:id",
  upload.fields([
    { name: "cnicPicFront", maxCount: 1 },
    { name: "cnicPicBack",  maxCount: 1 },
    { name: "userPic",      maxCount: 1 },
  ]),
  protect,
  updateService
);
router.delete("/:id", protect, deleteService);

module.exports = router;
