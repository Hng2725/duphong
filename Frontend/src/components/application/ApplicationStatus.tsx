import React from "react";
import "../../styles.css";
import { FormData } from "../../types";

type PageType = "dashboard" | "application-status" | string;

interface ApplicationStatusProps {
  setPage: (page: PageType) => void;
  currentUser: string | null;
  applications: (FormData & { 
    status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
    submissionDate: string;
  })[];
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({
  setPage,
  currentUser,
  applications,
}) => {
  const handleBackClick = () => {
    try {
      setPage("dashboard");
    } catch (error) {
      console.error("Error navigating back to dashboard:", error);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Đã duyệt":
        return "status-approved";
      case "Từ chối":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="status-container">
      <h2 className="status-title">Danh sách hồ sơ đã gửi</h2>
      
      {applications.length === 0 ? (
        <div className="no-applications">
          <p>Bạn chưa gửi hồ sơ nào</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application, index) => (
            <div key={index} className="application-card">
              <div className="application-header">
                <h3>Hồ sơ #{index + 1}</h3>
                <span className={`status-badge ${getStatusClass(application.status)}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="application-details">
                <div className="detail-section">
                  <h4>Thông tin cá nhân</h4>
                  <p><strong>Họ tên:</strong> {application.personalInfo.name}</p>
                  <p><strong>Ngày sinh:</strong> {application.personalInfo.dateOfBirth}</p>
                  <p><strong>CCCD:</strong> {application.personalInfo.cccd}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Thông tin học vấn</h4>
                  <p><strong>Trường:</strong> {application.school}</p>
                  <p><strong>Ngành:</strong> {application.major}</p>
                  <p><strong>Tổ hợp:</strong> {application.examCombination}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Minh chứng</h4>
                  <ul className="documents-list">
                    {application.documents.map((doc, i) => (
                      <li key={`doc1-${i}`}>{doc.name}</li>
                    ))}
                    {application.documents2.map((doc, i) => (
                      <li key={`doc2-${i}`}>{doc.name}</li>
                    ))}
                    {application.documents3.map((doc, i) => (
                      <li key={`doc3-${i}`}>{doc.name}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="submission-info">
                  <p><strong>Ngày gửi:</strong> {application.submissionDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="back-button" onClick={handleBackClick}>
        Quay lại trang chủ
      </button>
    </div>
  );
};

export default ApplicationStatus;