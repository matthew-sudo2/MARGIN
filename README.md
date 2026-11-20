# MARGIN — Research & Thesis Workspace (MERN Stack)

> **Activity 1.2 / 1.3: Web Application Development**  
> Developed for **CTINASSL (Information Assurance & Security Lab)**  
> Complies with the **MERN Stack Framework** (MongoDB, Express, React, Node.js)

---

## 1. Project Overview

**MARGIN** is a research, thesis, and capstone workspace web application designed for academic researchers and small research organizations. It provides a structured, responsive interface and a robust RESTful backend to manage research citations, literature notes, project lifecycles, and empirical experiments.

### Key Capabilities
- **Library (Literature & Citations):** Manage papers, metadata (authors, publication year, domain, venue, URL/DOI, and abstract).
- **Notes (Working Knowledge):** Draft interpretations, critique claims, and link notes directly to source literature.
- **Projects (Research Portfolio):** Plan, track, and categorize research streams across stages (*Planning*, *In Progress*, *Completed*).
- **Experiments (Research Log):** Document traceable logs of methodology, observations, and empirical results linked to specific projects.
- **Settings & Data Management:** Full workspace state management with instant demo data restoration and real-time backend API synchronization.

---

## 2. Architecture & Directory Structure

```text
MARGIN/
├── client/                      # React Frontend (Vite + Tailwind CSS v4)
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts           # REST API client & backend synchronization layer
│   │   ├── App.tsx              # Main application UI, routing, and state orchestration
│   │   ├── components.tsx       # Reusable UI widgets (Modal, ConfirmDialog, Field, Toast)
│   │   ├── data.ts              # Data types and initial dataset definitions
│   │   ├── index.css            # Tailwind CSS styling & editorial design tokens
│   │   ├── main.tsx             # React DOM entry point
│   │   └── vite-env.d.ts        # Vite TypeScript definitions
│   ├── index.html               # Clean HTML5 document shell
│   ├── package.json             # Frontend dependencies & scripts
│   ├── tsconfig.json            # TypeScript configuration
│   └── vite.config.ts           # Vite bundler configuration & backend API reverse proxy
│
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB connection manager (dual-mode / instructor-safe)
│   ├── controllers/             # Business logic & CRUD request handlers
│   │   ├── paperController.js   # Paper CRUD operations
│   │   ├── noteController.js    # Note CRUD operations
│   │   ├── projectController.js # Project CRUD operations
│   │   └── experimentController.js # Experiment CRUD operations
│   ├── models/                  # Mongoose Data Schemas & Models
│   │   ├── Paper.js             # Paper schema with data types & validation
│   │   ├── Note.js              # Note schema with reference to Paper
│   │   ├── Project.js           # Project schema with status enum & timestamps
│   │   └── Experiment.js        # Experiment schema with reference to Project
│   ├── routes/                  # Express REST API routes
│   │   ├── paperRoutes.js       # /api/papers router
│   │   ├── noteRoutes.js        # /api/notes router
│   │   ├── projectRoutes.js     # /api/projects router
│   │   └── experimentRoutes.js  # /api/experiments router
│   ├── data/
│   │   ├── mockStore.js         # In-memory dual-mode store (active CRUD without DB errors)
│   │   └── seedData.json        # Exportable JSON collections for MongoDB Compass
│   ├── .env                     # Server environment variables
│   ├── .env.example             # Template environment configuration
│   ├── package.json             # Backend dependencies & scripts
│   ├── server.js                # Express app entrypoint, middleware, and route mounting
│   └── test-api.js              # Automated CRUD test suite
│
├── package.json                 # Root script runner for unified execution
└── README.md                    # Project documentation and activity guide
```

---

## 3. Web Server with Database Integration (Models, Controllers, Routers)

For your **Activity 1.2 submission**, the rubric requires displaying the newly created Models, the updated Controller, and the updated Router.

### 3.1 Data Models (`server/models/`)
| Model | Key Fields & Types | Relationships & Constraints |
| :--- | :--- | :--- |
| **`Paper`** | `id` (String), `title` (String), `authors` (String), `year` (Number), `domain` (String), `abstract` (String), `venue` (String), `url` (String), `dateAdded` (Date/String) | Required fields, year validation (1000–present), indexed ID |
| **`Note`** | `id` (String), `title` (String), `content` (String), `paperId` (String), `createdAt` (Date), `modifiedAt` (Date) | `paperId` references `Paper` (`ref: 'Paper'`) |
| **`Project`** | `id` (String), `name` (String), `description` (String), `category` (String), `status` (String), `createdAt` (Date) | Status restricted to enum: `['Planning', 'In Progress', 'Completed']` |
| **`Experiment`** | `id` (String), `title` (String), `description` (String), `methodology` (String), `observations` (String), `results` (String), `projectId` (String), `recordedAt` (Date) | `projectId` references `Project` (`ref: 'Project'`) |

### 3.2 Dual-Mode Architecture (Instructor-Safe)
As required by your instructor, **the backend is designed to run without requiring a live MongoDB connection yet**, while still providing the exact Mongoose Models and REST API endpoints:
1. **Current Mode (`CONNECT_DB=false`):** All CRUD requests execute against `mockStore.js` in memory. This means tests and frontend interactions work out-of-the-box with zero database connection timeouts or crash errors.
2. **Live MongoDB Mode (`CONNECT_DB=true`):** In `server/.env`, set `CONNECT_DB=true` and specify your `MONGODB_URI`. The server will automatically connect to MongoDB and query the Mongoose collections directly.

---

## 4. Database Development & MongoDB Compass Instructions

For the activity section:  
> *"Display here the database management dashboard that contains the created collections and the data modeling for the web application."*

You can populate MongoDB Compass to capture this screenshot using the provided seed data:

1. Open **MongoDB Compass** on your desktop.
2. Connect to `mongodb://localhost:27017` (or your MongoDB Atlas URI).
3. Create a new database named **`margin_db`**.
4. Create the 4 collections:
   - `papers`
   - `notes`
   - `projects`
   - `experiments`
5. Click into each collection and select **Add Data > Import JSON or CSV file**. Import the corresponding array from `server/data/seedData.json`.
6. Navigate to the database dashboard / Schema tab in MongoDB Compass to take your screenshot of the collections and schema view.

---

## 5. REST API Specification

| Entity | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/health` | Health check & mode inspection |
| **Papers** | `GET` | `/api/papers` | Retrieve all papers |
| | `GET` | `/api/papers/:id` | Retrieve single paper by ID |
| | `POST` | `/api/papers` | Create new paper |
| | `PUT` | `/api/papers/:id` | Update existing paper |
| | `DELETE` | `/api/papers/:id` | Delete paper (unlinks notes) |
| **Notes** | `GET` | `/api/notes` | Retrieve all notes |
| | `GET` | `/api/notes/:id` | Retrieve single note by ID |
| | `POST` | `/api/notes` | Create new note |
| | `PUT` | `/api/notes/:id` | Update note |
| | `DELETE` | `/api/notes/:id` | Delete note |
| **Projects** | `GET` | `/api/projects` | Retrieve all projects |
| | `GET` | `/api/projects/:id` | Retrieve single project by ID |
| | `POST` | `/api/projects` | Create new project |
| | `PUT` | `/api/projects/:id` | Update project |
| | `DELETE` | `/api/projects/:id` | Delete project (unlinks experiments) |
| **Experiments** | `GET` | `/api/experiments` | Retrieve all experiments |
| | `GET` | `/api/experiments/:id` | Retrieve single experiment by ID |
| | `POST` | `/api/experiments` | Create new experiment |
| | `PUT` | `/api/experiments/:id` | Update experiment |
| | `DELETE` | `/api/experiments/:id` | Delete experiment |
| **Reset** | `POST` | `/api/reset` | Restore demo workspace records |

---

## 6. How to Run the Project

### Prerequisites
- Node.js (v18+ recommended, v24 supported)
- npm (v10+)

### Step 1: Install Dependencies
From the repository root:
```bash
npm run install:all
```
*(Or navigate to `client` and `server` separately and run `npm install`).*

### Step 2: Start the Backend Server
In a terminal:
```bash
npm run dev:server
```
*(Runs on `http://localhost:5000`)*

### Step 3: Start the React Frontend
In a second terminal:
```bash
npm run dev:client
```
*(Runs on `http://localhost:3000`)*

### Step 4: Run the Automated API CRUD Test Suite
In a terminal:
```bash
npm run test:server
```
This runs `server/test-api.js`, which executes automated tests against all endpoints (`health`, `GET`, `POST`, `PUT`, `DELETE`) and verifies 100% functionality.

---

## 7. Activity Submission Checklist

- [ ] **Database Development Screenshot:** MongoDB Compass displaying the collections (`papers`, `notes`, `projects`, `experiments`) and data schema.
- [ ] **Models Screenshot:** VS Code displaying `server/models/Paper.js`, `Note.js`, `Project.js`, `Experiment.js`.
- [ ] **Controllers Screenshot:** VS Code displaying `server/controllers/paperController.js`.
- [ ] **Routers Screenshot:** VS Code displaying `server/routes/paperRoutes.js`.
- [ ] **Running Application Screenshot:** Browser showing the MARGIN web app connected to the backend API (`http://localhost:3000`).
- [ ] **Terminal Output Screenshot:** Running `npm run test:server` demonstrating all CRUD operations pass cleanly.
- [ ] **Naming Convention:** Ensure the submitted PDF is saved as:
  `LASTNAME_CTINASSL_SECTION_TERM_AY_Activity1.3.pdf`
