# 🛡️ AWS Multi-Account CloudTrail Log Aggregation Dashboard

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sravanigorentla/multi-account-log-aggregation)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/sravanigorentla/multi-account-log-aggregation)
[![React 19](https://img.shields.io/badge/React-19-cyan?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![SOC 2 Audited](https://img.shields.io/badge/Compliance-SOC%202%20Type%20II-emerald)]()

A centralized, enterprise-grade Security Operations (SecOps) and compliance monitoring dashboard that aggregates, correlates, and analyzes AWS CloudTrail audit logs across multiple AWS accounts in real-time.

---

## ⚡ Instant 1-Click Vercel Deployment

Click the button below to deploy this full-stack application directly to your Vercel account:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sravanigorentla/multi-account-log-aggregation)

---

## 🌟 Key Features

- **🔐 End-to-End Authentication**:
  - Secure **Login** and **Signup** with real-time password strength meter and confirmation validator.
  - PBKDF2 cryptographic salted hashing with 100,000 iterations & HMAC-SHA256 JWT tokens.
  - **1-Click Quick Demo Login** buttons for instant testing as *Security Admin* or *Lead Cloud Architect*.
  - Protected route architecture guarding all dashboards and audit views.
- **☁️ Multi-Account AWS Log Ingestion**:
  - Aggregation across Production, Staging, Development, Shared Services, and Security Tooling accounts.
  - Cross-account event correlation and anomaly detection.
- **🚨 Real-Time Security & Alerting**:
  - Threat detection for unauthorized API calls, IAM privilege escalations, root account usage, and sensitive bucket exposures.
- **📊 Interactive Compliance & Audit Reporting**:
  - Continuous mapping against **CIS AWS Foundations Benchmark**, **PCI-DSS 4.0**, **SOC 2 Type II**, **HIPAA Security Rule**, and **ISO/IEC 27001**.
- **🌐 Serverless Backend on Vercel**:
  - Native serverless `/api` endpoints with zero cold start penalty.
  - Built-in dev proxy middleware so frontend and backend work out-of-the-box locally.

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Cloud Security Admin** | `admin@cloudtrail.aws` | `Admin@123` |
| **Lead Cloud Architect** | `alex.rivera@cloudtrail.aws` | `Admin@123` |

*(You can also register a new account on the `/signup` page!)*

---

## 🚀 Running Locally in VS Code

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sravanigorentla/multi-account-log-aggregation.git
   cd multi-account-log-aggregation
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser. Both frontend and backend API endpoints are instantly live!

---

## 🌐 Deploying to Vercel via CLI

If you prefer deploying from your VS Code terminal:

```bash
# 1. Log into your Vercel account (one-time)
vercel login

# 2. Deploy to production
vercel --prod
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Authenticates credentials and returns JWT Bearer token |
| `/api/auth/signup` | `POST` | Registers new SecOps identity with salted PBKDF2 hash |
| `/api/auth/me` | `GET` | Validates session token in `Authorization` header |
| `/api/auth/logout` | `POST` | Clears active session |
| `/api/health` | `GET` | Health check for Vercel serverless runtime |

---

## 📜 License

MIT License. Designed and developed for centralized cloud security compliance and log aggregation.
