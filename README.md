Goal Setting & Tracking Portal

A full-stack web application developed for ATOMQUEST HACKATHON 1.0 to streamline employee goal management, approvals, and quarterly performance tracking within organizations.

🚀 Features
Employee Module
Create and manage goals
Submit goal sheets
Quarterly achievement updates
Progress status tracking
Manager Module
Approve/reject goals
Inline goal editing
Team progress dashboard
Quarterly check-in comments
Admin Module
Manage users and cycles
Unlock approved goals
View audit logs
Shared goal assignment
📊 Core Functionalities
Goal Creation & Approval Workflow
Quarterly Check-ins
Shared Goals
Progress Tracking
Audit Trail Logging
Dashboard Analytics
CSV/Excel Report Export
Role-Based Access Control
🛠 Tech Stack
Layer	Technology
Frontend	React.js + Tailwind CSS
Backend	Node.js + Express.js
Database	MongoDB Atlas
Authentication	JWT + bcrypt
Charts	Recharts
Deployment	Cloudflare / Vercel / Render
📁 Project Structure
client/
 ├── src/
 ├── components/
 ├── pages/
 ├── services/

server/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── config/
⚙️ Installation & Setup
1. Clone Repository
git clone https://github.com/your-username/goal-tracking-portal.git
cd goal-tracking-portal
2. Install Dependencies
Frontend
cd client
npm install
Backend
cd server
npm install
🔐 Environment Variables

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
▶️ Run the Application
Start Backend
cd server
npm run dev
Start Frontend
cd client
npm start
🌐 Goal Setting & Tracking Portal Live Demo

A full-stack web application developed for ATOMQUEST HACKATHON 1.0 that enables employees to create and track goals, managers to approve and review progress, and admins to manage organizational workflows through dashboards, analytics, audit logs, and quarterly performance tracking.



[Goal Setting & Tracking Portal Live Demo](https://durham-wellington-sixth-probability.trycloudflare.com)

👤 Demo Credentials
Employee
Email: employee@test.com
Password: Employee@123
Manager
Email: manager@test.com
Password: Manager@123
Admin
Email: admin@test.com
Password: Admin@123
📌 Validation Rules
Total Goal Weightage = 100%
Minimum Weightage per Goal = 10%
Maximum Goals per Employee = 8
Goals Locked After Approval
Quarterly Update Window Restrictions
📈 Future Enhancements
Microsoft Entra ID Integration
Teams & Email Notifications
AI-Based Analytics
Escalation Workflow
Advanced Reporting
📄 License

This project was developed for educational and hackathon purposes.
