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

  // Update parent's formData whenever local state changes
  useEffect(() => {
    console.log("Updating parent formData:", formDataState);
    setFormData(formDataState);
  }, [formDataState, setFormData]);

  // Update local state when currentUser changes
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
      console.log("Starting form submission with data:", formDataState);

      // Validate required fields
      if (
        !formDataState.school ||
        !formDataState.major ||
        !formDataState.examCombination
      ) {
        console.error("Missing required fields:", {
          school: formDataState.school,
          major: formDataState.major,
          examCombination: formDataState.examCombination,
        });
        return { status: "error" };
      }

      // Validate user
      if (!currentUser) {
        console.error("No current user found");
        return { status: "error" };
      }

      // Create updated form data
      const updatedFormData = {
        ...formDataState,
        status: "Chờ duyệt",
        submissionDate: new Date().toLocaleDateString(),
        personalInfo: {
          ...formDataState.personalInfo,
          name: currentUser,
        },
      };

      console.log("Prepared form data for submission:", updatedFormData);

      // Update both local and parent state
      setFormDataState(updatedFormData);
      setFormData(updatedFormData);

      // Call nextStep to trigger the parent's submission logic
      nextStep();

      console.log("Form submitted successfully");
      return { status: "success" };
    } catch (error) {
      console.error("Error in form submission:", error);
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
