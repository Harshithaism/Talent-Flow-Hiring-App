import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Archive, GripVertical, FileText } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import db from '../utils/db';

const JobsBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobTags, setNewJobTags] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [search, statusFilter, page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let allJobs = await db.jobs.orderBy('order').toArray();

      
      if (search) {
        allJobs = allJobs.filter(job =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }

      if (statusFilter) {
        allJobs = allJobs.filter(job => job.status === statusFilter);
      }

      
      const total = allJobs.length;
      const pageSize = 10;
      const currentPage = parseInt(page);
      const start = (currentPage - 1) * pageSize;
      const paginatedJobs = allJobs.slice(start, start + pageSize);

      setJobs(paginatedJobs);
      setPagination({
        page: currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      });
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active';
    try {
      await db.jobs.update(jobId, { status: newStatus });
      toast.success(`Job ${newStatus === 'archived' ? 'archived' : 'unarchived'} successfully`);
      fetchJobs();
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleCreateJob = async () => {
    if (!newJobTitle.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      
      const last = await db.jobs.orderBy('order').last();
      const nextOrder = last ? last.order + 1 : 0;
      const id = `job-${Date.now()}`;
      const tags = newJobTags.split(',').map(t => t.trim()).filter(Boolean);
      const slug = generateSlug(newJobTitle);
      await db.jobs.add({ id, title: newJobTitle, slug, status: 'active', tags, order: nextOrder, createdAt: new Date().toISOString() });
      toast.success('Job created');
      setNewJobTitle('');
      setNewJobTags('');
      fetchJobs();
      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create job');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jobs Board</h1>
          <p className="text-slate-600 mt-1">Manage your job postings</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-accent shadow-md rounded-md px-4 py-2">
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Job</DialogTitle>
              <DialogDescription>Provide a title and optional comma-separated tags.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Job Title" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} />
              <Input placeholder="Tags (comma separated)" value={newJobTags} onChange={(e) => setNewJobTags(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setNewJobTitle(''); setNewJobTags(''); setCreateOpen(false); }}>
                Cancel
              </Button>
              <Button onClick={() => handleCreateJob(() => { })}>
                Create
              </Button>
            </DialogFooter>
            <DialogClose />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search jobs by title or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card key={job.id} className="job-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <GripVertical className="w-5 h-5 text-slate-400 mt-1 drag-handle" />
                      <div className="flex-1">
                        <Link to={`/jobs/${job.id}`}>
                          <CardTitle className="text-xl hover:text-primary transition-colors">
                            {job.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="mt-1">{job.slug}</CardDescription>
                        <div className="flex gap-2 mt-3">
                          {job.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                      <Link to={`/assessments/${job.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Manage Assessment"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleArchive(job.id, job.status)}
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobsBoard;
