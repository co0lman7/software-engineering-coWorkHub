# CoWorkHub 

A modern coworking space booking web application

---

## Overview

CoWorkHub allows users to discover, explore, and book coworking spaces. It features workspace browsing with filters, detailed workspace pages, a full booking flow with pricing calculation, a user dashboard to manage bookings, and an admin dashboard for managing workspaces.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Routing | React Router v7 |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| Build Tool | Vite |
| Database | Supabase (PostgreSQL) |
| Icons | Lucide React |
| Notifications | Sonner |

---

## Project Structure

```
CoWorkHub Web App/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   ├── data/           # Mock data
│   │   ├── layouts/        # Page layouts
│   │   └── pages/          # Route pages
│   ├── styles/             # Global CSS & theme
│   ├── supabase.ts         # Supabase client
│   └── main.tsx            # App entry point
├── .env                    # Environment variables
├── index.html
└── vite.config.ts
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero section, features, and CTA |
| `/login` | Login | User authentication page |
| `/workspaces` | WorkspaceListing | Browse and filter workspaces |
| `/workspace/:id` | WorkspaceDetails | Individual workspace details |
| `/booking/:id` | Booking | Complete a booking with pricing |
| `/dashboard` | UserDashboard | View and manage your bookings |
| `/admin` | AdminDashboard | Admin stats and workspace management |

---

## Database Schema

The app uses Supabase (PostgreSQL) with the following tables:

- `users` — registered users with role (user / admin)
- `workspaces` — available coworking spaces
- `workspace_images` — multiple images per workspace
- `amenities` — amenity lookup table (WiFi, parking, etc.)
- `workspace_amenities` — junction table linking workspaces to amenities
- `bookings` — booking records with pricing breakdown

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase account (free at [supabase.com](https://supabase.com))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

3. Run the database schema in Supabase SQL Editor (see `coworkhub_schema.sql`)

4. Start the development server:
```bash
npm run dev
```

5. Open `http://localhost:5173` in your browser

---

## Features

### User Features
- Browse and search coworking spaces
- Filter by type: desk, meeting room, private office, coworking
- View workspace details, images, amenities, and ratings
- Book a workspace with date, time slot, and seat selection
- Automatic pricing calculation with 10% service fee
- User dashboard to view upcoming and past bookings
- Cancel bookings

### Admin Features
- Admin dashboard with booking statistics
- Revenue overview and occupancy metrics
- Manage workspace listings

### Booking Time Slots
| Slot | Hours | Rate |
|------|-------|------|
| Morning | 9:00 AM – 1:00 PM | 50% of daily rate |
| Afternoon | 1:00 PM – 5:00 PM | 50% of daily rate |
| Full Day | 9:00 AM – 5:00 PM | 100% of daily rate |
| Extended | 9:00 AM – 9:00 PM | 150% of daily rate |
