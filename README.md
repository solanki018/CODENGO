📌 Suggested Structure for Codengo README
# Codengo 🚀

Codengo is a collaborative code-sharing and coding platform where developers can **store, compile, and collaborate on code in real-time**. Inspired by GitHub, Codengo also enables multiple users to work together in live coding rooms with unique room IDs.

---

## ✨ Features
- 🔑 User authentication (Login / Signup)  
- 🔒 Secure password storage using bcrypt  
- 📂 Store and download code files  
- ⚡ Real-time collaborative coding rooms (with room IDs)  
- 🖥️ Code compilation support  
- 📧 Forgot password functionality (via email)  

---

## 🛠️ Tech Stack
**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JWT & bcrypt  

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm  
- MongoDB installed locally or use MongoDB Atlas  

### Installation
```bash
# Clone the repository
git clone https://github.com/solanki018/codengo.git

# Go into the project folder
cd codengo

# Install dependencies for backend
cd backend
npm install

# Install dependencies for frontend
cd ../codengo
npm install

Running the Project
# Start backend
cd backend-socket
npm start

# Start frontend
cd codengo
npm start
