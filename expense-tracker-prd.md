# Family Expense Tracker — Product Requirements Document (PRD)

**Document Version:** 1.0
**Author:** Product/Engineering Owner (Solo Developer)
**Status:** Draft for Build
**Last Updated:** June 19, 2026

---

## 1. Product Overview

A simple, web-based expense tracker designed to replace a paper notebook for daily household expense tracking. The primary user is a non-technical family member (the developer's mother) who currently logs expenses by hand and manually separates **cash** spending from **online/bank** spending, totaling everything at month-end.

The app digitizes this exact workflow — no more, no less — with a clean, large-button, mobile-friendly interface. It allows the user to log expenses by date and payment type, view a date range, see automatic totals, and export a polished PDF report that looks like (and replaces) the monthly notebook summary.

**Design philosophy:** *Notebook-simple, app-powered.* Every feature must justify its existence against the question: "Would my mother understand this in 10 seconds without help?"

---

## 2. Problem Statement

| Current State (Notebook) | Pain Point | Desired Outcome |
|---|---|---|
| Expenses written by hand daily | Tedious, error-prone, no backup | Quick digital entry, always saved |
| Cash and online tracked in separate mental/paper buckets | Easy to mix up or forget which was which | One tap to tag payment type |
| Month-end totals calculated manually with a calculator | Time-consuming, arithmetic mistakes | Instant, automatic totals |
| No category-level insight | Can't easily see "how much on groceries this month" | Optional category breakdown |
| No shareable record | Hard to show family members or keep archives | One-click PDF export, shareable/printable |
| Notebook can be lost, damaged, or illegible | Data loss risk | Cloud-stored, backed-up data |

**Core problem:** There is no tool simple enough for a non-technical, possibly older user to replace a paper notebook — most expense apps are too complex, cluttered with budgeting features, bank-linking, or finance jargon that creates friction instead of removing it.

---

## 3. Target Users

### Primary User: "Amma" Persona
- Non-technical, possibly first-time app user
- Comfortable with basic smartphone actions (calls, WhatsApp, photos)
- Wants minimal taps, large text, no jargon
- Will use the app daily, briefly (under 30 seconds per entry)
- Needs the app to **never feel intimidating**

### Secondary User: Family Admin (the developer)
- Sets up the account
- May occasionally review reports or help troubleshoot
- Technically capable — does not need a simplified experience

### MVP User Model
A **single shared family account** (one login) is sufficient. No multi-user roles, approvals, or permissions needed at MVP stage.

---

## 4. Core User Journey

```
1. Open app (saved as home-screen icon / bookmark)
       ↓
2. Log in (stays logged in — rarely re-prompted)
       ↓
3. Land on "Add Expense" as the default home screen
       ↓
4. Tap "+ Add Expense"
       ↓
5. Fill: Date (defaults to today) → Amount → Category (pick icon) → Payment Type (Cash/Online toggle) → Note (optional)
       ↓
6. Tap "Save" → confirmation → returns to list view
       ↓
7. (End of month) Go to "Reports" tab
       ↓
8. Select date range (or tap "This Month" shortcut)
       ↓
9. View totals: Cash total, Online total, Grand total, category breakdown
       ↓
10. Tap "Download PDF" → clean report saved/shared
```

### User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-1 | Family user | add an expense in under 5 taps | logging doesn't feel like a chore |
| US-2 | Family user | mark each expense as cash or online | I know where my money went |
| US-3 | Family user | see today's and this month's spending at a glance | I don't have to calculate manually |
| US-4 | Family user | edit or delete a mistaken entry | my records stay accurate |
| US-5 | Family user | pick a date range and see all expenses in it | I can review any period, not just "this month" |
| US-6 | Family user | download a PDF of my report | I have a record like my old notebook, but better |
| US-7 | Family admin | set up login once and have it remembered | my mother doesn't need to log in repeatedly |
| US-8 | Family user | use the app comfortably on my phone | I log expenses right after spending, on the go |
| US-9 | Family user | see a breakdown by category (optional) | I understand where most money goes |

---

## 5. Feature List

| Feature | Priority | Notes |
|---|---|---|
| Add expense (date, amount, category, note, payment type) | Must-have | Core feature |
| Edit / delete expense | Must-have | Core feature |
| View expense list (default: current month) | Must-have | |
| Date-range selection & filtering | Must-have | |
| Auto-calculated totals (cash / online / overall) | Must-have | Core value-add over notebook |
| Category breakdown | Should-have | Easy add-on, high value |
| PDF export of report | Must-have | Explicit requirement |
| Login/signup (single family account) | Must-have | |
| Mobile-responsive UI | Must-have | Primary usage is mobile |
| Large-button, minimal-step UI | Must-have | Core UX requirement |
| Search/filter by category | Nice-to-have | v2 |
| Multiple family member accounts | Nice-to-have | v2/v3 |
| Recurring expenses | Nice-to-have | v3 |
| Charts/graphs | Nice-to-have | v2/v3 |
| Budget limits & alerts | Nice-to-have | v3 |
| Multi-currency | Out of scope | Not needed for family use case |
| Bank account linking | Out of scope | Adds complexity, security burden, not requested |

---

## 6. MVP Scope

The MVP must let the user **fully replace the notebook** — nothing more.

### In Scope for MVP
- Login/signup (single shared account, email + password)
- Add / edit / delete expense (date, amount, category, payment type, note)
- View expense list, default sorted by date (newest first)
- Date range filter
- Auto totals: cash total, online total, grand total
- PDF export of the selected range (transaction list + totals)
- Mobile-responsive, large-button UI

### Explicitly Out of Scope for MVP
- Category-wise charts/graphs (table breakdown is enough)
- Multiple users/roles
- Budgets, alerts, reminders
- Recurring/auto-expenses
- Offline mode
- Dark mode
- Multi-currency

**MVP success = "Can my mother log an expense and download a month's PDF report without my help?"** If yes, MVP is done.

---

## 7. Future Enhancements

### Version 2 — "Improved Version"
- Category breakdown with simple bar/pie chart (visual, not just table)
- Search and filter by category or payment type
- Edit categories (add custom categories beyond defaults)
- Quick-add shortcuts (e.g., "repeat last expense")
- Monthly auto-summary email or in-app reminder ("You haven't logged anything in 3 days")
- Basic data export to Excel/CSV (in addition to PDF)
- Improved date-picker UX (calendar view with daily totals)

### Version 3 — "Polished Version"
- Multiple family members under one family account (e.g., son adds entries on mother's behalf, tagged by user)
- Budget setting per category with visual progress indicators
- Recurring expense templates (e.g., rent, electricity bill)
- Insights ("You spent 20% more on groceries this month")
- Push notifications / WhatsApp reminders
- Voice-to-text expense entry (accessibility for elderly users)
- Dark mode and accessibility (font-size control, high-contrast mode)
- Multi-currency support (if family is geographically distributed)
- Native mobile app (PWA → React Native, if needed)

---

## 8. Technical Architecture

### High-Level Architecture

```
┌─────────────────────┐         ┌──────────────────────┐        ┌─────────────────┐
│   Frontend (React)   │  HTTPS  │   Backend (Node.js +  │  ODM   │    MongoDB       │
│   Hosted on Netlify   │ ──────▶ │   Express REST API)   │ ─────▶ │   (Atlas Cloud)  │
│                       │ ◀────── │   Hosted on Render/   │ ◀───── │                  │
│                       │  JSON   │   Railway/Fly.io      │        │                  │
└─────────────────────┘         └──────────────────────┘        └─────────────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │ PDF Generation     │
                                 │ (pdfkit / puppeteer)│
                                 └──────────────────┘
```

### Stack Decisions

| Layer | Technology | Reasoning |
|---|---|---|
| Frontend | React (Vite) — plain React, Next.js not required | Netlify-friendly, simpler than Next.js for this scope, no SSR needed |
| Styling | Tailwind CSS | Fast to build clean, consistent, large-button UI |
| Backend | Node.js + Express | Matches existing skill set |
| Database | MongoDB (Atlas free/shared tier) | Matches existing skill set, flexible schema |
| Auth | JWT-based session (stored in httpOnly cookie or localStorage) | Simple, no third-party dependency needed for one account |
| PDF Generation | `pdfkit` (lightweight, server-side, no headless browser) | Simple, fast, no Puppeteer overhead — good fit for "simple" goal |
| Frontend Hosting | Netlify | As specified |
| Backend Hosting | Render or Railway (free/low-cost tier) | Easiest Node.js deploy outside Netlify, minimal DevOps |
| Backend ↔ Frontend | REST API over HTTPS, JSON | Simple, well-understood, easy to debug |

> **Why not Next.js?** Since there's no SEO need, no server rendering requirement, and the frontend is static-hosted on Netlify separately from the API, plain React (Vite) keeps the build simpler and avoids Next.js-specific deployment quirks on Netlify. If you later want a unified deploy (frontend + API as serverless functions), Next.js on Netlify becomes worth revisiting — but it's unnecessary complexity for MVP.

> **Why not Puppeteer for PDFs?** Puppeteer is heavier (spins up Chromium), slower, and harder to deploy on small/free hosting tiers. `pdfkit` generates clean PDFs programmatically and fits the "simple" mandate. If highly styled/branded PDFs are needed later, revisit with `puppeteer` or `react-pdf`.

---

## 9. Database Schema Idea (MongoDB)

### Collections Overview

```
users
  └── (1-to-many) expenses
```

### `users` Collection

```javascript
{
  _id: ObjectId,
  name: String,             // "Amma's Family Account"
  email: String,            // unique, used for login
  passwordHash: String,     // bcrypt hash
  createdAt: Date,
  updatedAt: Date
}
```

### `expenses` Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,         // references users._id
  date: Date,                // expense date (not creation date)
  amount: Number,             // positive number, in base currency unit
  category: String,           // e.g., "Groceries", "Transport", "Medical", "Other"
  paymentType: String,        // enum: "cash" | "online"
  note: String,                // optional, free text
  createdAt: Date,
  updatedAt: Date
}
```

### Suggested Default Categories (seed data, editable later)
`Groceries`, `Transport`, `Medical`, `Utilities`, `Household`, `Personal`, `Education`, `Other`

### Indexes
- `expenses`: compound index on `{ userId: 1, date: -1 }` for fast date-range queries per user
- `users`: unique index on `email`

### Why this schema is "simple enough"
- Only two collections
- No nested arrays, no complex relations
- Flat, predictable structure — easy to query for date ranges and sum totals using MongoDB aggregation (`$match` + `$group`)

---

## 10. API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/signup` | Create the family account (one-time setup) | No |
| POST | `/api/auth/login` | Log in, returns JWT | No |
| POST | `/api/auth/logout` | Clear session/token | Yes |
| GET | `/api/auth/me` | Get current logged-in user info | Yes |

### Expenses

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/expenses` | Create a new expense | Yes |
| GET | `/api/expenses` | List expenses (supports `?startDate=&endDate=&category=&paymentType=`) | Yes |
| GET | `/api/expenses/:id` | Get a single expense | Yes |
| PUT | `/api/expenses/:id` | Update an expense | Yes |
| DELETE | `/api/expenses/:id` | Delete an expense | Yes |

### Reports

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/reports/summary?startDate=&endDate=` | Returns totals: cash, online, overall, and category breakdown | Yes |
| GET | `/api/reports/pdf?startDate=&endDate=` | Generates and streams a downloadable PDF report | Yes |

### Sample Response — `GET /api/reports/summary`

```json
{
  "startDate": "2026-06-01",
  "endDate": "2026-06-30",
  "totalCash": 8200,
  "totalOnline": 14500,
  "totalOverall": 22700,
  "categoryBreakdown": [
    { "category": "Groceries", "total": 9000 },
    { "category": "Transport", "total": 3200 },
    { "category": "Medical", "total": 5000 },
    { "category": "Other", "total": 5500 }
  ],
  "transactionCount": 34
}
```

---

## 11. UI/UX Requirements

### Guiding Principles
1. **One primary action per screen.** Never make the user choose between many things at once.
2. **Big, obvious buttons.** Minimum 48px tap targets, high color contrast.
3. **Minimal text entry.** Use pickers, toggles, and dropdowns over free typing wherever possible.
4. **No jargon.** "Cash" and "Online" — not "Payment Method Type." "Add Expense" — not "Create Transaction Record."
5. **Always show what happened.** Clear confirmation after every save/edit/delete ("Expense added ✓").
6. **Forgiving, not punishing.** Easy undo/edit; no harsh error messages.

### Key Screens

| Screen | Key Elements |
|---|---|
| **Login** | Email + password fields, large "Log In" button, app name/logo, nothing else |
| **Home / Add Expense** (default landing screen) | Big "+ Add Expense" button front and center; below it, a simple list of today's/recent entries |
| **Add/Edit Expense Form** | Date (defaults to today, calendar picker), Amount (numeric keypad), Category (icon grid, single tap), Payment Type (large Cash/Online toggle switch), Note (optional, collapsed by default), Save button |
| **Expense List** | Chronological list, grouped by date, each row shows category icon, amount, payment type badge (color-coded: green=cash, blue=online); tap to edit, swipe or icon to delete |
| **Reports** | Date range picker (with quick shortcuts: "This Month," "Last Month," "This Week"), totals shown as 3 large cards (Cash / Online / Total), optional category breakdown table, "Download PDF" button |

### Mobile-First Requirements
- Designed first for mobile screen sizes (360–420px width), scaled up for desktop
- Bottom navigation bar (not hamburger menu) with 3 tabs max: **Add**, **List**, **Reports**
- Numeric keypad auto-triggered for amount field
- No multi-step wizards — the add-expense form is a single screen

### Accessibility Considerations (important for older users)
- Font size minimum 16px body text, 18–20px for primary actions
- High color contrast (WCAG AA minimum)
- Avoid relying on color alone — pair Cash/Online badges with text labels and icons
- Avoid auto-timeouts/session expiry that force frequent re-login

---

## 12. PDF Export Requirements

### Content Structure

```
┌─────────────────────────────────────────────┐
│  [App Name] — Expense Report                  │
│  Date Range: June 1, 2026 – June 30, 2026      │
│  Generated on: June 19, 2026                    │
├─────────────────────────────────────────────┤
│  SUMMARY                                        │
│  Total Cash Spent:      ₹8,200                   │
│  Total Online Spent:    ₹14,500                  │
│  Grand Total:           ₹22,700                  │
├─────────────────────────────────────────────┤
│  CATEGORY BREAKDOWN (optional section)          │
│  Groceries    ₹9,000                             │
│  Transport    ₹3,200                              │
│  Medical      ₹5,000                               │
│  Other        ₹5,500                                │
├─────────────────────────────────────────────┤
│  TRANSACTION LIST                                │
│  Date       Category     Amount   Type   Note    │
│  06/01/26   Groceries    ₹500     Cash   Milk...  │
│  06/02/26   Transport    ₹150     Online Uber     │
│  ...                                              │
└─────────────────────────────────────────────┘
```

### Requirements
- **Format:** A4, portrait, printable
- **Header:** App name, selected date range, generation timestamp
- **Summary block:** Totals prominently displayed at the top (cash/online/overall), large and bold
- **Transaction table:** Date, category, amount, payment type, note — sorted chronologically
- **Pagination:** Auto-paginate for long lists with repeated table headers on each page
- **Currency formatting:** Locale-appropriate (₹ for INR, with thousands separators)
- **File naming:** `expense-report_2026-06-01_to_2026-06-30.pdf`
- **Generation:** Server-side using `pdfkit`, triggered by `/api/reports/pdf`, streamed directly as a file download (no intermediate storage needed for MVP)

---

## 13. Security Requirements

Kept intentionally lightweight given the single-family-account, low-risk-profile nature of the app — but still following baseline good practice.

| Requirement | Implementation |
|---|---|
| Password storage | Hash with `bcrypt` (never store plaintext) |
| Session/auth | JWT signed with a strong secret, reasonable expiry (e.g., 30 days), refresh on activity |
| Transport security | HTTPS enforced on both frontend (Netlify default) and backend host |
| Input validation | Server-side validation on all fields (amount must be positive number, date must be valid, category from allowed list, etc.) using a library like `express-validator` or `zod` |
| Authorization | All `/api/expenses/*` and `/api/reports/*` routes require valid JWT; data is always scoped to `userId` |
| Rate limiting | Basic rate limiting on `/api/auth/login` to prevent brute force (e.g., `express-rate-limit`) |
| Environment secrets | DB connection string, JWT secret stored in environment variables, never committed to source control |
| CORS | Restrict backend CORS to the Netlify frontend domain only |
| Data backup | MongoDB Atlas automated backups (available even on free/shared tiers in limited form; consider periodic manual export as a fallback) |

**Out of scope for MVP:** Two-factor authentication, OAuth/social login, role-based permissions, audit logs — all unnecessary for a single trusted family account.

---

## 14. Development Phases

| Phase | Focus | Outcome |
|---|---|---|
| **Phase 0: Setup** | Repo setup, MongoDB Atlas cluster, backend skeleton (Express + Mongoose), frontend skeleton (Vite + React + Tailwind), deploy pipelines (Netlify + Render) | Empty but deployed "Hello World" app on both ends |
| **Phase 1: Auth** | Signup/login API, JWT middleware, login UI | User can create the family account and log in |
| **Phase 2: Core Expense CRUD** | Add/edit/delete/list expense API + UI | User can fully manage expense entries |
| **Phase 3: Reports & Totals** | Date-range filtering, summary aggregation API, Reports screen UI | User can view totals for any date range |
| **Phase 4: PDF Export** | `pdfkit` integration, PDF endpoint, download button in UI | User can download a polished report |
| **Phase 5: UX Polish** | Mobile responsiveness pass, large-button styling, empty states, confirmations, error handling | App feels notebook-simple and friendly |
| **Phase 6: MVP Launch** | Final QA, real-world test with actual user (mother), bug fixes | MVP live and usable daily |
| **Phase 7+: V2/V3** | Category charts, multi-user, budgets, recurring expenses, etc. (see Section 7) | Improved & polished versions |

---

## 15. Success Metrics

Since this is a personal/family tool rather than a commercial product, success is measured by **adoption and trust**, not growth metrics.

| Metric | Target |
|---|---|
| Daily/regular usage by primary user | Logs expenses at least 5–6 days/week without reminders |
| Time to log one expense | Under 20 seconds |
| Support requests ("how do I...") after week 1 | Near zero — UI should be self-explanatory |
| Month-end report accuracy | Matches manual calculation 100% (validates totals logic) |
| Notebook usage | Fully discontinued within first month of app use |
| PDF report usability | Can be understood by a family member with zero app context |

---

## 16. Risks and Simplifications

| Risk | Mitigation |
|---|---|
| Over-engineering (adding budgets, charts, multi-user too early) | Strictly defer everything in Section 7 until MVP is validated by real daily use |
| User abandons app if first experience is confusing | Test MVP directly with the mother before considering it "done"; prioritize Phase 5 (UX polish) — don't skip it |
| Forgotten password locks user out (single account, no recovery flow planned) | Add a simple "forgot password" email reset flow even in MVP, OR keep credentials with the family admin as a fallback |
| Backend hosting downtime (free tiers can sleep/spin down) | Choose a host with acceptable cold-start behavior (Render free tier sleeps after inactivity — acceptable for low-frequency personal use, but document this tradeoff; upgrade to a paid tier if responsiveness becomes an issue) |
| Data loss (single point of failure) | Rely on MongoDB Atlas backups; consider a simple periodic export-to-CSV as a manual safety net |
| Currency/locale assumptions hardcoded | Keep currency symbol/locale in a single config constant for easy future change |
| Scope creep from "nice to have" requests during build | Refer back to Section 6 (MVP Scope) as the single source of truth during development |

---

## 17. Final Recommended Build Plan

### Step-by-Step Order (Solo Developer, Cursor-Friendly)

1. **Backend skeleton:** Express app, MongoDB connection (Mongoose), `.env` config, folder structure (see below)
2. **User model + auth routes:** Signup, login, JWT middleware
3. **Expense model + CRUD routes:** Create, read (with filters), update, delete
4. **Reports route:** Aggregation pipeline for totals + category breakdown
5. **PDF route:** `pdfkit` report generation, tested with sample data
6. **Frontend skeleton:** Vite + React + Tailwind, routing (`react-router-dom`), API client (`axios` or `fetch` wrapper)
7. **Login/Signup UI**
8. **Add Expense UI** (the single most-used screen — polish this first)
9. **Expense List UI** with edit/delete
10. **Reports UI** with date range picker and totals display
11. **PDF download button** wired to backend endpoint
12. **Mobile responsiveness + UX polish pass**
13. **Deploy:** Backend to Render/Railway, frontend to Netlify, connect via environment variable (`VITE_API_URL`)
14. **Real-world test:** Hand the app to the actual target user, observe, fix friction points
15. **Iterate toward V2/V3** only after MVP is in daily, confident use

---

## Appendix A: Suggested Backend Folder Structure

```
expense-tracker-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── models/
│   │   ├── User.js
│   │   └── Expense.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   └── reportController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── reportRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorHandler.js
│   │   └── validate.js           # input validation
│   ├── services/
│   │   └── pdfService.js         # pdfkit report generation logic
│   ├── utils/
│   │   └── dateHelpers.js
│   └── app.js                    # Express app setup
├── server.js                     # entry point
├── .env                          # secrets (not committed)
├── .env.example
├── package.json
└── README.md
```

## Appendix B: Suggested Frontend Folder Structure

```
expense-tracker-frontend/
├── src/
│   ├── api/
│   │   └── client.js              # axios/fetch wrapper with auth header
│   ├── components/
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── ExpenseListItem.jsx
│   │   ├── DateRangePicker.jsx
│   │   ├── SummaryCards.jsx
│   │   └── BottomNav.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── HomePage.jsx           # Add Expense + recent list
│   │   ├── ExpenseListPage.jsx
│   │   └── ReportsPage.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                  # Tailwind entry
├── public/
├── .env
├── netlify.toml
├── package.json
└── README.md
```

---

## Quick-Reference: MVP Definition of Done

- [ ] User can sign up / log in once and stay logged in
- [ ] User can add an expense in under 20 seconds
- [ ] User can edit and delete any expense
- [ ] User can select a date range and see all matching expenses
- [ ] App shows correct cash / online / total sums automatically
- [ ] User can download a clean, readable PDF report for any date range
- [ ] App is fully usable on a mobile phone with large, clear buttons
- [ ] A non-technical test user (the actual target user) can use it without instructions

---

*End of PRD — ready to use as a build reference in Cursor or any IDE.*
