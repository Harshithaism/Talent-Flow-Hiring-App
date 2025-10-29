import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import db from '../utils/db';
import { format } from 'date-fns';

const STAGE_COLORS = {
  applied: { background: 'hsl(210 100% 96%)', color: 'hsl(210 90% 40%)' },
  screen: { background: 'hsl(45 100% 94%)', color: 'hsl(45 90% 35%)' },
  tech: { background: 'hsl(270 100% 96%)', color: 'hsl(270 70% 30%)' },
  offer: { background: 'hsl(140 70% 96%)', color: 'hsl(140 60% 30%)' },
  hired: { background: 'hsl(150 70% 96%)', color: 'hsl(150 60% 30%)' },
  rejected: { background: 'hsl(0 75% 96%)', color: 'hsl(0 75% 30%)' }
};

const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidateData();
  }, [id]);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      const [candidateData, timelineData] = await Promise.all([
        db.candidates.get(id),
        db.candidateTimeline.where('candidateId').equals(id).reverse().sortBy('timestamp')
      ]);

      setCandidate(candidateData);
      setTimeline(timelineData);
    } catch (error) {
      toast.error('Failed to fetch candidate data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 mx-auto" style={{ borderBottom: '2px solid hsl(var(--primary))' }}></div>
      </div>
    );
  }

  if (!candidate) {
    return <div>Candidate not found</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/candidates">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Candidates
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold" style={{ background: 'hsl(var(--primary))' }}>
                {candidate.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-2xl">{candidate.name}</CardTitle>
                <p className="text-slate-600 mt-1">{candidate.email}</p>
                <p className="text-sm text-slate-500 mt-1">{candidate.jobTitle}</p>
              </div>
            </div>
            <Badge style={STAGE_COLORS[candidate.stage]}>
              {candidate.stage}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((entry) => (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(var(--primary))' }}></div>
                  <div className="w-0.5 h-full" style={{ background: 'hsl(var(--border))', marginTop: '0.25rem' }}></div>
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-slate-900">{entry.details}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {format(new Date(entry.timestamp), 'PPpp')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateProfile;
