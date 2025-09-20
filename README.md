# 📄 Resume Analyzer

An AI-powered Resume Analyzer web application that helps students and job seekers evaluate their resumes against industry standards. It highlights strengths, suggests improvements, and provides actionable feedback to make resumes ATS-friendly and interview-ready.



# 🚀 Features

📂 Resume Upload – Upload a resume (PDF/text)

⚡ Automated Analysis – Processes the resume and generates an output report

📝 Feedback Output – Provides insights like:

Missing sections (Education, Skills, Projects, etc.)

Suggestions to improve clarity and formatting

Keyword hints for ATS (Applicant Tracking Systems)

# 🛠️ Tech Stack

Frontend: Next.js, TailwindCSS
Backend: Node.js, Express.js
Database: MongoDB
AI / NLP: Gemini API / Resume parsing utilities
Deployment: Vercel (Frontend), Render  (Backend)

# ⚡ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer

# 2️⃣ Install dependencies
Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
npm install
npm run dev

# 3️⃣ Environment Variables

Create a .env file in the backend folder:

PORT=5001
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
MONGO_URI=your_mongodb_connection

# 📊 How It Works

User uploads a resume

Backend extracts the text

AI model generates a structured output report

Output is displayed in the frontend
