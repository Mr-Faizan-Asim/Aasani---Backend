// controllers/providerController.js
const User = require("../models/User");
const Service = require("../models/Service");

exports.registerProvider = async (req, res) => {
  try {
    const { email, cnic, service, category, price } = req.body;

    // Ensure the user exists.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found. Please sign up as a user first."
      });
    }

    // Validate that required file uploads exist.
    if (
      !req.files ||
      !req.files.cnicPicFront ||
      !req.files.cnicPicBack ||
      !req.files.userPic
    ) {
      return res.status(400).json({
        message: "All picture files (CNIC front, CNIC back, user picture) are required."
      });
    }

    // Retrieve file buffers and their MIME types from memory.
    const cnicPicFrontFile = req.files.cnicPicFront[0];
    const cnicPicBackFile = req.files.cnicPicBack[0];
    const userPicFile = req.files.userPic[0];

    // Create a new Service document with binary image data.
    const newService = new Service({
      user: user._id,
      email,
      cnic,
      cnicPicFront: {
        data: cnicPicFrontFile.buffer,
        contentType: cnicPicFrontFile.mimetype,
      },
      cnicPicBack: {
        data: cnicPicBackFile.buffer,
        contentType: cnicPicBackFile.mimetype,
      },
      userPic: {
        data: userPicFile.buffer,
        contentType: userPicFile.mimetype,
      },
      service,
      category,
      price,
    });

    await newService.save();
    return res.status(201).json({
      message: "Provider registered successfully",
      service: newService,
    });
  } catch (error) {
    console.error("Error in provider registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Search services by query params (category + max price)
exports.findServices = async (req, res) => {
  try {
    const { category, offerPrice } = req.query;
    const filter = { authorized: true };

    if (category) filter.category = category;
    if (offerPrice) filter.price = { $lte: parseInt(offerPrice, 10) };

    const services = await Service.find(filter).sort({ price: 1 });
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error while searching for services:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all authorized services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ price: 1 });
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching all services:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get services by category (path param)
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.find({ category}).sort({ price: 1 });
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services by category:", error);
    return res.status(500).json({ message: "Server error" });
  }
};