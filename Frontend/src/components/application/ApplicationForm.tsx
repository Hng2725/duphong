// src/components/application/ApplicationForm.tsx
// chuyển hướng đi lên xuốngxuống
import React, { useState } from "react";
import { FormData } from "../../types";
import CombinedForm from "./CombinedForm";
import Step4_UploadDocuments from "./Step4_UploadDocuments";
import Step5_ReviewAndSubmit from "./Step5_ReviewAndSubmit";
import "../../styles.css";

interface ApplicationFormProps {
  setPage: (page: string) => void;
  currentUser: string | null;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  setPage,
  currentUser,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    school: "",
    major: "",
    examCombination: "",
    personalInfo: {
      name: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      cccd: "",
      ethnicity: "",
      gender: "",
    },
    scores: {},
    priorityCategories: [],
    documents: [],
    documents2: [],
    documents3: [],
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFormSubmit = async (): Promise<{ status: string }> => {
    try {
      console.log("Đang gửi hồ sơ:", formData);
      // Giả lập gửi dữ liệu đến server, thay bằng API thực tế nếu cần
      // Ví dụ: await api.submitApplication(formData);
      console.log("Hồ sơ đã được gửi thành công");
      setPage("status");
      return { status: "success" };
    } catch (error) {
      console.error("Lỗi khi gửi hồ sơ:", error);
      // Có thể thêm thông báo lỗi cho người dùng nếu cần
      return { status: "error" };
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CombinedForm
            setFormData={setFormData}
            nextStep={nextStep}
            setPage={setPage}
            currentUser={currentUser}
          />
        );
      case 2:
        return (
          <Step4_UploadDocuments
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            setPage={setPage}
            currentUser={currentUser}
          />
        );
      case 3:
        return (
          <Step5_ReviewAndSubmit
            formData={formData}
            prevStep={prevStep}
            submitForm={handleFormSubmit}
            setPage={setPage}
            currentUser={currentUser} setApplicationData={function (data: FormData & { status: string; }): void {
              throw new Error("Function not implemented.");
            } }          />
        );
      default:
        return null;
    }
  };

  return <div className="application-form">{renderStep()}</div>;
};

export default ApplicationForm;
