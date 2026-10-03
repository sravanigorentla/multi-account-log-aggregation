# Vercel Deployment & Setup Guide

This project is a multi-account AWS CloudTrail Log Aggregation Dashboard featuring a **full React frontend**, **Authentication (Login & Signup)**, and a **Serverless Backend API** configured for deployment on [Vercel](https://vercel.com).

---

## 🚀 1. Deploying to Vercel (2 Simple Options)

### Option A: Deploy via GitHub (Recommended)
1. Initialize git and commit your files:
   ```bash
   git add .
   git commit -m "feat: complete login, signup, backend API and Vercel configuration"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **Add New...** -> **Project**.
4. Import your GitHub repository.
5. Vercel automatically detects:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**!
   Your site will be live within seconds with both frontend and `/api` serverless backend endpoints active.

---

### Option B: Deploy directly using Vercel CLI from VS Code
1. In your VS Code terminal, install the Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Run deploy:
   ```bash
   vercel
   ```
3. Follow the quick prompts in your terminal:
   - *Set up and deploy?* `Y`
   - *Which scope?* (Select your account)
   - *Link to existing project?* `N`
   - *Project name?* `cloudtrail-aggregator`
   - *Directory?* `./`
4. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 💻 2. Running Locally in VS Code

You can run the entire frontend + backend with a single command:

```bash
npm run dev
```

- Open `http://localhost:5173` in your browser.
- Vite dev server automatically routes `/api/*` endpoints to the integrated backend authentication service!

### Pre-Configured Demo Credentials:
- **Admin Account**: `admin@cloudtrail.aws`
- **Password**: `Admin@123`
- *(Or click the **Quick 1-Click Demo Access** buttons on the Login page)*

---

## 🛠️ 3. Architecture & Included Backend Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/signup` | `POST` | Registers a new user with salted PBKDF2 hash & creates session token |
| `/api/auth/login` | `POST` | Authenticates user credentials & returns user profile with JWT-style token |
| `/api/auth/me` | `GET` | Validates session Bearer token and returns logged-in identity |
| `/api/auth/logout` | `POST` | Ends current session |
| `/api/health` | `GET` | Verifies health of backend API functions |

### Files Added:
- [`src/pages/Login.jsx`](file:///c:/Users/srava/OneDrive/Desktop/hackathon/src/pages/Login.jsx) - Cyber-security themed login page with 1-click demo access
- [`src/pages/Signup.jsx`](file:///c:/Users/srava/OneDrive/Desktop/hackathon/src/pages/Signup.jsx) - Registration page with live password strength meter & role selector
- [`src/context/AuthContext.jsx`](file:///c:/Users/srava/OneDrive/Desktop/hackathon/src/context/AuthContext.jsx) - Global auth provider & session manager
- [`src/components/ProtectedRoute.jsx`](file:///c:/Users/srava/OneDrive/Desktop/hackathon/src/components/ProtectedRoute.jsx) - Guard to protect all dashboard routes
- [`backend/authService.js`](file:///c:/Users/srava/OneDrive/Desktop/hackathon/backend/authService.js) - Secure crypto hashing & token management
- [`api/`](file:///c:/Users/srava/OneDrive/Desktop/hackathon/api) - Vercel Serverless Functions (`login.js`, `signup.js`, `me.js`, `logout.js`, `health.js`, `index.js`)
- [`vercel.json`](file:///c:/Users/srava/OneDrive/Desktop/hackathon/vercel.json) - Vercel SPA rewrites & serverless routing config
- [`server.js`](file:///c:/Users/srava/OneDrive/Desktop/hackathon/server.js) - Standalone Node.js server fallback (`npm run server`)
