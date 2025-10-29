import Dexie from 'dexie';
import { generateJobs, generateCandidates, generateAssessment } from './seedData';

const db = new Dexie('TalentFlowDB');

db.version(1).stores({
  jobs: 'id, title, slug, status, order',
  candidates: 'id, name, email, stage, jobId',
  assessments: 'jobId',
  candidateResponses: 'id, candidateId, assessmentId',
  candidateTimeline: 'id, candidateId, timestamp'
});

export const initializeDB = async () => {
  try {
    const jobsCount = await db.jobs.count();
    if (jobsCount === 0) {
      console.log('Initializing database with seed data...');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing DB:', error);
    return false;
  }
};

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    const jobs = generateJobs(25);
    console.log(`Generated ${jobs.length} jobs`);
    await db.jobs.bulkAdd(jobs);
    console.log('Jobs added to database');
    
    const candidates = generateCandidates(jobs, 1000);
    console.log(`Generated ${candidates.length} candidates`);
    await db.candidates.bulkAdd(candidates);
    console.log('Candidates added to database');
    
    
    for (let i = 0; i < 5; i++) {
      const assessment = generateAssessment(jobs[i].id, jobs[i].title);
      await db.assessments.put(assessment);
    }
    console.log('Assessments added to database');
    
    
    const timelineEntries = candidates.map((c, i) => ({
      id: `timeline-init-${i}`,
      candidateId: c.id,
      action: 'created',
      stage: c.stage,
      timestamp: c.appliedAt,
      details: `Applied for ${c.jobTitle}`
    }));
    await db.candidateTimeline.bulkAdd(timelineEntries);
    console.log('Timeline entries added to database');
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error, error.stack);
  }
};

export const clearDB = async () => {
  await db.jobs.clear();
  await db.candidates.clear();
  await db.assessments.clear();
  await db.candidateResponses.clear();
  await db.candidateTimeline.clear();
};

export default db;
