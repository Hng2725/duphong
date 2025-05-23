// src/components/application/ApplicationForm.tsx
// chuyển hướng đi lên xuốngxuống
import React, { useState, useEffect } from "react";
import { FormData, FormDataSetter } from "../../types";
import CombinedForm from "./CombinedForm";
import Step4_UploadDocuments from "../../pages/Step4_UploadDocuments";
import Step5_ReviewAndSubmit from "../../pages/Step5_ReviewAndSubmit";
import "../../styles.css";

interface ApplicationFormProps {
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
  setFormData: FormDataSetter;
  nextStep: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  setPage,
  currentUser,
  setFormData,
  nextStep,
}) => {
  const [step, setStep] = useState(1);
  const [formDataState, setFormDataState] = useState<FormData>({
    school: "",
    major: "",
    examCombination: "",
    personalInfo: {
      name: currentUser || "",
      dateOfBirth: "",
      address: "",
      phone: "",
      cccd: "",
      ethnicity: "",
      gender: "",
    },
    scores: {},
    transcriptScores: {
      semester1Grade12: {
        math: "",
        literature: "",
        english: "",
        physics: "",
        chemistry: "",
        biology: "",
      },
      semester2Grade12: {
        math: "",
        literature: "",
        english: "",
        physics: "",
        chemistry: "",
        biology: "",
      },
      semester1Grade11: {
        math: "",
        literature: "",
        english: "",
        physics: "",
        chemistry: "",
        biology: "",
      },
      semester2Grade11: {
        math: "",
        literature: "",
        english: "",
        physics: "",
        chemistry: "",
        biology: "",
      },
    },
    priorityCategories: [],
    documents: [],
    documents2: [],
    documents3: [],
    status: "Chờ duyệt",
    submissionDate: new Date().toLocaleDateString(),
  });

  useEffect(() => {
    if (currentUser) {
      setFormDataState((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          name: currentUser,
        },
      }));
    }
  }, [currentUser]);

  const prevStep = () => setStep(step - 1);

  const handleFormSubmit = async (): Promise<{ status: string }> => {
    try {
      console.log("Submitting form data:", formDataState);
      setFormData(formDataState);
      nextStep();
      return { status: "success" };
    } catch (error) {
      console.error("Error submitting form:", error);
      return { status: "error" };
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CombinedForm
            setFormData={setFormDataState}
            nextStep={() => setStep(step + 1)}
            setPage={setPage}
            currentUser={currentUser}
          />
        );
      case 2:
        return (
          <Step4_UploadDocuments
            formData={formDataState}
            setFormData={setFormDataState}
            nextStep={() => setStep(step + 1)}
            prevStep={prevStep}
            setPage={setPage}
            currentUser={currentUser}
          />
        );
      case 3:
        return (
          <Step5_ReviewAndSubmit
            formData={formDataState}
            prevStep={prevStep}
            submitForm={handleFormSubmit}
            setPage={setPage}
            currentUser={currentUser}
            setApplicationData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return <div className="application-form">{renderStep()}</div>;
};

export default ApplicationForm;
