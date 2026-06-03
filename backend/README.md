# ⚙️ CareSync Backend

The backend of **CareSync** is a robust, modular RESTful API built with **Node.js** and **Express.js**. It handles all business logic, data persistence (via **MongoDB**), secure authentication, file uploads, and automated background tasks like PDF generation and email notifications.

---

## 🛠️ Technology Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (via Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs (password hashing)
*   **File Storage:** Cloudinary & Multer (memory buffering)
*   **Document Generation:** PDFKit (for digital prescriptions)
*   **Email Deliverability:** Nodemailer integrated with Resend SMTP
*   **Security:** Helmet (HTTP headers), express-rate-limit (DDoS protection), cors

---

## 📁 Folder Structure Explained

```text
backend/
├── config/             # Database connection setups
│   └── db.js           # Mongoose connection logic
│
├── controllers/        # Core business logic for each route
│   ├── adminController.js         # Approvals, platform stats aggregate queries
│   ├── appointmentController.js   # Booking logic, conflict prevention
│   ├── authController.js          # Login, Registration, JWT generation
│   ├── doctorController.js        # Doctor search, filtering, profile updates
│   ├── prescriptionController.js  # Prescription creation & tying to appointments
│   ├── recordController.js        # Health record uploads and sharing logic
│   └── reviewController.js        # Creating/deleting patient reviews
│
├── middleware/         # Request interceptors
│   ├── auth.js         # JWT verification, `protect` and `authorize` (RBAC) roles
│   ├── errorHandler.js # Global error catching & formatting
│   ├── upload.js       # Multer configuration for memory-buffered file uploads
│   └── validate.js     # express-validator schemas for all incoming POST/PUT/PATCH data
│
├── models/             # MongoDB Schemas
│   ├── Appointment.js  
│   ├── Doctor.js       # Extended doctor profile (slots, fee, rating)
│   ├── HealthRecord.js # File URLs and access arrays
│   ├── Prescription.js # PDF URLs and medicine arrays
│   ├── Review.js       # Pre/Post save hooks to auto-calculate doctor ratings
│   └── User.js         # Base user schema (email, password, role)
│
├── routes/             # Express Router definitions (linking endpoints to controllers)
│   ├── admin.js, appointments.js, auth.js, etc.
│
├── utils/              # Helper functions and services
│   ├── generatePDF.js  # PDFKit logic for rendering digital prescriptions
│   └── sendEmail.js    # Nodemailer transporter and HTML email templates
│
├── render.yaml         # Render deployment configuration
└── server.js           # App entry point, middleware mounts, server start
```

---

## 🔐 Security Architecture

1.  **Role-Based Access Control (RBAC):**
    The `authorize(...roles)` middleware restricts route access. E.g., `router.post('/', protect, authorize('doctor'), createPrescription)` ensures only verified doctors can issue prescriptions.
2.  **Rate Limiting:**
    `express-rate-limit` prevents brute-force attacks by limiting requests to 100 per 15 minutes globally. Trust proxy is enabled in production.
3.  **Data Validation:**
    Every request body is sanitized and validated using `express-validator` before reaching the controllers to prevent injection and bad data.
4.  **Cloudinary Resource Cleanup:**
    When a health record or user is deleted, the backend uses the stored `publicId` to issue a deletion command to Cloudinary, ensuring no orphaned files exist.

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   *(Update the `.env` file with your specific credentials, refer to the root README for more details)*
3. Start the development server (uses `nodemon` for hot-reloading):
   ```bash
   npm run dev
   ```
   *The API will be available at `http://localhost:5000/api`*
