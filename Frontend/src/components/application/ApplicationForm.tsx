// src/components/application/ApplicationForm.tsx
// chuyển hướng đi lên xuốngxuống
import React, { useState } from 'react';
import { FormData } from '../../types';
import CombinedForm from './CombinedForm';
import Step4_UploadDocuments from './Step4_UploadDocuments';
import Step5_ReviewAndSubmit from './Step5_ReviewAndSubmit';
import '../../styles.css';

interface ApplicationFormProps {
  setPage: (page: string) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ setPage }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    school: '',
    major: '',
    examCombination: '',
    personalInfo: { name: '', dateOfBirth: '', address: '' , phone:'', cccd:'', ethnicity:'', gender:''},
    scores: {},
    priorityCategories: [],
    documents: []
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFormSubmit = async () => {
    try {
      console.log('Đang gửi hồ sơ:', formData);
      // Giả lập gửi dữ liệu đến server, thay bằng API thực tế nếu cần
      // Ví dụ: await api.submitApplication(formData);
      console.log('Hồ sơ đã được gửi thành công');
      setPage('status');
    } catch (error) {
      console.error('Lỗi khi gửi hồ sơ:', error);
      // Có thể thêm thông báo lỗi cho người dùng nếu cần
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <CombinedForm setFormData={setFormData} nextStep={nextStep} />;
      case 2:
        return (
          <Step4_UploadDocuments
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Step5_ReviewAndSubmit
            formData={formData}
            prevStep={prevStep}
            submitForm={handleFormSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="application-form">
      {renderStep()}
    </div>
  );
};

export default ApplicationForm;