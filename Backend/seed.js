/**
 * seed.js — Creates a super_admin test user for API testing.
 * Run once: node seed.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_event_management";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB Connected");

  const User = require("./models/User.model");

  const email = "superadmin@cems.test";
  const password = "Admin@12345";

  // Remove old test super_admin if exists
  await User.deleteOne({ email });

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: "Super Admin",
    email,
    phone: "9999900000",
    password: hashed,
    role: "super_admin",
    status: "active",
  });

  console.log("✅ Super Admin created:");
  console.log("   Email   :", email);
  console.log("   Password:", password);
  console.log("   User ID :", user._id.toString());

  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
