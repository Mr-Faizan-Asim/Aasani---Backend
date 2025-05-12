// models/Personal.js
const mongoose = require("mongoose");
const crypto = require("crypto");

const SECRET = process.env.SUMMARY_SECRET || "your-secret-key"; // Use env in production

const encrypt = (text) => {
  const cipher = crypto.createCipher("aes-256-cbc", SECRET);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (text) => {
  const decipher = crypto.createDecipher("aes-256-cbc", SECRET);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const PersonalSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  summary: { type: String }, // encrypted summary
});

PersonalSchema.methods.encryptSummary = function (text) {
  return encrypt(text);
};

PersonalSchema.methods.decryptSummary = function () {
  return decrypt(this.summary);
};

module.exports = mongoose.model("Personal", PersonalSchema);
