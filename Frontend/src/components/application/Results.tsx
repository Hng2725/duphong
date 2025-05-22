import React from "react";
import CommonLayout from "./CommonLayout";
import { FormData } from "../../types";

interface ResultsProps {
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
  applicationData?: FormData & { status: string }; // Add status field
}

const Results: React.FC<ResultsProps> = ({ setPage, currentUser, applicationData }) => (
  <CommonLayout
    setPage={setPage}
    currentUser={currentUser}
    activePage="results"
  >
    <div className="results-content">
      <h2>Kết quả xét tuyển</h2>
      
      {applicationData ? (
        <>
          <div className="application-status">
            <h3>Trạng thái hồ sơ: 
              <span className={`status-${applicationData.status.toLowerCase().replace(' ', '-')}`}>
                {applicationData.status}
              </span>
            </h3>
          </div>
          
          <div className="personal-info-review">
            <h3>Thông tin cá nhân</h3>
            <p><strong>Họ tên:</strong> {applicationData.personalInfo.name}</p>
            <p><strong>Giới tính:</strong> {applicationData.personalInfo.gender}</p>
            <p><strong>Ngày sinh:</strong> {applicationData.personalInfo.dateOfBirth}</p>
            <p><strong>Địa chỉ:</strong> {applicationData.personalInfo.address}</p>
            <p><strong>Số điện thoại:</strong> {applicationData.personalInfo.phone}</p>
          </div>
          
          <div className="academic-info-review">
            <h3>Thông tin học vấn</h3>
            <p><strong>Trường:</strong> {applicationData.school}</p>
            <p><strong>Ngành:</strong> {applicationData.major}</p>
            <p><strong>Tổ hợp:</strong> {applicationData.examCombination}</p>
          </div>
          
          <div className="documents-review">
            <h3>Minh chứng đã nộp</h3>
            <ul>
              {applicationData.documents.map((file, index) => (
                <li key={`doc1-${index}`}>{file.name}</li>
              ))}
              {applicationData.documents2.map((file, index) => (
                <li key={`doc2-${index}`}>{file.name}</li>
              ))}
              {applicationData.documents3.map((file, index) => (
                <li key={`doc3-${index}`}>{file.name}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Chưa có hồ sơ nào được gửi</p>
      )}
    </div>
  </CommonLayout>
);

export default Results;