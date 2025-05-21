import React from 'react';
import { FormData } from '../../types';
import CommonLayout from './CommonLayout';
import '../../styles.css';

interface Step4Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  nextStep: () => void;
  prevStep: () => void;
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
}

const Step4_UploadDocuments: React.FC<Step4Props> = ({ 
  formData, 
  setFormData, 
  nextStep, 
  prevStep,
  setPage,
  currentUser
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newDocuments = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, documents: newDocuments }));
    }
  };

  return (
  <CommonLayout setPage={setPage} currentUser={currentUser} activePage="apply">
    <div className="form-step">
      <h2>Tải lên minh chứng</h2>
      <div className="form-group">
        <label>Chọn tệp (PDF, JPEG, PNG)</label>
        <input
          type="file"
          accept=".pdf,.jpeg,.jpg,.png"
          multiple
          onChange={handleFileChange}
        />
      </div>
      <ul>
        {formData.documents.map((file: File, index: number) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
      <div className="form-navigation">
        <button className="prev-button" onClick={prevStep}>Quay lại</button>
        <button className="next-button" onClick={nextStep}>Tiếp theo</button>
      </div>
    </div>
  </CommonLayout>
  );
};

export default Step4_UploadDocuments;