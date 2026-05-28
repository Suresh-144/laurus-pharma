# Laurus Pharmaceuticals — Full-Stack Web Application

A complete, production-ready pharmaceutical web app built with **Node.js + Express** (backend) and **React** (frontend), using **MongoDB** as the database.

---

## 📁 Project Structure

```
laurus/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (bcrypt + JWT)
│   │   ├── Product.js       # Pharma product schema
│   │   └── Contact.js       # Contact form submissions
│   ├── routes/
│   │   ├── auth.js          # Register / Login / Me
│   │   ├── products.js      # CRUD (public read, admin write)
│   │   └── contact.js       # Contact form POST
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly guards
│   ├── server.js            # Express entry point
│   ├── seed.js              # DB seeder (admin + 8 products)
│   ├── .env.example         # Environment variable template
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html       # Fonts: Syne + Lora
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js  # Global auth state + authFetch
    │   ├── components/
    │   │   ├── Navbar.js/css   # Responsive nav with mobile menu
    │   │   ├── Footer.js/css
    │   │   └── ProductCard.js/css
    │   ├── pages/
    │   │   ├── Home.js/css     # Hero, stats, mission, pillars
    │   │   ├── Products.js/css # Catalogue + search + filter + pagination
    │   │   ├── Product.js      # Single product detail
    │   │   ├── Login.js        # JWT login form
    │   │   ├── Register.js     # Registration form
    │   │   ├── Admin.js/css    # Product CRUD table + modal form
    │   │   └── Contact.js/css  # Contact form with validation
    │   ├── App.js              # Router + Protected route wrapper
    │   ├── index.js
    │   └── index.css           # Design system (tokens, utilities, components)
    └── package.json
```

---

## ⚡ Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally (`mongod`) OR a free [MongoDB Atlas](https://cloud.mongodb.com) cluster
- **npm** ≥ 9

---

## 🚀 Running Locally

### 1. Clone / extract and install dependencies

```bash
# Backend
cd laurus/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd laurus/backend
cp .env.example .env
# Edit .env:
#   MONGODB_URI=mongodb://localhost:27017/laurus   (or your Atlas URI)
#   JWT_SECRET=any_long_random_string_here
```

### 3. Seed the database

```bash
cd laurus/backend
npm run seed
```

This creates:
- **Admin user** → `admin@laurus.com` / `admin123`
- **8 sample products** across categories

### 4. Start the backend

```bash
cd laurus/backend
npm run dev       # nodemon (auto-restart)
# or
npm start         # plain node
```

Backend runs at → **http://localhost:5000**

### 5. Start the frontend

```bash
cd laurus/frontend
npm start
```

Frontend runs at → **http://localhost:3000**  
(CRA proxy forwards `/api/*` to port 5000 automatically)

---

## 🔑 Demo Credentials

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@laurus.com     | admin123   |
| User  | *(register any)*     | ≥ 6 chars  |

---

## 🌐 API Reference

### Auth
| Method | Endpoint              | Auth      | Description           |
|--------|-----------------------|-----------|-----------------------|
| POST   | `/api/auth/register`  | Public    | Create user account   |
| POST   | `/api/auth/login`     | Public    | Get JWT token         |
| GET    | `/api/auth/me`        | Bearer    | Current user info     |

### Products
| Method | Endpoint              | Auth      | Description           |
|--------|-----------------------|-----------|-----------------------|
| GET    | `/api/products`       | Public    | List (search/filter)  |
| GET    | `/api/products/:id`   | Public    | Single product        |
| POST   | `/api/products`       | Admin     | Create product        |
| PUT    | `/api/products/:id`   | Admin     | Update product        |
| DELETE | `/api/products/:id`   | Admin     | Delete product        |

Query params for `GET /api/products`:  
`?search=amox&category=Antibiotics&page=2`

### Contact
| Method | Endpoint        | Auth   | Description         |
|--------|-----------------|--------|---------------------|
| POST   | `/api/contact`  | Public | Submit contact form |

---

## 🛡️ Security Highlights

- **Passwords** hashed with bcrypt (10 rounds)
- **JWT** tokens signed with secret, expire in 7 days
- **Rate limiting** on all API routes (100 req/15 min)
- **Input validation** via express-validator (backend) + inline checks (frontend)
- **Role-based access**: admin routes protected by `adminOnly` middleware
- CORS restricted to frontend origin

---

## ☁️ Free-Tier Deployment

| Service   | What to deploy       | Free tier            |
|-----------|----------------------|----------------------|
| Render    | Backend (Node.js)    | 750 hrs/month        |
| Vercel    | Frontend (React)     | Unlimited hobby      |
| Atlas     | MongoDB              | 512 MB cluster       |

**Steps:**
1. Push code to GitHub
2. Create MongoDB Atlas cluster → copy URI → set as env var
3. Deploy backend to Render (set `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`)
4. Deploy frontend to Vercel (set `REACT_APP_API_URL` = Render URL)

---

## 📝 Key Design Decisions

- **Single `.env`** file — no secrets in code
- **Soft imports** — no TypeScript or build toolchain beyond CRA
- **CRA proxy** (`"proxy": "http://localhost:5000"`) eliminates CORS issues in dev
- **Paginated products** (9/page) — keeps free-tier DB reads low
- **Soft deletes NOT used** — products are hard-deleted (simpler schema)
- **No image uploads** — keeps app stateless and free-tier compatible
