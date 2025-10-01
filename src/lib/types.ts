export type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  profilePicture?: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  id:string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
};

export type Skill = {
  id: string;
  name: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
};
