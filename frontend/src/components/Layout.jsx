import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Briefcase, Users, FileText } from 'lucide-react';
import { clearDB, seedDatabase } from '../utils/db';

const Layout = () => {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <nav className="shadow-sm" style={{ background: 'hsl(var(--card))', borderBottom: '1px solid', borderColor: 'hsl(var(--border))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
                  TalentFlow
                </h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <NavLink
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={({ isActive }) => ({
                    background: isActive ? 'hsl(var(--accent))' : 'transparent',
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--secondary-foreground))'
                  })}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Jobs
                </NavLink>
                <NavLink
                  to="/candidates"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={({ isActive }) => ({
                    background: isActive ? 'hsl(var(--accent))' : 'transparent',
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--secondary-foreground))'
                  })}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Candidates
                </NavLink>
              </div>
            </div>
            {/* Dev-only reseed control (visible in development builds) */}
            <div className="flex items-center">
              {process.env.NODE_ENV !== 'production' && (
                <ReseedControl />
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;


function ReseedControl() {
  const [running, setRunning] = useState(false);

  const handleReseed = async () => {
    if (!confirm('Clear local DB and reseed sample data? This will remove local changes.')) return;
    try {
      setRunning(true);
      await clearDB();
      await seedDatabase();
      
      window.location.reload();
    } catch (err) {
      console.error('Reseed failed', err);
      alert('Reseed failed — check console');
    } finally {
      setRunning(false);
    }
  };

  return (
    <button
      onClick={handleReseed}
      disabled={running}
      className="ml-4 inline-flex items-center px-3 py-1.5 border border-red-200 text-sm rounded-md text-red-700 bg-red-50 hover:bg-red-100"
      title="Dev: clear local DB and reseed data"
    >
      {running ? 'Reseeding...' : 'Reseed DB'}
    </button>
  );
}
