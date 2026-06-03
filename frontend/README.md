# 🎨 CareSync Frontend

The frontend of **CareSync** is a highly interactive, responsive, and secure web application built using **Next.js 14 (App Router)**. It provides distinct, role-based dashboards for Patients, Doctors, and Administrators, all sharing a unified, premium design language.

---

## 🛠️ Technology Stack

*   **Framework:** Next.js 14 (React)
*   **Routing:** Next.js App Router & Edge Middleware
*   **Styling:** Tailwind CSS (Custom teal medical branding, fluid animations)
*   **State Management:** Zustand (Client-side auth hydration)
*   **Form Validation:** React Hook Form + Zod (Client-side schemas)
*   **Data Fetching:** Axios (with Interceptors for JWT injection)
*   **Data Visualization:** Recharts (Admin analytics dashboards)
*   **UI Feedback:** Sonner (Toast notifications)

---

## 📁 Folder Structure Explained

```text
frontend/
├── app/                  # Next.js App Router Root
│   ├── (admin)/          # 🛡️ Route Group: Administrator Pages
│   │   ├── dashboard/    # Recharts analytics and KPI cards
│   │   ├── doctors/      # Pending doctor approvals workflow
│   │   └── layout.jsx    # Dark-themed Admin Sidebar
│   │
│   ├── (auth)/           # 🔓 Route Group: Authentication
│   │   ├── login/        # Standard login form
│   │   └── register/     # Two-step registration (Role selection -> Form)
│   │
│   ├── (patient)/        # 🛡️ Route Group: Patient Pages
│   │   ├── appointments/ # Tabbed appointment list, cancel/review actions
│   │   ├── dashboard/    # Upcoming visits and quick actions
│   │   ├── records/      # Health record uploads (multipart forms) & sharing
│   │   └── layout.jsx    # Patient Sidebar Navigation
│   │
│   ├── doctor/           # 🛡️/🔓 Doctor Routes
│   │   ├── appointments/ # Patient management
│   │   ├── dashboard/    # Today's schedule & pending requests
│   │   ├── profile/      # Weekly availability builder & fee settings
│   │   ├── prescriptions/# Digital prescription writer (dynamic form arrays)
│   │   └── layout.jsx    # Doctor Sidebar Navigation
│   │
│   ├── doctors/          # 🔓 Public Patient-facing Doctor Directory
│   │   ├── [id]/         # Public Doctor Profile with Interactive Booking Widget
│   │   └── page.jsx      # Doctor search with debounced filtering and pagination
│   │
│   ├── globals.css       # Tailwind directives & core font imports (DM Sans)
│   ├── layout.jsx        # Root HTML shell & Sonner Toaster Provider
│   └── page.jsx          # Stunning 3D animated landing page
│
├── lib/                  
│   └── axios.js          # Configured Axios instance (Base URL, JWT Header injection, global 401 handling)
│
├── store/                
│   └── authStore.js      # Zustand store keeping the UI synced with localStorage JWT state
│
└── middleware.js         # Next.js Edge Middleware for strict route protection
```

---

## 🔐 Route Protection & State

### **Next.js Edge Middleware** (`middleware.js`)
Security is pushed to the edge. The middleware intercepts every request before it renders:
1. It checks cookies for the `cl_token`.
2. It decodes the JWT payload to read the user's `role`.
3. It enforces strict boundary rules (e.g., if a `patient` tries to load `/doctor/dashboard`, the middleware instantly redirects them back to `/dashboard`).

### **Zustand Auth Hydration** (`store/authStore.js`)
On the client side, Zustand manages the authenticated user's state. When a user logs in, Zustand saves the token to both `localStorage` (for Axios) and a `cookie` (for the Edge Middleware), ensuring the application state is always perfectly synced.

---

## 🎨 UI/UX Philosophy

*   **No Placeholders:** Real-time feedback via Sonner toasts, empty state illustrations, and loading spinners ensure the user is never left guessing.
*   **Premium Aesthetics:** Heavy usage of Tailwind's `backdrop-blur`, custom `box-shadows`, smooth `transition-all`, and a strict, high-contrast color palette (Teal + Whites + Grays).
*   **Dynamic Interactions:** Hover effects, animated blobs, floating elements, and optimistic UI updates (e.g., in the Admin dashboard) create a "snappy" and highly modern feel.

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env.local` file by copying the example:
   ```bash
   cp .env.example .env.local
   ```
   *Your `.env.local` should look like this:*
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *The web app will be available at `http://localhost:3000`*
