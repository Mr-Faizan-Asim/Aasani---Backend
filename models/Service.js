const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true, lowercase: true },
  cnic: { type: String, required: true },
  cnicPicFront: {
    data: Buffer,
    contentType: String,
  },
  cnicPicBack: {
    data: Buffer,
    contentType: String,
  },
  userPic: {
    data: Buffer,
    contentType: String,
  },
  tags: {
    type: [String],
    validate: {
      validator: arr => arr.length <= 5,
      message: "You can specify up to 5 tags only."
    },
    required: true
  },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true },
  authorized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Service", ServiceSchema);
