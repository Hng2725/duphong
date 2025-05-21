import React from 'react';
import '../../styles.css'; 

interface ApplicationStatusProps {
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ setPage }) => (
  <div className="status-container">
    <h2>Trạng thái ứng dụng</h2>
    <p>Trạng thái: Chưa có</p>
    <button className="back-button" onClick={() => setPage('dashboard')}>
      Quay lại
    </button>
  </div>
);

export default ApplicationStatus;