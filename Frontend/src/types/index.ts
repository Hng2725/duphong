export interface FormData {
  school: string;
  major: string;
  examCombination: string;
  personalInfo: {
    name: string;
    dateOfBirth: string;
    address: string;
    phone: string;
    cccd: string;
    ethnicity: string;
    gender: string;  
  };
  scores: {
    [subject: string]: number;
  };
  priorityCategories: string[];
  documents: File[];
  documents2: File[];
  documents3: File[];
}