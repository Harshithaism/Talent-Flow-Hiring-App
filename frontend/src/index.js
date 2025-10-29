import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { initializeDB, seedDatabase } from "./utils/db";


const initApp = async () => {
  const shouldSeed = await initializeDB();
  if (shouldSeed) {
    await seedDatabase();
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

initApp();
