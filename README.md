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
| Authentication | Supabase Auth |
| Icons | Lucide React |
| Notifications | Sonner |

---

## Project Structure
```
CoWorkHub/
├── src/
│   ├── app/
│   │   ├── components/         # Reusable UI components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/              # Route pages
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx         # Auth context & helpers
│   │   ├── useBookings.ts      # Booking CRUD
│   │   └── useWorkspaces.ts    # Workspace queries
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   └── database.types.ts  # TypeScript types
│   ├── styles/                 # Global CSS & theme
│   └── main.tsx                # App entry point
├── supabase/
│   └── schema.sql              # Database schema + seed data
├── .env                        # Environment variables (not committed)
├── .env.example                # Example env file
├── index.html
└── vite.config.ts
```

---

## Pages & Routes
| Route | Page | Access |
|-------|------|--------|
| `/` | Landing | Public |
| `/login` | Login / Register | Public |
| `/workspaces` | WorkspaceListing | Public |
| `/workspace/:id` | WorkspaceDetails | Public |
| `/booking/:id` | Booking | Logged in |
| `/dashboard` | UserDashboard | Logged in |
| `/admin` | AdminDashboard | Admin only |

---

## Database Schema (Supabase)
| Table | Description |
|-------|-------------|
| `profiles` | Extends auth.users — stores name, avatar, role (`user` / `admin`) |
| `workspaces` | Coworking spaces — publicly readable, admin-writable |
| `bookings` | Per-user bookings joined to workspaces — RLS enforced |

Row Level Security is enabled on all tables.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A Supabase account (free at [supabase.com](https://supabase.com))

### Installation

1. Clone the repo and install dependencies:
```bash
cd CoWorkHub
npm install
```

2. Create a `.env` file inside `CoWorkHub/`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the database schema in Supabase SQL Editor:
   - Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
   - Paste the contents of `supabase/schema.sql` and click **Run**

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
- Pricing calculation with service fee
- User dashboard to view upcoming and past bookings
- Cancel bookings

### Admin Features
- Admin dashboard with booking statistics
- Revenue overview and occupancy metrics
- Manage workspace listings
- Promote users to admin via Supabase Table Editor (`profiles` → set `role` to `admin`)

---

## Environment Variables
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

