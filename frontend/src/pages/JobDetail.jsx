import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const JobDetail = () => {
  const { jobId } = useParams();

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/jobs">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </Link>
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold">Job Detail: {jobId}</h1>
        <p className="text-slate-600 mt-4">Job details will be displayed here.</p>
      </div>
    </div>
  );
};

export default JobDetail;
