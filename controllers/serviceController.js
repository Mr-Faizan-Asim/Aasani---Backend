const Service = require("../models/Service");

// @desc    Create new service
// @route   POST /api/services
// @access  Service-Provider
exports.createService = async (req, res, next) => {
  try {
    const { cnic, tags, description, price, location } = req.body;

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ message: "At least one tag is required." });
    }

    const service = new Service({
      user: req.user._id,
      email: req.user.email,
      cnic,
      tags,
      description,
      price,
      location
    });

    // Attach uploaded files
    ["cnicPicFront","cnicPicBack","userPic"].forEach(field => {
      if (req.files?.[field]) {
        service[field].data = req.files[field][0].buffer;
        service[field].contentType = req.files[field][0].mimetype;
      }
    });

    await service.save();
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

// @desc    Approve service
// @route   PUT /api/services/:id/authorize
// @access  Admin, SocietyAdmin
exports.authorizeService = async (req, res, next) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: "Not found" });

    svc.authorized = true;
    await svc.save();
    res.json(svc);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all services (admin)
// @route   GET /api/services
// @access  Admin
exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find()
      .populate("user", "name email")
      .select("-cnicPicFront.data -cnicPicBack.data -userPic.data");
    res.json(services);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current provider’s services
// @route   GET /api/services/my-services
// @access  Service-Provider
exports.getMyServices = async (req, res, next) => {
  try {
    const services = await Service.find({ user: req.user._id })
      .select("-cnicPicFront.data -cnicPicBack.data -userPic.data");
    res.json(services);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Private
exports.getServiceById = async (req, res, next) => {
  try {
    const svc = await Service.findById(req.params.id).populate("user", "name email");
    if (!svc) return res.status(404).json({ message: "Not found" });
    res.json(svc);
  } catch (err) {
    next(err);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Service-Provider, Admin
exports.updateService = async (req, res, next) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: "Not found" });

    // Only owner or privileged roles
    if (
      svc.user.toString() !== req.user._id.toString() &&
      !["Admin","SocietyAdmin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // copy over allowed fields
    ["cnic","tags","description","price","location"].forEach(f => {
      if (req.body[f] !== undefined) svc[f] = req.body[f];
    });

    // update any new uploads
    ["cnicPicFront","cnicPicBack","userPic"].forEach(field => {
      if (req.files?.[field]) {
        svc[field].data = req.files[field][0].buffer;
        svc[field].contentType = req.files[field][0].mimetype;
      }
    });

    await svc.save();
    res.json(svc);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Service-Provider, Admin
exports.deleteService = async (req, res, next) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: "Not found" });

    if (
      svc.user.toString() !== req.user._id.toString() &&
      !["Admin","SocietyAdmin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await svc.remove();
    res.json({ message: "Service removed" });
  } catch (err) {
    next(err);
  }
};


exports.findProviders = async (req, res, next) => {
    try {
      const { offerPrice /*, category*/ } = req.query;
      const filter = { authorized: true };
  
      // filter by price if given
      if (offerPrice) {
        filter.price = { $lte: Number(offerPrice) };
      }
  
      // if you ever want to reuse `category` as a tag filter:
      // if (category) filter.tags = category;
  
      const services = await Service.find(filter)
        .select("user email price tags description location")
        .populate("user", "_id");
  
      // shape each service to match your front-end props:
      const result = services.map(svc => ({
        _id:        svc._id,
        user:       svc.user._id,
        email:      svc.email,
        price:      svc.price,
        serviceTags: svc.tags,
        service:    svc.description,  // front-end uses `provider.service`
        location:   svc.location
      }));
  
      res.json(result);
    } catch (err) {
      next(err);
    }
  };