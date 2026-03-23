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
const Feedback = require("./Feedback");
const PlacementFeedback = require("./PlacementFeedback");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  console.log("Health check hit");
  res.send("Backend is alive");
});

const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Login API
// app.post("/login", async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     let user;

//     if (role === "Student") {
//       user = await Student.findOne({ email });
//     }

//     else if (role === "Faculty") {
//       user = await Faculty.findOne({ email });
//     }

//     else if (role === "Admin") {
//       user = await Admin.findOne({ email });
//     }
//     else if (role === "Placement Cell") {   // 🔥 ADD THIS
//       user = await PlacementCell.findOne({ email });
//     }
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }
//     // password check here...
//     res.json({
//       success: true,
//       role: role.toLowerCase(),
//       user: {
//         _id: user._id,
//         email: user.email,
//         name: user.name,
//         studentId: user.studentId || null
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === "Student") {
      user = await Student.findOne({ email });
    } else if (role === "Faculty") {
      user = await Faculty.findOne({ email });
    } else if (role === "Admin") {
      user = await Admin.findOne({ email });
    } else if (role === "Placement Cell") {
      user = await PlacementCell.findOne({ email });
    }

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ 🔥 PASSWORD CHECK (YOU MISSED THIS)
    
const isMatch = password === user.password;
if (!isMatch) {
  return res.json({
    success: false,
    message: "Incorrect password"
  });
}

    res.json({
      success: true,
      role: role.toLowerCase(),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        studentId: user.studentId || null
      }
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
    const faculty = await Faculty.findOne({
      email: req.body.conductedBy
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found"
      });
    }

    const {
      eventName,
      date,
      startTime,
      endTime,
      venue,
      eligible,
      description,
      maxParticipants   // 👈 ADD THIS
    } = req.body;

    const event = new Event({
      eventName,
      date,
      startTime,
      endTime,
      venue,
      eligible,
      description,
      maxParticipants: maxParticipants || null,  // 👈 STORE LIMIT
      conductedBy: faculty._id,
      status: "pending"
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: "Event submitted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/faculty/events", async (req, res) => {
  try {
    const events = await Event.find().populate("conductedBy");

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {

        // Registration count
        const registeredCount = await Registration.countDocuments({
          eventId: event._id,
        });

        // Feedbacks
        const feedbacks = await Feedback.find({
          eventId: event._id,
        });

        const avg =
          feedbacks.length > 0
            ? feedbacks.reduce((sum, f) => sum + f.rating, 0) /
            feedbacks.length
            : 0;

        return {
          ...event._doc,
          registeredCount,
          feedbackCount: feedbacks.length,
          averageRating: avg,
        };
      })
    );

    res.json({ success: true, events: enrichedEvents });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/admin/event-requests", async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" })
      .populate("conductedBy", "name");   // 👈 THIS IS THE FIX

    res.json({
      success: true,
      events
    });

  } catch (err) {
    console.error("ADMIN EVENT FETCH ERROR:", err);
    res.status(500).json({ success: false });
  }
});

app.patch("/admin/events/:id/approve", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.json({ success: true, event: updatedEvent });

  } catch (err) {
    console.error(err);
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
app.get("/admin/events", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" })
      .populate("conductedBy", "name");

    const eventsWithStats = await Promise.all(
      events.map(async (event) => {

        const registrationCount = await Registration.countDocuments({
          eventId: event._id
        });

        const feedbacks = await Feedback.find({
          eventId: event._id
        });

        const feedbackCount = feedbacks.length;

        const averageRating =
          feedbackCount > 0
            ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbackCount
            : 0;

        return {
          ...event._doc,
          registeredCount: registrationCount,
          feedbackCount,
          averageRating
        };
      })
    );

    res.json({ success: true, events: eventsWithStats });

  } catch (err) {
    console.error("ADMIN EVENTS FETCH ERROR:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/admin/events/count", async (req, res) => {
  const count = await Event.countDocuments({ status: "approved" });
  res.json({ success: true, count });
});

app.get("/student/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("conductedBy", "name");   // 🔥 THIS IS THE FIX

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
        const regs = await Registration.find({ placementId: p._id })
          .populate("studentId", "name email");

        return {
          ...p._doc,
          totalRegistrations: regs.length,       // Count
          registrations: regs.map(r => ({        // Array of students
            name: r.studentId?.name || "Unknown",
            email: r.studentId?.email || "Unknown",
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

app.post("/student/register/event", async (req, res) => {
  try {
    const { studentId, eventId } = req.body;

    if (!studentId || !eventId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({ message: "Event not found" });
    }
    // ✅ 1️⃣ CHECK DUPLICATE REGISTRATION (ADD HERE)
    const alreadyRegistered = await Registration.findOne({
      studentId,
      eventId
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "Already registered"
      });
    }
    // 🔥 ADD THIS PART HERE
    //  if (event.maxParticipants !== null){
    if (event.maxParticipants && event.maxParticipants > 0){
      const totalRegistrations = await Registration.countDocuments({
        eventId: event._id
      });

      if (totalRegistrations >= event.maxParticipants) {
        return res.status(400).json({
          message: "Event is full"
        });
      }
    }
    // 🔥 END OF ADDED PART

    const registration = new Registration({
      studentId: student._id,
      name: student.name,
      eventName: event.eventName,
      date: event.date,
      conductedBy: event.conductedBy,
      eventId: event._id
    });

    await registration.save();

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
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
      placementId: { $ne: null }
    }).populate("placementId");

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
// 🔴 DELETE STUDENT
app.delete("/admin/student/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 🔴 DELETE FACULTY
app.delete("/admin/faculty/:id", async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
// GET all students
app.get("/admin/students", async (req, res) => {
  const students = await Student.find().select("-password");
  res.json({ success: true, students });
});

// GET all faculty
app.get("/admin/faculty", async (req, res) => {
  const faculty = await Faculty.find().select("-password");
  res.json({ success: true, faculty });
});

app.get("/events/approved", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" })
      .populate("conductedBy", "_id name");


    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
app.post("/events/register", async (req, res) => {
  try {
    const { eventId, studentId } = req.body;

    // Prevent duplicate registration
    const existing = await Registration.findOne({ eventId, studentId });
    if (existing) {
      return res.json({ success: false, message: "Already registered" });
    }

    const registration = new Registration({
      eventId,
      studentId
    });

    await registration.save();

    res.json({ success: true });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/student/my-registrations/:studentId", async (req, res) => {
  try {
    const registrations = await Registration.find({
      studentId: req.params.studentId
    });

    res.json({
      success: true,
      registrations
    });

  } catch (err) {
    console.error("MY REG ERROR:", err);
    res.status(500).json({ success: false });
  }
});
app.get("/faculty/event/:id/students", async (req, res) => {
  try {
    const eventObjectId = new mongoose.Types.ObjectId(req.params.id);

    const registrations = await Registration.find({
      eventId: eventObjectId
    }).populate("studentId", "name email studentId");  //  THIS LINE IS KEY

    console.log("EVENT ID:", req.params.id);
    console.log("FOUND:", registrations);

    res.json({
      success: true,
      students: registrations
    });

  } catch (err) {
    console.error("FACULTY STUDENTS ERROR:", err);
    res.status(500).json({ success: false });
  }
});
app.get("/admin/dashboard-stats", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalPlacementCell = await PlacementCell.countDocuments();

    const totalUsers =
      totalStudents +
      totalFaculty +
      totalPlacementCell;

    res.json({
      success: true,
      totalUsers,
      totalStudents,
      totalFaculty,
      totalPlacementCell
    });

  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    res.status(500).json({ success: false });
  }
});
app.post("/student/register-event", async (req, res) => {
  try {
    const { studentId, eventId } = req.body;

    // CHECK IF ALREADY REGISTERED
    const existing = await Registration.findOne({
      studentId,
      eventId
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Already registered"
      });
    }

    const newRegistration = new Registration({
      studentId,
      eventId
    });

    await newRegistration.save();

    res.json({
      success: true,
      message: "Registration successful"
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false });
  }
});
app.post("/student/feedback", async (req, res) => {
  try {
    const { eventId, studentId, rating, comment } = req.body;

    const feedback = new Feedback({
      eventId,
      studentId,
      rating,
      comment
    });

    await feedback.save();

    res.json({ success: true });

  } catch (err) {
    if (err.code === 11000) {
      return res.json({
        success: false,
        message: "Feedback already submitted"
      });
    }

    console.error("FEEDBACK ERROR:", err);
    res.status(500).json({ success: false });
  }
});

app.post("/student/placement-feedback", async (req, res) => {
  try {
    const { placementId, studentId, rating, comment } = req.body;

    // basic validation
    if (!placementId || !studentId || !rating) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    const existing = await PlacementFeedback.findOne({
      placementId,
      studentId
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Feedback already submitted for this drive"
      });
    }

    // create feedback
    const feedback = new PlacementFeedback({
      placementId,
      studentId,
      rating,
      comment
    });

    await feedback.save();

    res.json({ success: true });
  } catch (err) {
    console.error("PLACEMENT FEEDBACK ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.get("/admin/reports", async (req, res) => {
  try {
    // ===== EVENT FEEDBACKS =====
    const eventFeedbacks = await Feedback.find()
      .populate("eventId", "eventName")
      .lean();

    const formattedEvents = eventFeedbacks.map(f => ({
      ...f,
      type: "event"
    }));

    // ===== PLACEMENT FEEDBACKS =====
    const placementFeedbacks = await PlacementFeedback.find()
      .populate("placementId", "name jobrole company")
      .lean();

    const formattedPlacements = placementFeedbacks.map(f => ({
      ...f,
      type: "placement"
    }));

    // ===== MERGE + SORT =====
    const allFeedbacks = [...formattedEvents, ...formattedPlacements]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      feedbacks: allFeedbacks
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/placement/feedback-summary/:id", async (req, res) => {
  try {
    const placementId = req.params.id;

    const feedbacks = await PlacementFeedback.find({ placementId });

    const total = feedbacks.length;

    const avg =
      total > 0
        ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / total
        ).toFixed(1)
        : 0;

    res.json({
      success: true,
      totalFeedbacks: total,
      avgRating: avg,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

const getRegisteredStudents = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const registrations = await Registration.find({ eventId })
      .populate("studentId");

    if (!registrations.length) {
      return res.json([]);
    }

    const students = registrations.map(reg => reg.studentId);

    res.json(students);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

app.get(
  "/faculty/events/:eventId/registered-students",
  getRegisteredStudents
);
app.get("/admin/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("conductedBy", "name");

    if (!event) {
      return res.status(404).json({ success: false });
    }

    // Registration count
    const registrationCount = await Registration.countDocuments({
      eventId: event._id
    });

    // Feedbacks
    const feedbacks = await Feedback.find({
      eventId: event._id
    });

    const feedbackCount = feedbacks.length;

    const averageRating =
      feedbackCount > 0
        ? feedbacks.reduce((sum, f) => sum + f.rating, 0) /
        feedbackCount
        : 0;

    const performance =
      registrationCount > 0
        ? ((feedbackCount / registrationCount) * 100).toFixed(0)
        : 0;

    res.json({
      success: true,
      event,
      registeredCount: registrationCount,
      feedbackCount,
      averageRating,
      performance,
      feedbacks
    });

  } catch (err) {
    console.error("ADMIN EVENT DETAILS ERROR:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/faculty/events/calendar", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("conductedBy", "_id name");

    res.json({ success: true, events });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});
app.post("/admin/add-event", async (req, res) => {
  try {
    console.log("BODY:", req.body);

   const newEvent = new Event({
  eventName: req.body.eventName,
  date: new Date(req.body.date),
  status: "approved",
  conductedBy: req.body.adminId || null  // ✅ temporary fix
});

    await newEvent.save();

    res.json({ success: true });

  } catch (err) {
    console.error("ADD EVENT ERROR:", err);  // 🔥 THIS WILL SHOW REAL ISSUE
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});