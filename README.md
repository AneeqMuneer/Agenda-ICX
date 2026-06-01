# Agenda - Event Scheduling AI Assistant

A real-time chatbot application built with **Google DialogFlow ES**, **React**, and **Node.js** that helps users schedule events through natural language conversation. The application uses WebSockets for bidirectional real-time communication between frontend and backend.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Environment Variables For Production](#environment-variables-for-production)

---

## Project Overview

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

## Architecture

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

## Technologies Used

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

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - For version control

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/AneeqMuneer/Agenda-ICX.git
cd Agenda-ICX
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

Update `Backend/config/config.env` with your settings by following the steps mentioned in said file.

#### 2.4 Add Google Credentials

Place your downloaded service account JSON file at with name `serviceAccount.json`:
```
Backend/config/
```

**Security Note**: Never commit credentials to version control. Add to `.gitignore` (Already added):
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

Create a `.env` file in the Frontend directory (Already set up):

```env
VITE_BACKEND_URL=http://localhost:4000
```

This tells the frontend where to connect to the WebSocket server.

---

## Configuration

### Backend Configuration

**File**: `Backend/config/config.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_PORT` | Port where backend runs | `4000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `DIALOGFLOW_PROJECT_ID` | Your DialogFlow project ID | `your-dialogflow-project-id` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account credentials | `./config/serviceAccount.json` |

### Frontend Configuration

**File**: `Frontend/.env.local`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend WebSocket server URL | `http://localhost:4000` |

---

## Running the Application

### Option 1: Running Locally (Development)

#### Terminal 1 - Start Backend Server

```bash
cd Agenda-ICX
cd Backend
npm run dev
```

Expected output:
```
Server is running on http://localhost:4000/
```

#### Terminal 2 - Start Frontend Dev Server

```bash
cd Agenda-ICX
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
cd Agenda-ICX
cd Frontend
npm run build
npm run preview
```

This creates a `dist` folder with optimized production files.

#### Start Backend in Production

```bash
cd Agenda-ICX
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

## Environment Variables For Production

Update FRONTEND_URL and VITE_BACKEND_URL to your production domain:

```env
# Backend
FRONTEND_URL=https://yourdomain.com

# Frontend
VITE_BACKEND_URL=https://yourdomain.com
```

---

## Available Scripts

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

## Author

**Aneeq Muneer**
