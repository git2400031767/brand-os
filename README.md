# 🚀 Brand OS — Personal Brand Operating System

A full-stack creator dashboard to manage your content ideas, posting schedule, analytics, brand deals, and income — all in one place.

---

## 📦 Project Structure

```
brand-os/
├── backend/           # Express.js REST API
│   ├── src/
│   │   └── index.js   # All routes + in-memory data store
│   └── package.json
│
├── frontend/          # React SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Root app + sidebar navigation
│   │   ├── index.css       # Global dark theme styles
│   │   ├── pages/
│   │   │   ├── Dashboard.js   # Overview + stats
│   │   │   ├── Ideas.js       # Kanban board for content ideas
│   │   │   ├── Posts.js       # Content scheduling queue
│   │   │   ├── Analytics.js   # Follower growth + top content
│   │   │   ├── Deals.js       # Brand deals tracker
│   │   │   └── Income.js      # Revenue tracker + charts
│   │   ├── hooks/
│   │   │   └── useToast.js
│   │   └── utils/
│   │       └── api.js         # Fetch wrapper
│   └── package.json
│
├── start.sh           # One-command startup (Mac/Linux)
├── start.bat          # One-command startup (Windows)
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v16+ ([download](https://nodejs.org))

### Option A — One Command (Mac/Linux)
```bash
chmod +x start.sh && ./start.sh
```

### Option B — One Command (Windows)
```
start.bat
```

### Option C — Manual
**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

---

## 🌟 Features

| Module | What it does |
|--------|-------------|
| **Overview** | Dashboard with key stats: total followers, monthly income, active deals, scheduled posts |
| **Ideas Board** | Kanban board (Draft → In Progress → Ready) to capture and develop content ideas |
| **Content Queue** | Schedule posts across platforms, mark as published, track engagement |
| **Analytics** | Follower growth charts, platform breakdown, top-performing content |
| **Brand Deals** | Track sponsorships, affiliates, and partnerships with pipeline value |
| **Income Tracker** | Log revenue by source and category with donut + bar charts |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Recharts, Lucide Icons |
| Backend | Node.js, Express.js |
| Styling | Custom CSS (no UI framework) |
| Data | In-memory (swap for MongoDB/PostgreSQL easily) |

---

## 💾 Upgrading to a Real Database

The backend uses an in-memory `data` object for simplicity. To persist data:

1. Install mongoose: `npm install mongoose`
2. Create schemas in `backend/src/models/`
3. Replace the in-memory CRUD with mongoose operations
4. Add `MONGODB_URI` to a `.env` file

---

## 🎨 Design System

- **Font**: Syne (display) + DM Sans (body) via Google Fonts
- **Theme**: Dark (#0A0A0F base) with lime-yellow accent (#E8FF47)
- **Color palette**: Defined as CSS custom properties in `index.css`

---

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Summary stats |
| GET/POST | `/api/ideas` | Ideas CRUD |
| PUT/DELETE | `/api/ideas/:id` | Update/delete idea |
| GET/POST | `/api/posts` | Posts CRUD |
| PUT/DELETE | `/api/posts/:id` | Update/delete post |
| GET | `/api/analytics` | Analytics data |
| GET/POST | `/api/deals` | Deals CRUD |
| PUT/DELETE | `/api/deals/:id` | Update/delete deal |
| GET/POST | `/api/income` | Income CRUD |
| DELETE | `/api/income/:id` | Delete income entry |

---

Built with ❤️ using Brand OS
