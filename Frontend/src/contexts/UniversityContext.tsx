import React, { createContext, useState, useContext, ReactNode } from "react";

export interface University {
  id: number;
  name: string;
  code: string;
  majors: string[];
  examCombinations: string[]; // Mã các tổ hợp xét tuyển của trường
}

export interface ExamCombination {
  id: number;
  code: string;
  subjects: string[];
  description: string;
}

interface UniversityContextType {
  universities: University[];
  setUniversities: (universities: University[]) => void;
  examCombinations: ExamCombination[];
  setExamCombinations: (combinations: ExamCombination[]) => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(
  undefined
);

export const UniversityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Khởi tạo state với dữ liệu từ localStorage hoặc mảng rỗng
  const [universities, setUniversities] = useState<University[]>(() => {
    const savedUniversities = localStorage.getItem("universities");
    return savedUniversities ? JSON.parse(savedUniversities) : [];
  });

  const [examCombinations, setExamCombinations] = useState<ExamCombination[]>(
    () => {
      const savedCombinations = localStorage.getItem("examCombinations");
      return savedCombinations ? JSON.parse(savedCombinations) : [];
    }
  );

  // Lưu vào localStorage khi có thay đổi
  React.useEffect(() => {
    localStorage.setItem("universities", JSON.stringify(universities));
  }, [universities]);

  React.useEffect(() => {
    localStorage.setItem("examCombinations", JSON.stringify(examCombinations));
  }, [examCombinations]);

  return (
    <UniversityContext.Provider
      value={{
        universities,
        setUniversities,
        examCombinations,
        setExamCombinations,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversity = () => {
  const context = useContext(UniversityContext);
  if (context === undefined) {
    throw new Error("useUniversity must be used within a UniversityProvider");
  }
  return context;
};
