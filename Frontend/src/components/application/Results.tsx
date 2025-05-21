// hiển thị kết quả xét tuyển
import React from 'react';
import '../../styles.css'; // Adjusted import for CSS

interface ResultsProps {
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const Results: React.FC<ResultsProps> = ({ setPage }) => (
  <div className="results-container">
    <h2>Kết quả xét tuyển</h2>
    <p>Kết quả: Chưa có</p>
    <button className="back-button" onClick={() => setPage('dashboard')}>
      Quay lại
    </button>
  </div>
);

export default Results;