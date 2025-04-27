// models/Service.js
const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  cnic: { type: String, required: true },
  // Store images as binary data (Buffer) plus content type
  cnicPicFront: {
    data: Buffer,
    contentType: String,
    //required: true  // Uncomment this line if you want to enforce required images.
  },
  cnicPicBack: {
    data: Buffer,
    contentType: String,
    //required: true
  },
  userPic: {
    data: Buffer,
    contentType: String,
    //required: true
  },
  service: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  authorized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Service", ServiceSchema);