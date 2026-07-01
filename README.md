# CoWorkHub
A modern coworking space booking web application

---

## Overview
CoWorkHub allows users to discover, explore, and book coworking spaces. It features workspace browsing with filters and a real-world location autocomplete search, detailed workspace pages, a full booking flow with pricing calculation, a user dashboard to manage bookings, and an admin dashboard backed by live Supabase statistics for managing workspaces, bookings, and users.

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
│   │   ├── components/          # Reusable UI components
│   │   │   ├── AddWorkspaceDialog.tsx  # Admin "create workspace" form dialog
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ui/               # shadcn/ui + Radix primitives
│   │   ├── pages/               # Route pages
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── hooks/
│   │   ├── useAdminData.ts      # Admin stats/bookings/users + workspace creation
│   │   ├── useAuth.tsx          # Auth context & helpers
│   │   ├── useBookings.ts       # Booking CRUD
│   │   ├── useLocationSuggestions.ts  # Debounced location autocomplete (Photon API)
│   │   └── useWorkspaces.ts     # Workspace queries
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── database.types.ts   # TypeScript types
│   ├── styles/                  # Global CSS & theme
│   └── main.tsx                 # App entry point
├── supabase/
│   └── schema.sql               # Database schema + seed data (canonical, kept in sync with migrations)
├── .env                         # Environment variables (not committed)
├── .env.example                 # Example env file
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
| `profiles` | Extends auth.users — stores name, email, avatar, role (`user` / `admin`) |
| `workspaces` | Coworking spaces — publicly readable, admin-writable |
| `bookings` | Per-user bookings joined to workspaces (supports multi-day date ranges via `date`/`end_date`) — RLS enforced |

Row Level Security is enabled on all tables. Admin access is granted through a `public.is_admin()` `SECURITY DEFINER` helper function (checked in the `admin read all profiles`, `admin read all bookings`, and `admin manage workspaces` policies) rather than inline subqueries, which avoids infinite-recursion errors that occur when a policy on `profiles` queries `profiles` from within itself. A `prevent_role_escalation` trigger blocks users from granting themselves the `admin` role through the app — role changes must be made by an existing admin.

`supabase/schema.sql` is the canonical, up-to-date schema; the `migration_*.sql` files in the same folder are the incremental migrations that produced it and are kept for history.

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
- Homepage hero search with real-world location autocomplete (powered by the free [Photon](https://photon.komoot.io) geocoding API) — pick a suggestion or search freeform, and results are filtered on `/workspaces`
- Filter by type: desk, meeting room, private office, coworking
- View workspace details, images, amenities, and ratings
- Book a workspace with date range (multi-day), time slot, and seat selection
- Pricing calculation with service fee
- User dashboard to view upcoming and past bookings
- Cancel bookings

### Admin Features
- Admin dashboard driven by live data: total bookings, revenue, active users, and workspace counts (with month-over-month deltas), booking trend, and workspace-type breakdown
- Bookings tab with All / Upcoming / Completed filters
- Users tab listing real user records (avatar, name, email, role, booking count, join date)
- "Add Workspace" dialog to create a new listing (name, location, description, price/day, capacity, type, image, amenities, availability) directly from the dashboard
- Manage workspace listings
- Promote users to admin via Supabase Table Editor or SQL Editor (`profiles` → set `role` to `admin`)

---

## Environment Variables
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

