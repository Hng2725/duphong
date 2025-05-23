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
  transcriptScores: {
    semester1Grade12: {
      math: string;
      literature: string;
      english: string;
      physics: string;
      chemistry: string;
      biology: string;
    };
    semester2Grade12: {
      math: string;
      literature: string;
      english: string;
      physics: string;
      chemistry: string;
      biology: string;
    };
    semester1Grade11: {
      math: string;
      literature: string;
      english: string;
      physics: string;
      chemistry: string;
      biology: string;
    };
    semester2Grade11: {
      math: string;
      literature: string;
      english: string;
      physics: string;
      chemistry: string;
      biology: string;
    };
  };
  priorityCategories: string[];
  documents: File[];
  documents2: File[];
  documents3: File[];
  status: string;
  submissionDate: string;
}

export type FormDataSetter = (
  data: FormData | ((prev: FormData | null) => FormData)
) => void;

export type SemesterKey = keyof FormData["transcriptScores"];
export type SubjectKey = keyof FormData["transcriptScores"]["semester1Grade12"];
