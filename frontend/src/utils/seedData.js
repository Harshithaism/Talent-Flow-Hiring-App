export const jobTitles = [
  'Senior Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Product Manager',
  'UX Designer',
  'Data Scientist',
  'Machine Learning Engineer',
  'QA Engineer',
  'Technical Writer',
  'Mobile Developer',
  'Cloud Architect',
  'Security Engineer',
  'Business Analyst',
  'Scrum Master',
  'React Native Developer',
  'Python Developer',
  'Java Developer',
  'Database Administrator',
  'Site Reliability Engineer',
  'Sales Engineer',
  'Customer Success Manager',
  'Marketing Manager',
  'HR Specialist',
  'Finance Analyst'
];

export const tags = [
  ['JavaScript', 'React', 'Node.js'],
  ['Python', 'Django', 'PostgreSQL'],
  ['TypeScript', 'Vue', 'GraphQL'],
  ['Kubernetes', 'Docker', 'AWS'],
  ['Product', 'Agile', 'Strategy'],
  ['Figma', 'Adobe XD', 'UI/UX'],
  ['Python', 'TensorFlow', 'ML'],
  ['PyTorch', 'Deep Learning', 'AI'],
  ['Automation', 'Testing', 'Selenium'],
  ['Documentation', 'API', 'Technical'],
  ['React Native', 'iOS', 'Android'],
  ['AWS', 'Azure', 'GCP'],
  ['Security', 'Penetration Testing', 'OWASP'],
  ['Analytics', 'SQL', 'Excel'],
  ['Agile', 'Scrum', 'Jira'],
  ['React Native', 'Mobile', 'Cross-platform'],
  ['Python', 'Flask', 'FastAPI'],
  ['Java', 'Spring Boot', 'Microservices'],
  ['SQL', 'NoSQL', 'Database Design'],
  ['Monitoring', 'Logging', 'Incident Response'],
  ['Sales', 'Technical', 'B2B'],
  ['Customer Support', 'Onboarding', 'Success'],
  ['Marketing', 'Growth', 'Analytics'],
  ['HR', 'Recruiting', 'People Ops'],
  ['Finance', 'Budgeting', 'Forecasting']
];

export const firstNames = [
  'Aarav', 'Vivaan', 'Advik', 'Arjun', 'Ishaan', 'Vihaan', 'Sai', 'Krishna',
  'Rahul', 'Rohan', 'Karan', 'Vikram', 'Aakash', 'Ravi', 'Ankit',
  'Siddharth', 'Manish', 'Amit', 'Saurabh', 'Nikhil', 'Pranav', 'Kunal',
  'Harsh', 'Divya', 'Neha', 'Priya', 'Ananya', 'Isha', 'Ayesha', 'Sneha'
];

export const lastNames = [
  'Singh', 'Kumar', 'Sharma', 'Verma', 'Patel', 'Gupta', 'Reddy', 'Choudhary',
  'Nair', 'Menon', 'Iyer', 'Rao', 'Jain', 'Kapoor', 'Malhotra',
  'Desai', 'Bhat', 'Shetty', 'Bose', 'Ghosh', 'Chatterjee', 'Mukherjee',
  'Das', 'Saxena', 'Joshi', 'Mehta', 'Srivastava', 'Naik', 'Dutta', 'Khan'
];

export const stages = [
  'applied',
  'screen',
  'tech',
  'offer',
  'hired',
  'rejected'
];

export const generateSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

export const generateJobs = (count = 25) => {
  const jobs = [];
  for (let i = 0; i < count; i++) {
    const title = jobTitles[i];
    jobs.push({
      id: `job-${i + 1}`,
      title,
      slug: generateSlug(title),
      status: i < 18 ? 'active' : 'archived',
      tags: tags[i],
      order: i,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  return jobs;
};

export const generateCandidates = (jobs, count = 1000) => {
  const candidates = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
    
    candidates.push({
      id: `candidate-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      stage: stages[Math.floor(Math.random() * stages.length)],
      jobId: randomJob.id,
      jobTitle: randomJob.title,
      appliedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      notes: []
    });
  }
  return candidates;
};

export const generateAssessment = (jobId, jobTitle) => {
  return {
    jobId,
    jobTitle,
    sections: [
      {
        id: `section-1`,
        title: 'Technical Skills',
        questions: [
          {
            id: `q1`,
            type: 'single-choice',
            question: 'What is your experience level?',
            required: true,
            options: ['Junior (0-2 years)', 'Mid-level (2-5 years)', 'Senior (5+ years)']
          },
          {
            id: `q2`,
            type: 'multi-choice',
            question: 'Which technologies are you proficient in?',
            required: true,
            options: ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust']
          },
          {
            id: `q3`,
            type: 'short-text',
            question: 'What is your GitHub username?',
            required: false,
            maxLength: 50
          }
        ]
      },
      {
        id: `section-2`,
        title: 'Problem Solving',
        questions: [
          {
            id: `q4`,
            type: 'long-text',
            question: 'Describe a challenging technical problem you solved recently.',
            required: true,
            maxLength: 500
          },
          {
            id: `q5`,
            type: 'numeric',
            question: 'How many years of professional experience do you have?',
            required: true,
            min: 0,
            max: 50
          }
        ]
      },
      {
        id: `section-3`,
        title: 'Additional Information',
        questions: [
          {
            id: `q6`,
            type: 'single-choice',
            question: 'Are you available for immediate joining?',
            required: true,
            options: ['Yes', 'No', 'Within 2 weeks', 'Within a month']
          },
          {
            id: `q7`,
            type: 'file-upload',
            question: 'Upload your resume (PDF format)',
            required: false
          }
        ]
      }
    ]
  };
};
