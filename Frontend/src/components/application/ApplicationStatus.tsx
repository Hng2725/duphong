import React from "react";
import "../../styles.css";

type PageType = "dashboard" | "application-status" | string;

interface ApplicationStatusProps {
  setPage: (page: PageType) => void;
  currentUser: string | null;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({
  setPage,
  currentUser,
}) => {
  const handleBackClick = () => {
    try {
      setPage("dashboard");
    } catch (error) {
      console.error("Error navigating back to dashboard:", error);
    }
  };

  return (
    <div className="status-container">
      <h2 className="status-title">Trạng thái ứng dụng</h2>
      <div className="status-content">
        <p className="status-text">Trạng thái: Chưa có</p>
        {currentUser && <p className="user-info">Người dùng: {currentUser}</p>}
      </div>
      <button className="back-button" onClick={handleBackClick} type="button">
        Quay lại
      </button>
    </div>
  );
};

export default ApplicationStatus;
