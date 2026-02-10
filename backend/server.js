require("dotenv").config();  // MUST be first
console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Event = require("./Event"); // mongoose model for events
const Student = require("./Student"); // mongoose model for students
const Faculty = require("./Faculty"); // mongoose model for faculty
const PlacementCell = require("./PlacementCell");
const Admin = require("./Admin");
const sendEmail = require("./utils/sendEmail");
const Placement = require("./Placement");
const Registration = require("./Registration");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  console.log("Health check hit");
  res.send("Backend is alive");
});

const mongoURI = process.env.MONGO_URI;
//mongoose.connect(process.env.MONGO_URI);

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

    // ✅ SEND USER DETAILS
    // res.json({
    //   success: true,
    //   message: "Login successful",
    //   user: {
    //     name: user.name,
    //     email: user.email,
    //     studentId: user.studentId || user.studentID || "",
    //   },
    // });
    res.json({
  success: true,
  message: "Login successful",
  role: role.toLowerCase(),
  user: {
    name: user.studentName || "",
    email: user.email,
    studentId: user._id || "",
  },
});


  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


app.listen(5050, () => {
  console.log("Backend running on port 5050");
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

app.post("/faculty/events", async (req, res) => {
  try {
    console.log("EVENT DATA:", req.body);

    //const event = new Event(req.body);
    const event = new Event({
  ...req.body,
  status: "pending"
});

    await event.save();

    return res.status(201).json({
      success: true,
      message: "Event submitted successfully"
    });

  } catch (err) {
    console.error("SAVE EVENT ERROR FULL:", err.message, err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
app.get("/faculty/events", async (req, res) => {
  try {
    // const events = await Event.find();
    const events = await Event.find({ status: "approved" });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
// 🔴 ADMIN: view pending event requests
app.get("/admin/event-requests", async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
// ✅ Approve
app.patch("/admin/events/:id/approve", async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, {
      status: "approved"
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ❌ Reject
app.patch("/admin/events/:id/reject", async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, {
      status: "rejected"
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
app.get("/admin/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
// 🟢 ADMIN: view approved events (for dashboard)
app.get("/admin/events", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
app.get("/admin/events/count", async (req, res) => {
  const count = await Event.countDocuments({ status: "approved" });
  res.json({ success: true, count });
});
// 🎯 STUDENT: Get single event details
app.get("/student/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      event
    });

  } catch (err) {
    console.error("STUDENT EVENT FETCH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
app.get("/student/profile/:email", async (req, res) => {
  const student = await Student.findOne({
    email: req.params.email,
  }).select("-password");

  res.json({ success: true, student });
});


//Placement
app.post("/placement/create", async (req, res) => {
  try {
    const placement = new Placement(req.body);
    await placement.save();

    res.json({
      success: true,
      message: "Placement created",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
app.get("/placement/all", async (req, res) => {
  try {
    const placements = await Placement.find();

    const updatedPlacements = await Promise.all(
      placements.map(async (p) => {
        const regs = await Registration.find({ placementId: p._id });

        return {
          ...p._doc,
          totalRegistrations: regs.length,       // Count
          registrations: regs.map(r => ({        // Array of students
            name: r.name,
            email: r.email,
          })),
        };
      })
    );

    res.json({
      success: true,
      placements: updatedPlacements,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Get one placement by id
app.get("/placement/:id", async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    res.json({ success: true, placement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.patch("/admin/placement/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || id === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    await Placement.findByIdAndUpdate(id, { status });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});
app.patch("/placement/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body._id) {
      delete req.body._id;   // VERY IMPORTANT
    }

    const placement = await Placement.findByIdAndUpdate(
      id,
      { ...req.body, status: "pending" },
      { new: true }
    );

    res.json({ success: true, placement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// STUDENT REGISTER FOR PLACEMENT
app.post("/student/register/placement", async (req, res) => {
  try {
    const { studentId, placementId } = req.body;

    const registration = new Registration({
      studentId,
      placementId,
      eventId: null,
    });

    await registration.save();

    res.json({ success: true, message: "Registered successfully" });

    console.log("BODY RECEIVED:", req.body);

  } catch (err) {
    console.error(err);

    // duplicate registration
    if (err.code === 11000) {
      return res.json({
        success: false,
        message: "Already registered",
      });
    }

    res.status(500).json({ success: false });
  }
});

// STUDENT REGISTER FOR EVENT
app.post("/student/register/event", async (req, res) => {
  try {
    const { studentId, eventId } = req.body;

    const registration = new Registration({
      studentId,
      eventId,
      placementId: null,
    });

    await registration.save();

    res.json({ success: true, message: "Registered successfully" });

  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.json({
        success: false,
        message: "Already registered",
      });
    }

    res.status(500).json({ success: false });
  }
});

app.get("/student/registration/check", async (req, res) => {
  try {
    const { studentId, eventId, placementId } = req.query;

    const reg = await Registration.findOne({
      studentId,
      eventId: eventId || null,
      placementId: placementId || null,
    });

    res.json({ registered: !!reg });

  } catch (err) {
    res.status(500).json({ registered: false });
  }
});

app.get("/student/my-placements/:id", async (req, res) => {
  try {
    const data = await Registration.find({
      studentId: req.params.id,
    });

    res.json({ success: true, placements: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.put("/placement/result/:id", async (req, res) => {
  const { totalAppeared, totalPlaced } = req.body;

  const placement = await Placement.findByIdAndUpdate(
    req.params.id,
    { totalAppeared, totalPlaced },
    { new: true }
  );

  res.json({ success: true, placement });
});

app.get("/placement/:id/registrations", async (req, res) => {
  try {
    const placementId = req.params.id;
    const regs = await Registration.find({ placementId }).lean();

    // Map student info
    const regsWithDetails = await Promise.all(
      regs.map(async (r) => {
        const student = await Student.findById(r.studentId).lean();
        return {
          name: student?.name || "Unknown",
          email: student?.email || "Unknown",
        };
      })
    );

    res.json({ success: true, registrations: regsWithDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
