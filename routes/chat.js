const express = require("express");
const router = express.Router();
const Personal = require("../models/Personal");

router.post("/chat", async (req, res) => {
  const { email, prompt } = req.body;
  if (!email || !prompt) return res.status(400).json({ error: "Missing fields" });

  try {
    let user = await Personal.findOne({ email });

    if (!user) {
      user = new Personal({ email, summary: "" });
    }

    let oldSummary = user.summary ? user.decryptSummary() : "";
    let newSummary = summarize(`${oldSummary} ${prompt}`);

    // Keep max 4 lines
    newSummary = newSummary.split("\n").slice(0, 4).join("\n");

    user.summary = user.encryptSummary(newSummary);
    await user.save();

    res.json({ message: "Summary updated", summary: newSummary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

function summarize(text) {
  return text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(-4)
    .join(". ") + ".";
}

module.exports = router;
