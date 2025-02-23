# Plumio PetCare Bot

Plumio PetCare Bot is a **MERN stack** application designed for booking pet appointments efficiently. It features a **chatbot** that guides users through the appointment booking process and stores pet and owner appointment details.

## 🚀 Features

- **User Authentication**: Secure login and registration.
- **Chatbot Assistance**: Helps users book appointments.
- **Responsive UI**: Works across multiple devices.
- **Receipt Generation**: Generates a receipt after apointment confirmation.

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt.js

## 📂 Project Structure

```
Plumio-PetCare-Bot/
│── client/                   # Frontend (React.js)
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api/              # API requests
│   │   ├── components/       # Reusable components (Login, Register, Chat, HomePage)
│   ├── App.js                # Main app component
│   ├── index.js              # Entry point
│   └── package.json          # Dependencies & scripts
│
│── server/                   # Backend (Node.js & Express)
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── server.js             # Express server
│   └── package.json          # Dependencies & scripts
│
│── README.md                 # Project documentation
│── .gitignore                # Ignore files for Git

```

## ⚙️ Installation & Setup

### 1️. Clone the Repository

```sh
git clone < git repo-link >
cd Plumio-PetCare-Bot
```

### 2️. Set Up the Server

```sh
cd server
npm install
```

Create a `.env` file and add your **MongoDB URI & JWT Secret**:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```sh
npm start
```

### 3️. Set Up the Client

```sh
cd ../client
npm install
npm start
```

The app should now be running at **http://localhost:3000/** 🚀

## 🧪 Running Tests

To run tests:

```sh
cd client
npm test
```

---

### 🎉 Happy Coding & Pet Care! 🐶🐱
