import React from "react";
import { FormData } from "../types";
import CommonLayout from "../components/application/CommonLayout";
import "../styles.css";

interface Step5Props {
  formData: FormData;
  prevStep: () => void;
  submitForm: () => Promise<{ status: string }>; // Update to return status
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
  setApplicationData: (data: FormData & { status: string }) => void;
}

const Step5_ReviewAndSubmit: React.FC<Step5Props> = ({
  formData,
  prevStep,
  submitForm,
  setPage,
  currentUser,
  setApplicationData,
}) => {
  const handleSubmit = async () => {
    try {
      const result = await submitForm();
      // Set status to "Chờ duyệt" initially
      const applicationData = { ...formData, status: "Chờ duyệt" };
      setApplicationData(applicationData);
      setPage("results");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <CommonLayout setPage={setPage} currentUser={currentUser} activePage="apply">
      <div className="form-step">
        <h2>Xem lại và gửi hồ sơ</h2>
        <div className="review-section">
          <h3>Thông tin cá nhân</h3>
          <p><strong>Họ tên:</strong> {formData.personalInfo.name}</p>
          <p><strong>Giới tính:</strong> {formData.personalInfo.gender}</p>
          <p><strong>Ngày sinh:</strong> {formData.personalInfo.dateOfBirth}</p>
          <p><strong>Địa chỉ:</strong> {formData.personalInfo.address}</p>
          <p><strong>Dân tộc:</strong> {formData.personalInfo.ethnicity}</p>
          <p><strong>Số điện thoại:</strong> {formData.personalInfo.phone}</p>
          <p><strong>CCCD:</strong> {formData.personalInfo.cccd}</p>
        </div>

        <div className="review-section">
          <h3>Thông tin học vấn</h3>
          <p><strong>Trường:</strong> {formData.school}</p>
          <p><strong>Ngành:</strong> {formData.major}</p>
          <p><strong>Tổ hợp:</strong> {formData.examCombination}</p>
          <p><strong>Điểm:</strong> {JSON.stringify(formData.scores)}</p>
          <p><strong>Ưu tiên:</strong> {formData.priorityCategories.join(", ")}</p>
        </div>

        <div className="review-section">
          <h3>Minh chứng</h3>
          <ul>
            {formData.documents.map((file, index) => (
              <li key={`doc1-${index}`}>{file.name}</li>
            ))}
            {formData.documents2.map((file, index) => (
              <li key={`doc2-${index}`}>{file.name}</li>
            ))}
            {formData.documents3.map((file, index) => (
              <li key={`doc3-${index}`}>{file.name}</li>
            ))}
          </ul>
        </div>

        <div className="form-navigation">
          <button className="prev-button" onClick={prevStep}>
            Quay lại
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            Gửi hồ sơ
          </button>
        </div>
      </div>
    </CommonLayout>
  );
};

export default Step5_ReviewAndSubmit;