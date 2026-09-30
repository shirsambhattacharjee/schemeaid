# 🏛️ SchemeAid — AI Government Scheme Eligibility Assistant

SchemeAid is a full-stack web application that helps users discover Indian government welfare schemes and check their eligibility based on personal and demographic information.

The platform combines a modern React frontend, Node.js/Express backend, MongoDB database, Firebase authentication, and a deterministic eligibility engine to provide personalized scheme recommendations.

## ✨ Features

- 🔐 **Firebase Authentication**
  - Email/password authentication
  - Google Sign-In
  - Protected application routes

- 🤖 **AI Scheme Assistant**
  - Ask questions about government schemes
  - AI-powered assistance for scheme-related queries

- 🎯 **Eligibility Checker**
  - State
  - Gender
  - Social category
  - Annual family income
  - Education
  - Occupation
  - Family members
  - Rule-based eligibility evaluation
  - Eligibility percentage / profile matching

- 🏛️ **Government Scheme Database**
  - 2,000+ government schemes stored in MongoDB
  - Central and State/UT government schemes
  - Scheme descriptions, benefits, eligibility criteria, documents and application information
  - Official application/website links

- 🔎 **Scheme Discovery**
  - Search and filtering
  - Category-based browsing
  - State-based scheme discovery
  - Scheme details page

- 🌗 **Modern UI**
  - Responsive React interface
  - Dark/light theme support
  - Glassmorphism-inspired design
  - Mobile-friendly layout

- 🛡️ **Backend Security**
  - Helmet security headers
  - CORS configuration
  - Express rate limiting
  - Environment-based configuration

## 🧠 How Eligibility Matching Works

SchemeAid uses a deterministic eligibility engine.

Each scheme can contain structured rules such as:

- `EQUALS`
- `NOT_EQUALS`
- `GREATER_THAN`
- `GREATER_THAN_EQUAL`
- `LESS_THAN`
- `LESS_THAN_EQUAL`
- `IN`
- `NOT_IN`

The user's profile is evaluated against the rules of each active scheme.

The system calculates:

- **Eligible** — all defined criteria are satisfied
- **Partially Eligible** — some criteria are satisfied
- **Ineligible** — none of the criteria are satisfied

The matching percentage is calculated from the number of passed rules.

## 🏗️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Firebase Authentication
- Google Gemini / GenAI integration

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Firebase Authentication
- Helmet
- CORS
- Express Rate Limit

### Development & Deployment

- Git
- GitHub
- Vercel / frontend hosting
- Render / backend hosting
- MongoDB Atlas

## 📁 Project Structure

```text
gov-scheme-assistant/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eligibilityController.js
│   │   └── schemeController.js
│   │
│   ├── models/
│   │   └── Scheme.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eligibilityRoutes.js
│   │   ├── schemeRoutes.js
│   │   └── assistantRoutes.js
│   │
│   ├── services/
│   │   └── eligibilityEngine.js
│   │
│   ├── scripts/
│   │   ├── importSchemes.js
│   │   └── generateRules.js
│   │
│   ├── data/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

## 🔄 Application Flow

```text
User
 │
 ▼
React Frontend
 │
 ├── Authentication ──► Firebase
 │
 ├── Browse Schemes
 │
 └── Check Eligibility
          │
          ▼
     Express API
          │
          ▼
    Eligibility Engine
          │
          ▼
      MongoDB Atlas
          │
          ▼
  Matched Scheme Results
          │
          ▼
      React UI
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd gov-scheme-assistant
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Configure the required Firebase and AI environment variables in the frontend according to your project setup.

> ⚠️ Never commit `.env` files, API keys, Firebase private credentials, or other secrets to GitHub.

### 5. Start the backend

```bash
cd server
node server.js
```

The API runs locally on:

```text
http://localhost:5000
```

### 6. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The Vite development server will normally run on:

```text
http://localhost:5173
```

## 🔌 API Endpoints

### Health Check

```http
GET /
```

### Authentication

```http
/api/auth
```

### Schemes

```http
GET /api/schemes
```

### Eligibility

```http
POST /api/eligibility/check
```

Example request:

```json
{
  "profile": {
    "state": "West Bengal",
    "gender": "Female",
    "category": "General",
    "income": 150000,
    "education": "Graduate",
    "occupation": "Student",
    "familyMembers": 4
  }
}
```

Example response structure:

```json
{
  "success": true,
  "count": 10,
  "eligibleCount": 4,
  "partialCount": 6,
  "data": [
    {
      "scheme": {},
      "evaluation": {}
    }
  ]
}
```

## 🗄️ Database

SchemeAid uses MongoDB with Mongoose.

The `Scheme` model stores:

- Scheme name
- Title
- Description
- Category
- Government level
- State/UT
- Ministry
- Department
- Benefits
- Eligibility information
- Required documents
- Application process
- Official URL
- Application URL
- Tags
- Structured eligibility rules
- Active/inactive status

The project currently contains **2,120 active schemes with generated eligibility rules**.

## 📊 Eligibility Engine

The eligibility engine follows a simple deterministic pipeline:

```text
User Profile
     │
     ▼
Validate Input
     │
     ▼
Fetch Active Schemes
     │
     ▼
Read Scheme Rules
     │
     ▼
Evaluate Each Rule
     │
     ▼
Calculate Match Percentage
     │
     ├── 100% ──► Eligible
     │
     ├── >0% ───► Partially Eligible
     │
     └── 0% ────► Ineligible
     │
     ▼
Sort Results
     │
     ▼
Return Matched Schemes
```

## 🔒 Security

The application includes several basic security measures:

- Helmet middleware
- CORS configuration
- API rate limiting
- Request body size limits
- Environment variables for secrets
- Firebase authentication
- Protected frontend routes

## 📸 Screenshots

Add project screenshots here after uploading them to the repository.

Recommended screenshots:

1. Login / Sign Up page
2. Dashboard
3. Scheme discovery page
4. Eligibility Checker form
5. Eligibility results
6. Scheme details page
7. AI Assistant
8. Dark/light mode

Example:

```md
## 📸 Screenshots

### Dashboard
![Dashboard](https://raw.githubusercontent.com/shirsambhattacharjee/gov-scheme-assistant/main/screenshots/dashboard.png)

### Eligibility Checker
![Eligibility Checker](https://raw.githubusercontent.com/shirsambhattacharjee/gov-scheme-assistant/main/screenshots/eligibility.png)

### Schemes
![Scheme Results](https://raw.githubusercontent.com/shirsambhattacharjee/gov-scheme-assistant/main/screenshots/schemes.png)

### AI Assistant
![AI Assistant](https://raw.githubusercontent.com/shirsambhattacharjee/gov-scheme-assistant/main/screenshots/ai-assistant.png)

### Login
![Login](https://raw.githubusercontent.com/shirsambhattacharjee/gov-scheme-assistant/main/screenshots/login.png)

### Profile
![Profile](https://raw.githubusercontent.com/shirsambhattacharjee/gov-scheme-assistant/main/screenshots/profile.png)
```

## 🎯 Project Goals

The main goal of SchemeAid is to make government welfare information easier to discover and understand.

Instead of manually searching through multiple government portals, users can:

1. Create an account
2. Enter their basic profile information
3. Explore available government schemes
4. Check eligibility
5. Review matched schemes
6. Open official scheme/application links
7. Ask the AI assistant scheme-related questions

## 🔮 Future Improvements

- More comprehensive official scheme datasets
- More advanced rule extraction from eligibility text
- Age and additional demographic criteria
- Improved recommendation ranking
- Multilingual support
- Bengali/Hindi regional language support
- Saved/favourite schemes
- Application status tracking
- Notifications for relevant schemes
- Improved AI-assisted scheme discovery
- Automated dataset updates from verified government sources

## ⚠️ Disclaimer

SchemeAid is an educational/software project intended to simplify discovery of government schemes.

Eligibility information and scheme details may change over time. Users should always verify the latest eligibility criteria, documents, deadlines and application instructions on the relevant official government portal before applying.

## 👨‍💻 Developer

**Shirsam Bhattacharjee**

B.Tech — Information Technology  
Jalpaiguri Government Engineering College Autonomous

### Core Technologies

`React` `Vite` `Node.js` `Express.js` `MongoDB` `Mongoose` `Firebase` `Tailwind CSS` `REST API` `Git` `GitHub` `AI/GenAI`

---

⭐ If you find this project useful, consider giving the repository a star.
