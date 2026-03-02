📅 EventEase – Event & Placement Management System
EventEase is a full-stack web application built to manage academic events and placements efficiently.
It provides separate dashboards for Admin, Faculty, Students, and Placement Cell with role-based access control.

🚀 Key Features:
👨‍🏫 Faculty Panel
    Create new events (approval-based system)
    Set maximum participant limit for events
    Track pending and approved requests
    View event history
    View registered students for each event
    Calendar with color-coded indicators:
        🟡 Pending Approval
        🔵 My Approved Events
        🟣 Other Faculty Approved Events

🎓 Student Panel
    View approved events
    Register for events 
    Prevent duplicate registrations
    Automatic participant limit enforcement
    Registration status checking

🏢 Placement Cell Panel
    Add new placement drives
    Manage company details
    View student applications
    No participant limitation for placement drives
    Monitor placement records

👨‍💼 Admin Panel
    Approve / Reject faculty event requests
    Manage placements
    View calendar overview
    Generate reports

🛠 Tech Stack
Frontend
    React.js
    React Router
    CSS
    Fetch API
Backend
    Node.js
    Express.js
    MongoDB
    Mongoose

🧠 Event Participant Limitation Logic
    Faculty can define maxParticipants while creating an event.
    If maxParticipants is not specified, the event allows unlimited registrations.
    During student registration:
    Duplicate registrations are prevented.
    If the maximum seat limit is reached, further registrations are blocked.
    Only approved events are visible and open for student registration.

📊 Status Workflow
    Faculty submits a new event → Status: pending
    Admin reviews the event request.
    If approved → Status: approved
    Students can register only for events with approved status.

🔐 Security & Validation
    Duplicate registration validation.
    Event capacity enforcement.
    Status-based filtering (pending / approved / rejected).
    Faculty ownership verification.
    Backend-side validation before saving any data.

📌 Future Enhancements
    JWT-based authentication system.
    Real-time seat availability counter.
    Email notification system.
    Advanced analytics dashboard.
    Pagination and search filters for large datasets.
