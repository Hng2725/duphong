import React from 'react';
import '../styles.css';

interface DashboardProps {
  setPage: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setPage }) => (
  <div className="dashboard-container">
    <h2>Bảng điều khiển</h2>
    <div className="dashboard-buttons">
      <button className="action-button" onClick={() => setPage('apply')}>
        Đăng ký xét tuyển
      </button>
      <button className="action-button" onClick={() => setPage('status')}>
        Xem trạng thái
      </button>
      <button className="action-button" onClick={() => setPage('results')}>
        Tra cứu kết quả
      </button>
    </div>
  </div>
);

export default Dashboard;