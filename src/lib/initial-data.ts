import type { ResumeData } from './types';

export const initialData: ResumeData = {
  personalInfo: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '123-456-7890',
    address: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/janedoe',
    website: 'https://janedoe.dev',
    profilePicture: 'https://picsum.photos/seed/pfp/200/200',
  },
  experience: [
    {
      id: 'exp1',
      company: 'Tech Solutions Inc.',
      role: 'Senior Software Engineer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description:
        '- Led the development of a new client-facing dashboard using React and TypeScript, improving user engagement by 25%.\n- Architected and implemented a scalable microservices backend with Node.js, reducing server response time by 40%.\n- Mentored junior engineers, conducting code reviews and promoting best practices.',
    },
    {
      id: 'exp2',
      company: 'Innovate LLC',
      role: 'Software Engineer',
      startDate: 'Jun 2017',
      endDate: 'Dec 2019',
      description:
        '- Contributed to a mobile application for iOS and Android using React Native, which acquired over 100,000 downloads.\n- Worked in an Agile team to deliver new features and bug fixes on a bi-weekly sprint cycle.',
    },
  ],
  education: [
    {
      id: 'edu1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      startDate: 'Sep 2013',
      endDate: 'May 2017',
    },
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript' },
    { id: 'skill2', name: 'TypeScript' },
    { id: 'skill3', name: 'React' },
    { id: 'skill4', name: 'Node.js' },
    { id: 'skill5', name: 'SQL' },
    { id: 'skill6', name: 'Cloud Services (AWS, GCP)' },
  ],
};
