// All site content lives here. Search for TODO to find the items still to confirm or fill in.

export const profile = {
  name: 'Nilesh K',
  title: 'Member of Technical Staff, QA',
  company: 'Hippo Video',
  since: 'Aug 2026', // TODO: confirm start year
  roles: ['Member of Technical Staff, QA', 'Software Engineer', 'API Automation Engineer'],
  pitch:
    'I test products to break them, and I build full-stack apps, AI tools and DevOps automation to keep them reliable.',
  email: 'nileshkrishnamurthy@gmail.com',
  linkedin: 'https://linkedin.com/in/nileshkrishnamurthy',
  github: 'https://github.com/Nilesh248004',
};

// A big number (or short word) with a label under it. Numbers count up when scrolled into view.
export type Stat = { value: number | string; suffix?: string; label: string };

export type Project = {
  slug: string;
  title: string;
  short: string;
  result?: string;
  tags: string[];
  wide?: boolean;
  tone: 'blue' | 'plain' | 'cyan';
  bullets?: string[];
  problem: string;
  approach: string[];
  highlights: string[];
  stats?: Stat[]; // optional row of key facts shown under the project title
  stack: string[];
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: 'qa-at-hippo-video',
    title: 'QA Work at Hippo Video',
    short: '',
    tags: ['QA', 'Karate', 'API testing'],
    wide: true,
    tone: 'blue',
    bullets: [
      'Piloted the onboarding of big-brand hotels.',
      'Automated proposal templates.',
      'Completed end-to-end API automation with Karate, validating the schemas of both requests and responses.',
    ],
    problem:
      'Quality for a video platform used by hotels depends on every API behaving the same way, release after release, and on new enterprise customers getting a smooth start.',
    approach: [
      'Piloted the onboarding of big-brand hotels.',
      'Automated proposal templates.',
      'Built complete API automation with Karate, checking the schema of every request and response.',
    ],
    // TODO: add measurable results here and a "Highlights" card appears on the project page automatically,
    // e.g. 'Automated N APIs with Karate', 'Cut proposal creation from X to Y', 'Onboarded N hotels in the pilot'.
    highlights: [],
    // TODO: add real numbers to show a stat row on this page, e.g.
    // stats: [{ value: 120, label: 'APIs covered by Karate automation' }, { value: 5, label: 'Hotels onboarded in the pilot' }],
    stack: ['Karate', 'API testing', 'JSON schema validation'],
  },
  {
    slug: 'redis-cluster-lifecycle-tool',
    title: 'Redis Cluster Lifecycle Tool',
    short:
      'One-command provisioning, scaling, rolling upgrades and rollback of a six-node cluster, with an availability monitor running throughout.',
    result: 'Zero data loss on scale-in',
    tags: ['Bash', 'Ansible', 'Docker'],
    tone: 'plain',
    problem:
      'Operating a distributed Redis cluster by hand over SSH is slow and error-prone, especially during upgrades and scaling.',
    approach: [
      'Built a modular Bash CLI and Ansible playbooks that provision, scale, upgrade and roll back a six-node Redis Cluster running in Docker/Podman containers.',
      'Designed a zero-downtime rolling upgrade that upgrades replica nodes first, then triggers a controlled master failover.',
      'Added safe scale-out and scale-in with automatic slot migration before a node is removed.',
    ],
    highlights: [
      'Idempotent, single-command workflows verified against 1,000 seeded deterministic test keys.',
      'A continuous availability monitor verifies read continuity throughout upgrades.',
      'Zero data loss on scale-in, with structured timestamped logging for full traceability.',
    ],
    stats: [
      { value: 6, suffix: '-node', label: 'Redis cluster automated with zero-downtime upgrades' },
      { value: 1000, label: 'Seeded test keys used to verify every cluster operation' },
      { value: 0, label: 'Data lost on scale-in, because slots migrate before a node is removed' },
    ],
    stack: ['Bash', 'Ansible', 'Docker', 'Podman', 'Redis Cluster'],
  },
  {
    slug: 'nl-to-sql-to-nl',
    title: 'NL to SQL to NL',
    short:
      'Ask in plain English, get a query run on a live database and a readable answer streamed back, with graceful fallbacks for ambiguous questions.',
    result: 'Streams answers live',
    tags: ['MCP', 'SSE'],
    tone: 'plain',
    problem:
      'Non-technical users need answers from a database without writing SQL, and LLM responses can feel slow without feedback.',
    approach: [
      'Built a query system on the Model Context Protocol that converts natural language to SQL, runs it on a live relational database and returns a human-readable answer.',
      'Split it into two independently deployable services: the backend API on Render and the frontend on Vercel.',
      'Streamed the LLM response progressively with Server-Sent Events.',
    ],
    highlights: [
      'Progressive streaming improves perceived performance under variable latency.',
      'Graceful fallback logic for ambiguous queries and schema mismatches.',
      'Fault-tolerant, independently deployable architecture.',
    ],
    stats: [
      { value: 2, label: 'Independently deployable services: API on Render, frontend on Vercel' },
      { value: 'SSE', label: 'Server-Sent Events stream the answer as it is generated' },
      { value: 'MCP', label: 'Built on the Model Context Protocol, running queries on a live database' },
    ],
    stack: ['MCP', 'SSE', 'SQL', 'Render', 'Vercel'],
  },
  {
    slug: 'ai-student-dropout-copilot',
    title: 'AI Student Dropout Copilot',
    short:
      'A web platform that lets faculty spot at-risk students through real-time dropout risk scores. Threshold alerts replaced manual spreadsheets, and models can be retrained each semester without touching the frontend.',
    result: 'Intervention time: days to seconds',
    tags: ['ReactJS', 'Python', 'PostgreSQL', 'Machine learning'],
    wide: true,
    tone: 'cyan',
    problem:
      'Faculty found out about at-risk students too late because the process relied on manual spreadsheets.',
    approach: [
      'Architected a multi-tier system: ReactJS frontend, Python backend and a PostgreSQL relational database, taken from problem statement to production deployment.',
      'Implemented a real-time alert pipeline driven by risk-score thresholds, replacing the spreadsheet workflow.',
      'Designed the ML integration so risk models can be retrained every semester without frontend or pipeline changes.',
    ],
    highlights: [
      'Reduced intervention time from days to seconds.',
      'Delivered measurable impact to real faculty users.',
      'Built for scalability and low maintenance overhead.',
    ],
    stats: [
      { value: 3, suffix: '-tier', label: 'ReactJS frontend, Python backend and PostgreSQL database' },
      { value: 'Seconds', label: 'Intervention time, down from days with manual spreadsheets' },
      { value: 0, label: 'Frontend or pipeline changes needed to retrain the risk model each semester' },
    ],
    stack: ['ReactJS', 'Python', 'PostgreSQL', 'Machine learning'],
  },
];

export const experience = [
  {
    title: 'Member of Technical Staff, QA',
    org: 'Hippo Video',
    when: 'Aug 2026 – Present',
    note: 'See the QA work above.',
  },
  {
    title: 'B.E. Electronics and Communication Engineering',
    org: 'Bannari Amman Institute of Technology, Sathyamangalam',
    when: '2022 – 2026',
    note: 'CGPA 7.74',
  },
  {
    title: 'Higher Secondary Certificate (12th)',
    org: 'International Community School & Junior College, Kotagiri',
    when: '2021 – 2022',
    note: '66.7%',
  },
];

export const skills: { group: string; items: string[]; featured?: boolean }[] = [
  { group: 'Testing', items: ['STLC', 'Test case writing', 'Bug life cycle', 'Manual testing', 'Functional testing'], featured: true },
  { group: 'Languages', items: ['Java', 'Python', 'C', 'JavaScript'] },
  { group: 'Web and frameworks', items: ['ReactJS', 'HTML', 'CSS', 'Node.js', 'Express.js', 'REST APIs'] },
  { group: 'DevOps and CI/CD', items: ['Docker', 'Jenkins', 'Ansible', 'CI/CD pipelines', 'Bash', 'YAML', 'Linux'] },
  { group: 'Databases', items: ['PostgreSQL', 'MySQL'] },
  { group: 'AI and ML', items: ['Scikit-learn', 'Matplotlib', 'RAG', 'Agentic AI', 'MCP'] },
  { group: 'Tools and platforms', items: ['Git', 'GitHub', 'Postman', 'Vercel', 'Render'] },
  { group: 'CS fundamentals', items: ['Data structures', 'Algorithms', 'OOP'] },
];
