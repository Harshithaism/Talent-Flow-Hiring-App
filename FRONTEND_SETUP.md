# Running the TalentFlow Frontend Application

## Prerequisites

Before running the application, you need to have Node.js installed on your system.

### Install Node.js

1. Download Node.js from [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS (Long Term Support) version
   - For Windows, download the `.msi` installer

2. Run the installer and follow the installation wizard
   - Make sure to check "Add to PATH" during installation

3. Verify the installation by opening a new terminal and running:
   ```bash
   node --version
   npm --version
   ```

## Installation & Running Steps

Once Node.js is installed, follow these steps:

### 1. Navigate to the frontend directory

```bash
cd TalentFlow-main\TalentFlow-main\frontend
```

### 2. Install Dependencies

You can use either npm or yarn:

**Using npm:**
```bash
npm install
```

**Using yarn (if installed):**
```bash
yarn install
```

### 3. Start the Development Server

**Using npm:**
```bash
npm start
```

**Using yarn (if installed):**
```bash
yarn start
```

### 4. Access the Application

- The application will automatically open in your default browser
- If not, manually navigate to: `http://localhost:3000`

## What You'll See

Once running, the TalentFlow application will:
- ✅ Display a jobs board with job listings
- ✅ Show candidate profiles and lists
- ✅ Allow you to manage assessments
- ✅ All data is stored locally in your browser using IndexedDB

## Features

- **Jobs Board**: View and manage job postings
- **Candidate Tracking**: Track candidates through different hiring stages
- **Assessment Builder**: Create and manage candidate assessments
- **Local Data Storage**: All data persists in your browser's IndexedDB

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you'll see a prompt to use a different port. Press `Y` to accept.

### Clear Browser Cache

If you experience issues, clear your browser's IndexedDB:
1. Open Browser DevTools (F12)
2. Go to Application tab
3. Expand "IndexedDB"
4. Right-click on "TalentFlowDB" and select "Clear"

### Reinstall Dependencies

If you encounter module errors:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` folder that can be deployed to any static hosting service.

