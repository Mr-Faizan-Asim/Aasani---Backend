const mongoose = require("mongoose");
const crypto = require("crypto");

// Use a strong 32-byte key and 16-byte IV
const SECRET = process.env.SUMMARY_SECRET || "your-secret-password";
const key = crypto.scryptSync(SECRET, 'salt', 32); // derive key
const iv = Buffer.alloc(16, 0); // Use static IV or generate random one per entry

const encrypt = (text) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (text) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const PersonalSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  summary: { type: String }, // Encrypted summary
});

PersonalSchema.methods.encryptSummary = function (text) {
  return encrypt(text);
};

PersonalSchema.methods.decryptSummary = function () {
  return decrypt(this.summary);
};

module.exports = mongoose.model("Personal", PersonalSchema);
