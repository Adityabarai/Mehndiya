# 🌸 Mehndi with Ayushi — Luxury Bridal & Occasion Henna Booking System

A full-stack, responsive web application for **Mehndi with Ayushi**, built with **React (Vite) + Node.js (Express) + Supabase (PostgreSQL)**.

---

## ✨ Features

- **Royal Indian Bridal Aesthetics**: Deep royal maroon, warm henna brown, champagne gold accents, and ivory with Google Fonts (`Cinzel`, `Great Vibes`, `Plus Jakarta Sans`).
- **Interactive Appointment Booking**:
  - Package selection with auto-calculated pricing
  - Date & time slot scheduling
  - Occasion & venue details (Studio in Jaipur vs On-Location travel)
  - Client personalization notes
  - **Instant One-Click WhatsApp Confirmation**: Auto-generates a formatted WhatsApp message with booking details directly to Ayushi's WhatsApp.
- **Supabase PostgreSQL Integration**:
  - Production-ready `bookings` schema with constraints and Row Level Security (RLS).
  - Dual-mode backend: Automatically works out-of-the-box with local memory fallback and switches seamlessly to Supabase PostgreSQL when credentials are added.
- **Curated Package Catalog**: Royal Bridal Couture, Bridal Elegance, Engagement & Roka, Sangeet & Bridesmaids Group, Festive Henna.
- **Filterable Signature Portfolio**: Categories for *Bridal Couture*, *Arabic*, *Floral & Mandala*, *Minimalist*, and *Dark Stain Results* with a full-screen Lightbox zoom modal.
- **Stain Science & Care Guide**: 4-step darkening ritual timeline and bridal Do's & Don'ts.
- **Admin Management Portal**: Built-in dashboard to review bookings, update statuses (`Pending`, `Confirmed`, `Completed`, `Cancelled`), view pipeline revenue, and search client records.

---

## 🚀 Quick Start (Running Locally)

### 1. Start the Backend API (Node.js + Express)

```bash
cd server
npm install
npm run dev
```
The API server will run at `http://localhost:5000`.

### 2. Start the Frontend Application (React + Vite)

In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The application will be live at `http://localhost:3000`.

---

## 🗄️ Supabase PostgreSQL Setup

1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `server/db/schema.sql` from this repository, paste its contents, and click **Run**. This will create the `bookings` table, indexes, and RLS security policies.
4. Go to **Project Settings > API** in your Supabase dashboard and copy:
   - **Project URL**
   - **service_role key** (or anon public key)
5. Paste them into `server/.env`:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-key-here
   ARTIST_WHATSAPP=919876543210
   ```
6. Restart the backend server. You will see:
   ```
   ✅ Supabase PostgreSQL Client successfully connected.
   ```

---

## 📁 Project Structure

```
Mehndiwithayushi/
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── components/          # Navbar, Hero, Services, BookingModal, Gallery, Admin, etc.
│   │   ├── data/                # Packages, gallery designs, reviews, FAQs
│   │   ├── utils/               # API client & Supabase connector
│   │   ├── App.jsx              # Main App entrypoint
│   │   └── index.css            # Luxury design system (Vanilla CSS)
│   ├── index.html
│   └── vite.config.js
│
├── server/                      # Node.js & Express Backend
│   ├── db/
│   │   ├── schema.sql           # Supabase PostgreSQL DDL and RLS policies
│   │   └── supabase.js          # Supabase client + graceful local fallback
│   ├── routes/
│   │   ├── bookings.js          # Booking submission, status update, stats
│   │   └── services.js          # Services catalog endpoint
│   ├── .env                     # Server environment config
│   └── server.js                # Express app entrypoint
│
└── README.md
```
