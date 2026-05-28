# Laurus Pharmaceuticals — Full-Stack Web Application

# project structure

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

