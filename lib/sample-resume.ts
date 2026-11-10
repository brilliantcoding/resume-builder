import { ResumeData } from '@/types/resume'

export const sampleResume: ResumeData = {
  personalInfo: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alexmorgan.design',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    jobTitle: 'Senior Product Designer',
  },
  summary:
    'Senior Product Designer with 8+ years of experience shipping consumer products used by millions. I pair user research with systems thinking to turn ambiguous problems into simple, elegant interfaces. Passionate about design systems, accessibility, and mentoring.',
  experience: [
    {
      id: 's1',
      company: 'Streamline Labs',
      position: 'Senior Product Designer',
      startDate: 'Jan 2021',
      endDate: '',
      current: true,
      description: 'Lead designer for the analytics suite (2M+ MAU).',
      bullets: [
        'Redesigned the onboarding flow, lifting activation by 23% and cutting time-to-value from 12 to 4 minutes',
        'Built and maintain a 180-component design system adopted by 6 product teams',
        'Run monthly usability studies; shipped 14 research-backed improvements in 2025',
      ],
    },
    {
      id: 's2',
      company: 'Northwind Studio',
      position: 'Product Designer',
      startDate: 'Jun 2017',
      endDate: 'Dec 2020',
      current: false,
      description: 'Designed B2B dashboards and mobile apps for fintech clients.',
      bullets: [
        'Led end-to-end redesign of a payments dashboard, reducing support tickets by 31%',
        'Prototyped and user-tested 3 concepts per sprint with engineers and PMs',
      ],
    },
  ],
  education: [
    {
      id: 'se1',
      institution: 'Rhode Island School of Design',
      degree: 'BFA',
      field: 'Graphic Design',
      startDate: '2013',
      endDate: '2017',
      gpa: '3.8',
      honors: 'Distinction, AIGA Student Board',
    },
  ],
  skills: [
    { id: 'sg1', category: 'Design', skills: ['Product Strategy', 'Design Systems', 'Interaction Design', 'Figma', 'Prototyping'] },
    { id: 'sg2', category: 'Research', skills: ['Usability Testing', 'Journey Mapping', 'A/B Testing'] },
    { id: 'sg3', category: 'Engineering', skills: ['HTML/CSS', 'React basics', 'Design Tokens'] },
  ],
  projects: [
    {
      id: 'sp1',
      name: 'Atlas Design System',
      description: 'Open-source component library with 40+ accessible React components and full Figma parity.',
      technologies: ['React', 'TypeScript', 'Figma API'],
      url: 'atlas.alexmorgan.design',
      github: 'github.com/alexmorgan/atlas',
    },
  ],
  certifications: [
    { id: 'sc1', name: 'Google UX Design Professional', issuer: 'Coursera', date: '2022' },
  ],
}
