📝 Task Manager – Project Documentation



🔍 Project Overview

Task Manager is a full-stack web application designed to simplify task assignment and management across different user roles like Admin and Manager. It provides real-time updates, a structured dashboard, and essential tools for task tracking and team coordination. The system uses a clean UI with animation support and secure backend integrations.

🚀 Live Deployment
Frontend: https://task-manager-frontend-fvyi.vercel.app

Backend: https://task-manager-backend-emo1.onrender.com

🛠️ Features
User Authentication (Sign up & Login)

Role-Based Access (Admin / Manager)

Task Creation & Assignment

Task List with Filters

Real-Time Notifications via WebSocket

Responsive Design for desktop and mobile

Email Notifications on Task Updates (Optional)

Smooth UI animations for login/dashboard

🧠 Backend
📌 Technologies Used:
Node.js

Express.js

MongoDB Atlas (Mongoose)

JWT Authentication

Nodemailer (for email support)

Socket.io (for real-time updates)

dotenv (environment variable management)

🧩 Main Modules:
server.js – Entry point; sets up HTTP & WebSocket servers.

app.js – Express app instance, routes & middleware config.

routes/ – Auth and task-related API endpoints.

models/ – MongoDB models for User and Task.

middlewares/ – Auth validation, role checks.

sockets/socketHandler.js – WebSocket events and listeners.

config/ – Database connection and email configuration.

🎨 Frontend
📌 Technologies Used:
React.js (Next.js 13 App Router)

Tailwind CSS

Formik (for form handling)

Framer Motion (for animations)

Lottie Files (for animated JSON-based loaders)

Socket.io-client (real-time sync)

Fetch API for HTTP requests

🧩 Key Pages/Components:
src/app/login/page.jsx – Login screen with animation

src/app/signup/page.jsx – User registration

src/app/dashboard/ – Main dashboard

TaskForm – Add/edit tasks

TaskTable – View assigned tasks

NotificationBell – Realtime notifications

Navbar – Navigation and logout

src/app/admin/page.jsx – Admin dashboard

src/app/manager/page.jsx – Manager dashboard

src/app/lib/socket.js – WebSocket client instance

🧪 How to Run Locally
🔧 Backend
Clone the backend repo:

git clone https://github.com/pujith20/task-manager-backend
cd task-manager-backend
Install dependencies:
bcryptjs
cors
crypto
dotenv
express
jsonwebtoken
mongoose
morgan
nodemailer
socket


npm install

Create .env file with:


PORT=3001
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:3000

Run:

node server.js /  nodemon server.js / npm run dev


Frontend Repository is at: https://github.com/pujith20/task-manager-frontend

Admin credentials are given in the README.md file at the frontend repository 

🙏 Thank You Note
Thank you for visiting the Task Manager application!
This project was built with passion and attention to detail to demonstrate full-stack application skills and real-time collaboration features.

If you encounter any issues or would like to collaborate, feel free to reach out. Your feedback is highly appreciated!
