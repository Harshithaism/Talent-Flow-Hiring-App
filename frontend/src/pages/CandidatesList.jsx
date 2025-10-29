import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import db from '../utils/db';

const STAGE_COLORS = {
  applied: { background: 'hsl(210 100% 96%)', color: 'hsl(210 90% 40%)' },
  screen: { background: 'hsl(45 100% 94%)', color: 'hsl(45 90% 35%)' },
  tech: { background: 'hsl(270 100% 96%)', color: 'hsl(270 70% 30%)' },
  offer: { background: 'hsl(140 70% 96%)', color: 'hsl(140 60% 30%)' },
  hired: { background: 'hsl(150 70% 96%)', color: 'hsl(150 60% 30%)' },
  rejected: { background: 'hsl(0 75% 96%)', color: 'hsl(0 75% 30%)' }
};

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [search, stageFilter, candidates]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      
      const allCandidates = await db.candidates.toArray();
      allCandidates.sort((a, b) => {
        const ta = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
        const tb = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
        return tb - ta; 
      });
      setCandidates(allCandidates);
      setFilteredCandidates(allCandidates);
    } catch (error) {
      toast.error('Failed to fetch candidates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = [...candidates];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower)
      );
    }

    if (stageFilter) {
      filtered = filtered.filter((c) => c.stage === stageFilter);
    }

    setFilteredCandidates(filtered);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
        <p className="text-slate-600 mt-1">Total: {filteredCandidates.length} candidates</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Stages</option>
          <option value="applied">Applied</option>
          <option value="screen">Screen</option>
          <option value="tech">Tech</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-slate-500">No candidates found</p>
        </div>
      ) : (
        <div style={{ background: 'hsl(var(--card))' }} className="rounded-lg shadow-sm p-4 max-h-[600px] overflow-y-auto">
          {filteredCandidates.map((candidate) => (
            <Link key={candidate.id} to={`/candidates/${candidate.id}`}>
              <Card className="candidate-card mb-2" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'hsl(var(--primary))' }}>
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{candidate.name}</CardTitle>
                        <CardDescription className="text-sm">{candidate.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: 'hsl(var(--secondary-foreground))' }}>{candidate.jobTitle}</span>
                      <Badge style={STAGE_COLORS[candidate.stage]}>
                        {candidate.stage}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidatesList;
