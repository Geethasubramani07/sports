require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: "" },
  sport: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now }
});
memberSchema.index({ email: 1 }, { unique: true });
const Member = mongoose.model("Member", memberSchema);

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  sport: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  coach: { type: String, default: "" }
});
const Activity = mongoose.model("Activity", activitySchema);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/members", async (req, res) => {
  try { res.json(await Member.find().sort({ joinedAt: -1 })); }
  catch (e) { res.status(500).json({ error: "Could not load members." }); }
});

app.post("/api/members", async (req, res) => {
  try {
    const { name, email, phone, sport } = req.body;
    if (!name || !email || !sport) return res.status(400).json({ error: "Name, email and sport are required." });
    const member = await Member.create({ name, email, phone, sport });
    res.status(201).json(member);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400).json({ error: e.code === 11000 ? "That email is already registered." : "Could not add member. Check the details." });
  }
});

app.delete("/api/members/:id", async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Member not found." });
    res.json({ message: "Member removed." });
  } catch (e) { res.status(400).json({ error: "Invalid member ID." }); }
});

app.get("/api/activities", async (req, res) => {
  try { res.json(await Activity.find().sort({ date: 1, time: 1 })); }
  catch (e) { res.status(500).json({ error: "Could not load activities." }); }
});

app.post("/api/activities", async (req, res) => {
  try {
    const { title, sport, date, time, coach } = req.body;
    if (!title || !sport || !date || !time) return res.status(400).json({ error: "Title, sport, date and time are required." });
    const activity = await Activity.create({ title, sport, date, time, coach });
    res.status(201).json(activity);
  } catch (e) { res.status(400).json({ error: "Could not add activity." }); }
});

app.delete("/api/activities/:id", async (req, res) => {
  try {
    const deleted = await Activity.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Activity not found." });
    res.json({ message: "Activity removed." });
  } catch (e) { res.status(400).json({ error: "Invalid activity ID." }); }
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const PORT = process.env.PORT || 3000;
async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI. Create a .env file using .env.example.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, "0.0.0.0", () => console.log(`Sports Club app running on port ${PORT}`));
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
start();