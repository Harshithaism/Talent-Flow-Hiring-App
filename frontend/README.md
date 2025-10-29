# TalentFlow Frontend

A modern, frontend-only job management and candidate tracking application built with React, Dexie.js, and Tailwind CSS.

## Features

- 🎯 **Jobs Board**: View and manage job postings with filtering and search
- 👥 **Candidate Tracking**: Track candidates through different hiring stages
- 📝 **Assessment Builder**: Create custom assessment forms for candidates
- 💾 **Local Storage**: All data stored locally in browser's IndexedDB using Dexie.js

## Tech Stack

- **React 19** - UI framework
- **React Router v7** - Client-side routing
- **Dexie.js** - IndexedDB wrapper for local data storage
- **Tailwind CSS 3.4** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **date-fns** - Date formatting

## Quick Start

### Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org/))
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── utils/           # Database & utilities
│   ├── lib/             # Utility functions
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
└── package.json        # Dependencies
```

## Data Persistence

All data is stored locally in the browser's IndexedDB:
- Jobs: Job postings and details
- Candidates: Candidate profiles and information
- Assessments: Custom assessment forms
- Timeline: Candidate activity history

## Sample Data

The application comes with seeded sample data:
- 25 job postings
- 1000 candidate profiles
- Initial timeline entries for all candidates

## Contributing

This is a frontend-only application. All backend dependencies have been removed. The application runs entirely in the browser with local data storage.

## License

MIT License
