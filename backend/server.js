/*const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./User"); 

const app = express();

app.use(cors());            // ✅ allow React to connect
app.use(express.json());

// MongoDB connection string 
const mongoURI = "mongodb+srv://dbUser:dbUserPassword@eventeasecluster.ros41nx.mongodb.net/sample_mflix?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look for the user in MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Wrong password" });
    }

    res.json({ success: true, message: "Login successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running ");
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./Student"); 

const app = express();

app.use(cors());            // ✅ allow React to connect
app.use(express.json());

// MongoDB connection string 
const mongoURI = "mongodb+srv://dbUser:dbUserPassword@eventeasecluster.ros41nx.mongodb.net/eventease?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look for the user in MongoDB
    const stud = await Student.findOne({ email });

    if (!stud) {
      return res.json({ success: false, message: "User not found" });
    }

    if (stud.password !== password) {
      return res.json({ success: false, message: "Wrong password" });
    }

    res.json({ success: true, message: "Login successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Backend running ");
});*/
require("dotenv").config();  // MUST be first
console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Student = require("./Student"); // mongoose model for students
const Faculty = require("./Faculty"); // mongoose model for faculty
const PlacementCell = require("./PlacementCell");
const Admin = require("./Admin");
const sendEmail = require("./utils/sendEmail");

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(process.env.MONGO_URI);
//const 
// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Login API
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === "Student") {
      user = await Student.findOne({ email });
    } else if (role === "Faculty") {
      user = await Faculty.findOne({ email });
    } else if (role === "Placement Cell") {
      user = await PlacementCell.findOne({ email });
    } else if (role === "Admin") {
      user = await Admin.findOne({ email });
    } else {
      return res.json({ success: false, message: "Role not supported" });
    }

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Wrong password" });
    }

    res.json({ success: true, message: "Login successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

// Forgot Password
// Forgot Password (Direct Reset Flow)
app.post("/forgot-password", async (req, res) => {
  const { email, role } = req.body;

  let Model;

  // select correct model based on role
  if (role === "Student") Model = Student;
  else if (role === "Faculty") Model = Faculty;
  else if (role === "Placement Cell") Model = PlacementCell;
  else if (role === "Admin") Model = Admin;
  else {
    return res.json({
      success: false,
      message: "Invalid role",
    });
  }

  try {
    const user = await Model.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Email not registered",
      });
    }

    // secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

user.resetToken = hashedToken;
user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
await user.save();

const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.json({
      success: true,
      message: "Reset password link sent to email",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
    

//Reset Password
app.post("/reset-password/:token", async (req, res) => {
  const { password, role } = req.body;
  const { token } = req.params;

  let Model;
  if (role === "Student") Model = Student;
  else if (role === "Faculty") Model = Faculty;
  else if (role === "Placement Cell") Model = PlacementCell;
  else if (role === "Admin") Model = Admin;
  else {
    return res.json({ success: false, message: "Invalid role" });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await Model.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  user.password = password; // bcrypt via pre-save hook
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.json({
    success: true,
    message: "Password reset successful",
  });
});

