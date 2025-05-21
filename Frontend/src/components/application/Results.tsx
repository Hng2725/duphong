import React from "react";
import CommonLayout from "./CommonLayout";

interface ResultsProps {
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
}

const Results: React.FC<ResultsProps> = ({ setPage, currentUser }) => (
  <CommonLayout
    setPage={setPage}
    currentUser={currentUser}
    activePage="results"
  >
    <div className="results-content">
      <h2>Kết quả xét tuyển</h2>
      <p>Kết quả: Chưa có</p>
    </div>
  </CommonLayout>
);

export default Results;
