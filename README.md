# Agenda - Event Scheduling AI Assistant

A real-time chatbot application built with **Google DialogFlow ES**, **React**, and **Node.js** that helps users schedule events through natural language conversation. The application uses WebSockets for bidirectional real-time communication between frontend and backend.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)

---

## 🎯 Project Overview

**Agenda** is an intelligent event scheduling assistant that leverages Google's DialogFlow ES to understand user intents and extract entities from natural language queries. Users can:

- Schedule events using natural language
- Query existing events
- Update already created events
- Delete any events
- Get instant responses with real-time streaming chat interface

The application demonstrates a full-stack implementation with:
- **Real-time bidirectional communication** via WebSockets (Socket.io)
- **AI/NLP capabilities** through Google DialogFlow
- **Modern responsive UI** built with React and Vite
- **Scalable backend architecture** with Express.js

---

## 🏗️ Architecture

The application uses a three-tier architecture:

```
┌──────────────────────────────────────────────────────────────┐
│            Frontend (React + Vite) (Port 3000)               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  ChatWindow  │  │  ChatInput   │  │MessageBubble │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│        ▲                  ▲                 ▲                │
│        └──────────────────┴─────────────────┘                │
│                           │                                  │
│                   useSocket Hook (WS)                        │
└───────────────────────────┼──────────────────────────────────┘
                            │
              WebSocket (Socket.io) Connection
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                  Backend (Node.js + Express.js)              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Express Server (Port 4000)              │    │
│  │                                                      │    │
│  │   ┌──────────────┐  ┌────────────────────────────┐   │    │
│  │   │  socket.js   │  │  dialogflowSocket.js       │   │    │
│  │   │ (WS Handler) │  │ (Intent Detection)         │   │    │
│  │   └──────────▲───┘  └─────────────▲──────────────┘   │    │
│  │         │    │                    │                  │    │
│  │         │    └────────────────────┘                  │    │
│  │         │                                            │    │
│  │   ┌─────▼────────────┐                               │    │
│  │   │  streamReply.js  │                               │    │
│  │   │ (Response Stream)│                               │    │
│  │   └──────────────────┘                               │    │
│  │                    │                                 │    │
│  └────────────────────▼─────────────────────────────────┘    │
│                       │                                      │
│              Google API Credentials                          │
└───────────────────────┼──────────────────────────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │  Google DialogFlow ES Agent    │
        │  (NLP Intent Detection)        │
        │  (Entity Extraction)           │
        │  (Response Generation)         │
        └────────────────────────────────┘
```

### Communication Flow

1. **User sends message** → Frontend captures input via `ChatInput` component
2. **WebSocket emission** → Message sent to backend via Socket.io
3. **Intent detection** → Backend queries Google DialogFlow ES with the user message
4. **Response streaming** → DialogFlow returns fulfillment text which the backend then streams back to frontend
5. **UI update** → Frontend displays bot response in `ChatWindow` with real-time streaming effect

---

## 🛠️ Technologies Used

### Frontend
- **React 19.2.6** - UI library
- **Vite 6.2.0** - Build tool and dev server
- **Socket.io-client 4.8.3** - WebSocket client
- **ESLint 9.21.0** - Code quality

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web framework
- **Socket.io 4.8.3** - WebSocket library
- **@google-cloud/dialogflow 7.6.1** - DialogFlow ES client
- **CORS 2.8.6** - Cross-origin resource sharing
- **Dotenv 17.4.2** - Environment variable management
- **Nodemon** (dev) - Auto-restart server on changes

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - For version control

### Google DialogFlow Setup

You'll need a Google Cloud project with DialogFlow ES enabled:

1. Create a [Google Cloud Project](https://console.cloud.google.com/)
2. Enable the **DialogFlow API**
3. Create a **Service Account** with DialogFlow Client role
4. Download the service account JSON credentials file
5. Place it in `Backend/config/serviceAccount.json`

---

## 📁 Project Structure

```
Backend Learning/
├── README.md                          # Project documentation
│
├── Backend/                           # Node.js Express server
│   ├── app.js                        # Express app configuration
│   ├── server.js                     # Server entry point
│   ├── socket.js                     # Socket.io initialization & handlers
│   ├── package.json                  # Backend dependencies
│   ├── config/
│   │   ├── config.env                # Environment variables
│   │   └── serviceAccount.json       # Google DialogFlow credentials
│   └── Websocket/
│       ├── dialogflowSocket.js       # DialogFlow intent detection logic
│       └── streamReply.js            # Response streaming handler
│
├── Frontend/                          # React + Vite application
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite build config
│   ├── eslint.config.js              # ESLint configuration
│   ├── index.html                    # HTML entry point
│   └── src/
│       ├── main.jsx                  # React app entry point
│       ├── App.jsx                   # Main app component
│       ├── index.css                 # Global styles
│       ├── Components/
│       │   ├── ChatWindow.jsx        # Chat message display
│       │   ├── ChatInput.jsx         # Message input component
│       │   └── MessageBubble.jsx     # Individual message bubble
│       ├── Hooks/
│       │   └── useSocket.js          # Socket.io connection hook
│       ├── Styles/
│       │   ├── App.css               # App component styles
│       │   ├── ChatWindow.css        # Chat window styles
│       │   ├── ChatInput.css         # Input component styles
│       │   └── MessageBubble.css     # Message bubble styles
│       └── utils/
│           └── formatMessage.js      # Message formatting utilities
│
└── DialogFlow ES.txt                 # DialogFlow concepts & todo list
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd "Backend Learning/Interact CX Test Task"
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd Backend
```

#### 2.2 Install Dependencies

```bash
npm install
```

#### 2.3 Configure Environment Variables

Update `Backend/config/config.env` with your settings:

```env
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:5173
DIALOGFLOW_PROJECT_ID=your-dialogflow-project-id
GOOGLE_APPLICATION_CREDENTIALS=./config/serviceAccount.json
```

#### 2.4 Add Google Credentials

Place your downloaded service account JSON file at:
```
Backend/config/serviceAccount.json
```

**Security Note**: Never commit credentials to version control. Add to `.gitignore`:
```
Backend/config/serviceAccount.json
Backend/config/config.env
```

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory

```bash
cd ../Frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Configure Environment Variables

Create a `.env.local` file in the Frontend directory:

```env
VITE_BACKEND_URL=http://localhost:4000
```

This tells the frontend where to connect to the WebSocket server.

---

## ⚙️ Configuration

### Backend Configuration

**File**: `Backend/config/config.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_PORT` | Port where backend runs | `4000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `DIALOGFLOW_PROJECT_ID` | Your DialogFlow project ID | `calendar-agent-icx-upvx` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account credentials | `./config/serviceAccount.json` |

### Frontend Configuration

**File**: `Frontend/.env.local`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend WebSocket server URL | `http://localhost:4000` |

---

## ▶️ Running the Application

### Option 1: Running Locally (Development)

#### Terminal 1 - Start Backend Server

```bash
cd Backend
npm run dev
```

Expected output:
```
Server is running on http://localhost:4000/
```

#### Terminal 2 - Start Frontend Dev Server

```bash
cd Frontend
npm run dev
```

Expected output:
```
  VITE v6.2.0  ready in 245 ms

  ➜  local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Option 2: Production Build

#### Build Frontend

```bash
cd Frontend
npm run build
```

This creates a `dist` folder with optimized production files.

#### Start Backend in Production

```bash
cd Backend
npm start
```

### Accessing the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the Agenda chat interface with a connection status indicator.

---

## 🔧 Environment Variables

### Backend Environment Variables

```env
# Server Configuration
BACKEND_PORT=4000

# Frontend URL (for CORS policy)
FRONTEND_URL=http://localhost:5173

# Google DialogFlow Configuration
DIALOGFLOW_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./config/serviceAccount.json
```

### Frontend Environment Variables

```env
# WebSocket Connection URL
VITE_BACKEND_URL=http://localhost:4000
```

### For Production

Update FRONTEND_URL and VITE_BACKEND_URL to your production domain:

```env
# Backend
FRONTEND_URL=https://yourdomain.com

# Frontend
VITE_BACKEND_URL=https://yourdomain.com
```

---

## 📊 Key Features

- **Real-time Chat Interface** - Instant message delivery via WebSockets
- **AI-Powered Responses** - Google DialogFlow ES for natural language understanding
- **Responsive Design** - Mobile-friendly chat UI
- **Connection Status Indicator** - Shows live server connection status
- **Error Handling** - Comprehensive error messages for debugging
- **Streaming Responses** - Bot responses stream character-by-character for better UX
- **Session Management** - Each user gets a unique session ID for context

---

## 🐛 Troubleshooting

### Backend won't start
- Check that port 4000 is available: `netstat -ano | findstr :4000` (Windows)
- Verify environment variables in `config.env`
- Check Google credentials file path and permissions

### Frontend can't connect to backend
- Ensure backend is running on port 4000
- Check `VITE_BACKEND_URL` in `.env.local`
- Verify CORS settings match your frontend URL
- Check browser console for connection errors

### DialogFlow returns empty response
- Verify DialogFlow project ID is correct
- Check that intents have response text configured in DialogFlow console
- Ensure service account has proper permissions

### Port already in use
```bash
# Windows - Find and kill process on port
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4000
kill -9 <PID>
```

---

## 📝 Available Scripts

### Backend

```bash
npm start      # Start production server
npm run dev    # Start with nodemon (auto-reload)
```

### Frontend

```bash
npm run dev     # Start development server (Vite)
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👤 Author

**Aneeq Muneer**

---

## 🎓 Learning Resources

- [Google DialogFlow ES Documentation](https://cloud.google.com/dialogflow/es/docs)
- [Socket.io Documentation](https://socket.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

## 📞 Support

For issues, questions, or suggestions:
- Check existing issues in the repository
- Create a new issue with detailed description
- Include error messages and steps to reproduce

---

**Last Updated**: June 2026
