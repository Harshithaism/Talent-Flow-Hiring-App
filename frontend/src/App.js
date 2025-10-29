import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import JobsBoard from './pages/JobsBoard';
import JobDetail from './pages/JobDetail';
import CandidatesList from './pages/CandidatesList';
import CandidateProfile from './pages/CandidateProfile';
import AssessmentBuilder from './pages/AssessmentBuilder';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/jobs" replace />} />
            <Route path="jobs" element={<JobsBoard />} />
            <Route path="jobs/:jobId" element={<JobDetail />} />
            <Route path="candidates" element={<CandidatesList />} />
            <Route path="candidates/:id" element={<CandidateProfile />} />
            <Route path="assessments/:jobId" element={<AssessmentBuilder />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
