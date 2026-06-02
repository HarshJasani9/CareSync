<div align="center">
  
  # 🏥 CareLink

  **A Modern, Production-Ready Healthcare Management Platform**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
</div>

<br/>

CareLink is a comprehensive, full-stack healthcare platform built on the **MERN** stack (MongoDB, Express, React/Next.js, Node.js). It seamlessly connects patients with verified medical professionals, handling everything from secure appointment booking and digital PDF prescriptions to health record sharing and administrative oversight.

---

## ✨ Key Features

### 👤 For Patients
- **Smart Discovery:** Search for doctors by name, or filter by specialization, consultation fee, and rating.
- **Frictionless Booking:** View a doctor's weekly schedule and book available time slots with real-time conflict prevention.
- **Health Records Vault:** Securely upload medical documents (PDFs & Images) to Cloudinary and selectively share them with specific doctors.
- **Digital Prescriptions:** Receive and download beautifully formatted PDF prescriptions instantly.
- **Review System:** Leave 5-star ratings and feedback for doctors after completed visits.

### 👨‍⚕️ For Doctors
- **Profile & Schedule Builder:** Manage your bio, qualifications, fee, and build a custom weekly availability schedule.
- **Appointment Management:** Accept or reject incoming patient requests from a streamlined dashboard.
- **Prescription Writer:** Use a dynamic, multi-row form to issue medicines. The system automatically compiles this into a branded PDF and emails the patient.
- **Shared Records:** Securely view health records shared with you by your patients.

### 🛡️ For Administrators
- **Platform Analytics:** View real-time platform statistics including a Recharts-powered pie chart of appointment statuses.
- **Doctor Verification:** Review pending doctor applications to ensure only qualified professionals join the platform. Automated emails notify doctors of approval/rejection.

---

## 🛠️ Technology Stack

### **Frontend**
*   **Framework:** Next.js 14 (App Router)
*   **Styling:** Tailwind CSS (Custom teal medical branding)
*   **State Management:** Zustand (Session & Role management)
*   **Forms & Validation:** React Hook Form + Zod
*   **Data Visualization:** Recharts
*   **HTTP Client:** Axios (Configured with interceptors)
*   **Alerts:** Sonner

### **Backend**
*   **Core:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs
*   **File Storage:** Cloudinary, Multer (Memory Storage)
*   **Document Generation:** PDFKit
*   **Email Service:** Nodemailer configured with Resend SMTP
*   **Security:** Helmet, express-rate-limit, cors

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB URI
*   Cloudinary Account
*   Resend (or any SMTP provider) Account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/CareLink.git
cd CareLink
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.resend.com
EMAIL_PORT=465
EMAIL_USER=resend
EMAIL_PASS=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev

FRONTEND_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window.
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the Next.js development server:
```bash
npm run dev
```

---

## 📁 Folder Structure

```text
CareLink/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # API business logic (Auth, Doctors, Appointments, etc.)
│   ├── middleware/     # Auth checks, error handling, file upload, validation
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route definitions
│   └── utils/          # PDF generation & Email transport templates
│
└── frontend/
    ├── app/            # Next.js 14 App Router layout
    │   ├── (admin)/    # Protected admin routes & dashboard
    │   ├── (auth)/     # Login & Multi-step Registration
    │   ├── (patient)/  # Protected patient routes
    │   └── doctor/     # Protected doctor routes & public profiles
    ├── lib/            # Axios interceptor setup
    └── store/          # Zustand global state (AuthStore)
```

---

## 🔒 Security Measures
*   **Role-Based Access Control (RBAC):** Backend endpoints and frontend routes are strictly guarded by `patient`, `doctor`, and `admin` roles.
*   **JWT & Cookies:** Tokens are stored in localStorage for Axios and synced to cookies for Next.js Middleware route protection.
*   **Rate Limiting:** Protects the API from DDoS and brute force attacks.
*   **Orphan File Cleanup:** Deleting a health record automatically triggers a deletion request to Cloudinary via `publicId` to prevent storage leaks.

---

<div align="center">
  <i>Designed and built for modern healthcare management.</i>
</div>
