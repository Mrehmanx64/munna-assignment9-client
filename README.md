# Rentora — Industrial Equipment Rental Marketplace

Rentora is a premium, art-directed industrial equipment rental marketplace built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and **shadcn/ui**.

It seamlessly connects verified heavy machinery & technical equipment owners with contractors, cinematographers, agricultural operators, and industrial enterprises.

---

## 🏗️ Design Direction: Industrial Editorial Marketplace

The visual design is inspired by high-end architectural monographs, contemporary heavy machinery publications, and precision product marketplaces.

### Centralized Design Tokens
- **Primary (Forest Green)**: `#183C32` — Authority, durability, industrial precision
- **Primary Hover**: `#245344` — Subtle tactile feedback
- **Accent (Warm Amber)**: `#D99A42` — Industrial caution, high-visibility actions
- **Background (Warm Ivory)**: `#F7F6F1` — Calibrated editorial foundation
- **Surface**: `#FFFFFF` — High-contrast component containers
- **Main Text**: `#202824` — Deep charcoal readability
- **Secondary Text**: `#777D77` — Slate technical metadata
- **Borders & Dividers**: `#E7E7DF` — Subtle architectural framing
- **Dark Forest (Dashboard Shell)**: `#11231D` — Mission-control navigation depth

### Typography
- **Headings**: Manrope (editorial bold titles, confident serif-like structure without clunky ornamentation)
- **Body & Specs**: Inter (high-legibility technical specs, telemetry labels, and data grids)

---

## ⚡ Role-Based Architecture & Live Persona Switcher

Rentora features an integrated **Interactive Persona Switcher** embedded directly in the top navigation bar and mobile drawer. You can switch between roles in real-time with zero friction:

1. **Customer (`Alexander Hayes`)**:
   - Browse, search, and filter catalog with live parameters.
   - Save machinery to Favorites with persistent state.
   - Book equipment with automatic escrow calculation (duration × daily/weekly/hourly rate + damage waiver + mobilization).
   - View mobilization slips, rental history, and booking status in `/dashboard/customer`.
   - Edit contractor profile, dispatch addresses, and certifications in `/dashboard/customer/profile`.

2. **Fleet Owner (`Marcus Vance`)**:
   - High-yield telemetry dashboard with Recharts financial performance charts in `/dashboard/owner`.
   - Review incoming rental requests, approve or complete bookings in `/dashboard/owner/rentals`.
   - List new heavy machinery with multi-tier specs, live image preview, and terms in `/dashboard/owner/add`.
   - Manage fleet listing status (Active/Maintenance/Draft) and inventory in `/dashboard/owner/equipment`.

3. **Platform Administrator (`Elena Rostova`)**:
   - Master platform console with GMV area charts and category distribution donut charts in `/dashboard/admin`.
   - Manage user roles (Customer, Owner, Admin) and account status in `/dashboard/admin/users`.
   - Quality control & safety inspection approvals for pending machinery in `/dashboard/admin/equipment`.
   - Master escrow ledger & dispute resolution across all platform rentals in `/dashboard/admin/rentals`.

4. **Guest (Unauthenticated)**:
   - Full public browsing of catalog, categories, specifications, and owner reviews.
   - Prompts for sign-in upon attempting high-intent booking or favoriting actions.
   - Quick-login presets on `/login` and `/register` for 1-click test drive of any persona.

---

## 🗺️ Route Map & Implemented Pages

### Public Website
- `/` — Editorial Homepage (Hero with instant search, 6 Featured listings, 6 Category cards, Why Choose Us editorial layout, 3-step How It Works, Verified Reviews, Certified Fleet Owners, Owner Monetization CTA, Industrial Footer with X branding).
- `/equipment` — Advanced Equipment Catalog (3-column responsive layout, multi-parameter keyword & location filter, category facets, price slider, rental type toggles, availability filters, sort orders, and active filter tags).
- `/equipment/[id]` — Dynamic Equipment Detail Page (Interactive multi-angle photo gallery with modal view, full technical specifications grid, verified owner trust badge, contractual terms, related equipment, and functional Escrow Booking Modal).
- `/login` — Editorial Authentication (Standard credentials, Google Sign-In, password visibility toggle).
- `/register` — Account Registration (Role selector, live avatar preview, full validation feedback).

### Customer Hub
- `/dashboard/customer` — Active, pending, and completed leases with printable mobilization slips.
- `/dashboard/customer/favorites` — Saved machinery with immediate booking dispatch.
- `/dashboard/customer/profile` — Contractor information, company details, and verified credentials.

### Owner Command Center
- `/dashboard/owner` — Fleet analytics with monthly earnings area chart and dispatch volume chart.
- `/dashboard/owner/rentals` — Incoming lease requests with accept/reject/mark completed actions.
- `/dashboard/owner/add` — Comprehensive listing creation form with real-time preview.
- `/dashboard/owner/equipment` — Fleet inventory management with status toggles and listing removals.
- `/dashboard/owner/profile` — Fleet owner profile and dispatch depot settings.

### Master Administration Console
- `/dashboard/admin` — Platform-wide metrics, GMV trend lines, and category donut distribution.
- `/dashboard/admin/users` — User directory with search, filtering, and role switching.
- `/dashboard/admin/equipment` — Safety review queue with one-click approve/reject actions.
- `/dashboard/admin/rentals` — Global escrow ledger tracking all active customer-owner bookings.
- `/dashboard/admin/profile` — Platform officer credentials.

---

## 💻 Tech Stack & Packages

- **Framework**: Next.js 16.0.7 (App Router, Webpack builder)
- **Runtime**: React 19, TypeScript (strict mode)
- **Data Fetching & State**: `@tanstack/react-query` v5 with centralized Axios client (`src/lib/api.ts`)
- **Styling**: Tailwind CSS v4, tw-animate-css, shadcn/ui components
- **Motion**: Framer Motion (subtle scroll reveals with `prefers-reduced-motion` compliance)
- **Data Visualization**: Recharts (ResponsiveContainer, AreaChart, BarChart, PieChart)
- **Icons**: Lucide React + custom inline brand SVGs
- **Notifications**: Sonner toast system
- **State Management**: React Context (`AppContext.tsx`) with live backend authentication persistence, local storage fallback, and active persona switcher

---

## 🔐 Role Access & Authentication Model

Rentora implements strict role-based access control across three user tiers:

- **Customer / Renter**: Default role assigned upon registration. Access to equipment booking, persistent favorites, rental agreements, and mobilization tracking.
- **Fleet Owner**: Access to machinery listing (with ImgBB uploads), fleet inventory dispatch, rental approval, and fleet revenue analytics.
- **Platform Administrator**: Access to machinery safety approvals/rejections, global escrow ledger, user directory management, and platform-wide analytics.

User roles are strictly verified and enforced by backend JWT signatures and database authorization checks. Predictable demo credentials and automated account creation are disabled. All accounts authenticate against authoritative database records.

### 🛡️ XSS Defense & Zero-localStorage JWT Architecture
To protect against token exfiltration via Cross-Site Scripting (XSS), Rentora **never stores JWT tokens in `localStorage` or `sessionStorage`**:
1. **Persistent Session Hydration**: Persistent authentication is maintained exclusively via secure `HttpOnly` cookies (`accessToken`) set by the backend upon login/registration.
2. **In-Memory Non-Persistent State**: An in-memory access token (`inMemoryAccessToken`) is kept in active JavaScript memory for the life of the page turn only.
3. **Session Hydration on Reload**: When the page reloads, Axios automatically dispatches `GET /api/auth/me` with `withCredentials: true`. The browser securely provides the `HttpOnly` cookie to restore authenticated user state.
4. **Secure Logout**: Calling `logout()` notifies the backend to clear the `HttpOnly` cookie via `res.clearCookie()` and immediately nullifies all in-memory references.

---

## ⚙️ Environment Variables

Create `.env.local` by copying `.env.example`:

```bash
cp .env.example .env.local
```

| Variable | Description | Example / Default |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Frontend origin URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend Express API base endpoint | `http://localhost:5000/api` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`| Google OAuth client ID for button | `your_google_client_id.apps.googleusercontent.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_placeholder_key` |

---

## 🚀 Running Locally

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript typecheck without emitting files
npx tsc --noEmit

# Run production build (verifies TypeScript, routing, and asset bundling)
npm run build

# Run linting (0 errors, 0 warnings)
npm run lint
```

---

## 🌐 Production Deployment (Vercel)

Rentora's Next.js frontend is production-ready for deployment on **Vercel**:

1. Import the Git repository in the Vercel dashboard.
2. Select the `client` folder as the **Root Directory**.
3. Framework preset: **Next.js**.
4. Configure the Environment Variables listed in the table above:
   - Point `NEXT_PUBLIC_API_URL` to your live backend (e.g. `https://rentora-api.onrender.com/api`).
   - Point `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL (e.g. `https://rentora-marketplace.vercel.app`).
5. Deploy with automated build and edge preview capabilities.
