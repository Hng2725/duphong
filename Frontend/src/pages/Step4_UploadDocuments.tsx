import React from "react";
import { FormData } from "../types";
import CommonLayout from "../components/application/CommonLayout";
import "../styles.css";
import "../styles/Upload.css";

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
  currentUser,
}) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        [field]: [...((prev[field] as File[]) || []), ...newFiles],
      }));
    }
  };

  const handleRemoveFile = (field: keyof FormData, index: number) => {
    setFormData((prev) => {
      const updatedFiles = [...(prev[field] as File[])];
      updatedFiles.splice(index, 1);
      return { ...prev, [field]: updatedFiles };
    });
  };

  const hasFilesSelected = () => {
    return (
      (formData.documents && formData.documents.length > 0) ||
      (formData.documents2 && formData.documents2.length > 0) ||
      (formData.documents3 && formData.documents3.length > 0)
    );
  };

  return (
    <CommonLayout
      setPage={setPage}
      currentUser={currentUser}
      activePage="apply"
    >
      <div className="form-step">
        <h2>Tải lên minh chứng</h2>

        {/* First file upload section */}
        <div className="form-group">
          <label>Chọn tệp 1 (PDF, JPEG, PNG)</label>
          <div className="file-input-container">
            <input
              type="file"
              accept=".pdf,.jpeg,.jpg,.png"
              multiple
              onChange={(e) => handleFileChange(e, "documents")}
              className="file-input"
              id="document-upload-1"
            />
            <label htmlFor="document-upload-1" className="file-input-label">
              Chọn tệp...
            </label>
          </div>
          {formData.documents && formData.documents.length > 0 && (
            <div className="file-list-container">
              <h3>Các tệp đã chọn:</h3>
              <ul className="file-list">
                {formData.documents.map((file: File, index: number) => (
                  <li key={`doc1-${index}`} className="file-list-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                    <button
                      className="remove-file-button"
                      onClick={() => handleRemoveFile("documents", index)}
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Second file upload section */}
        <div className="form-group">
          <label>Chọn tệp 2 (PDF, JPEG, PNG)</label>
          <div className="file-input-container">
            <input
              type="file"
              accept=".pdf,.jpeg,.jpg,.png"
              multiple
              onChange={(e) => handleFileChange(e, "documents2")}
              className="file-input"
              id="document-upload-2"
            />
            <label htmlFor="document-upload-2" className="file-input-label">
              Chọn tệp...
            </label>
          </div>
          {formData.documents2 && formData.documents2.length > 0 && (
            <div className="file-list-container">
              <h3>Các tệp đã chọn:</h3>
              <ul className="file-list">
                {formData.documents2.map((file: File, index: number) => (
                  <li key={`doc2-${index}`} className="file-list-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                    <button
                      className="remove-file-button"
                      onClick={() => handleRemoveFile("documents2", index)}
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Third file upload section */}
        <div className="form-group">
          <label>Chọn tệp 3 (PDF, JPEG, PNG)</label>
          <div className="file-input-container">
            <input
              type="file"
              accept=".pdf,.jpeg,.jpg,.png"
              multiple
              onChange={(e) => handleFileChange(e, "documents3")}
              className="file-input"
              id="document-upload-3"
            />
            <label htmlFor="document-upload-3" className="file-input-label">
              Chọn tệp...
            </label>
          </div>
          {formData.documents3 && formData.documents3.length > 0 && (
            <div className="file-list-container">
              <h3>Các tệp đã chọn:</h3>
              <ul className="file-list">
                {formData.documents3.map((file: File, index: number) => (
                  <li key={`doc3-${index}`} className="file-list-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                    <button
                      className="remove-file-button"
                      onClick={() => handleRemoveFile("documents3", index)}
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-navigation">
          <button className="prev-button" onClick={prevStep}>
            Quay lại
          </button>
          <button
            className="next-button"
            onClick={nextStep}
            disabled={!hasFilesSelected()}
          >
            Tiếp theo
          </button>
        </div>
      </div>
    </CommonLayout>
  );
};

export default Step4_UploadDocuments;
