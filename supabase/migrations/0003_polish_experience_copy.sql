-- Portfolio content polish: strengthen experience copy without inventing metrics.
-- Safe to run on existing data; rows are matched by company name.

update experiences
set
  role = 'Backend Developer',
  description = 'Backend Developer contributing to enterprise-scale government procurement platforms, with a focus on backend services, APIs, system integrations, and reliable data flows across interconnected services.',
  achievements = array[
    'Develop and maintain backend services supporting government procurement workflows and evolving business requirements.',
    'Build and maintain REST APIs used across enterprise applications and internal services.',
    'Work with existing services, PostgreSQL databases, and system integrations to implement backend functionality within a large-scale existing ecosystem.',
    'Investigate backend issues, trace data and service flows, and implement fixes with reliability and maintainability in mind.',
    'Collaborate with engineers across interconnected services to deliver changes safely while maintaining compatibility with existing systems.'
  ],
  technologies = array['Go', 'PostgreSQL', 'REST APIs', 'Backend Development', 'API Integration']
where lower(company) in ('pt. infomedia nusantara', 'infomedia', 'pt infomedia nusantara');

update experiences
set
  role = 'Backend Developer',
  description = 'Backend Developer focused on building and maintaining server-side applications, APIs, database-driven functionality, and system integrations for reliable web applications.',
  achievements = array[
    'Developed and maintained server-side application logic supporting web application functionality and business requirements.',
    'Designed, implemented, and maintained REST APIs and backend services for communication between client applications and server-side systems.',
    'Designed and maintained PostgreSQL data structures and queries to support reliable application data storage and retrieval.',
    'Integrated backend applications with internal and external services while maintaining consistent data flows between systems.',
    'Diagnosed application issues, debugged existing functionality, and implemented fixes to maintain backend stability and reliability.',
    'Collaborated with developers and stakeholders throughout the software development lifecycle, from requirement analysis and implementation to testing and maintenance.'
  ],
  technologies = array['PHP', 'Laravel', 'PostgreSQL', 'REST APIs', 'API Integration', 'JavaScript', 'Git']
where lower(company) in ('pt. sigma cipta caraka (telkomsigma)', 'pt. sigma cipta caraka', 'telkomsigma');
