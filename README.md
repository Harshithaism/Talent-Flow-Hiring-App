# TalentFlow - Frontend Only Application

A modern job management and candidate tracking application built with React.

## Quick Start

### Prerequisites
- Node.js 18+ ([Download here](https://nodejs.org/))

### Installation

1. Navigate to the frontend folder:
```bash
cd TalentFlow-main\TalentFlow-main\frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- ✅ Jobs Board - Manage job postings
- ✅ Candidate Tracking - Track candidates through hiring stages
- ✅ Assessment Builder - Create custom assessments
- ✅ Local Storage - All data stored in browser using IndexedDB

## Project Structure

```
frontend/          # Frontend React application
├── src/
│   ├── pages/    # Page components
│   ├── components/
│   └── utils/    # Database & utilities
```

## Documentation

- **QUICKSTART.md** - Quick start guide
- **FRONTEND_SETUP.md** - Detailed setup instructions
- **frontend/README.md** - Frontend documentation

## Tech Stack

- React 19
- Dexie.js (IndexedDB)
- Tailwind CSS
- shadcn/ui components

## Note

This is a frontend-only application. All backend dependencies have been removed. The application runs entirely in the browser with local data storage.
