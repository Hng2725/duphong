import React from "react";
import CommonLayout from "../components/application/CommonLayout";
import { FormData } from "../types";

interface ResultsProps {
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
  applicationData?: FormData & { status: string }; // Add status field
}

const Results: React.FC<ResultsProps> = ({
  setPage,
  currentUser,
  applicationData,
}) => {
  // Helper function to determine if application is transcript-based
  const isTranscriptBased = (application: FormData) => {
    // Check if any transcript scores are filled
    const hasTranscriptScores = Object.values(
      application.transcriptScores?.semester1Grade12 || {}
    ).some((score) => score !== "");
    // Check if exam scores are filled
    const hasExamScores = Object.keys(application.scores || {}).length > 0;

    return hasTranscriptScores && !hasExamScores;
  };

  return (
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
              <h3>
                Trạng thái hồ sơ:
                <span
                  className={`status-${applicationData.status.toLowerCase().replace(" ", "-")}`}
                >
                  {applicationData.status}
                </span>
              </h3>
            </div>

            <div className="personal-info-review">
              <h3>Thông tin cá nhân</h3>
              <p>
                <strong>Họ tên:</strong> {applicationData.personalInfo.name}
              </p>
              <p>
                <strong>Giới tính:</strong>{" "}
                {applicationData.personalInfo.gender}
              </p>
              <p>
                <strong>Ngày sinh:</strong>{" "}
                {applicationData.personalInfo.dateOfBirth}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {applicationData.personalInfo.address}
              </p>
              <p>
                <strong>Số điện thoại:</strong>{" "}
                {applicationData.personalInfo.phone}
              </p>
            </div>

            <div className="academic-info-review">
              <h3>Thông tin học vấn</h3>
              <p>
                <strong>Trường:</strong> {applicationData.school}
              </p>
              <p>
                <strong>Ngành:</strong> {applicationData.major}
              </p>
              <p>
                <strong>Hình thức:</strong>{" "}
                {isTranscriptBased(applicationData)
                  ? "Xét tuyển học bạ"
                  : "Xét tuyển điểm thi"}
              </p>
              {!isTranscriptBased(applicationData) && (
                <p>
                  <strong>Tổ hợp:</strong> {applicationData.examCombination}
                </p>
              )}
            </div>

            {isTranscriptBased(applicationData) ? (
              <div className="academic-info-review">
                <h3>Điểm học bạ</h3>
                <div className="semester-section">
                  <h4>Lớp 12 - Học kỳ 1</h4>
                  {Object.entries(
                    applicationData.transcriptScores.semester1Grade12
                  ).map(([subject, score]) => (
                    <p key={subject}>
                      <strong>{subject}:</strong> {score}
                    </p>
                  ))}
                </div>
                <div className="semester-section">
                  <h4>Lớp 12 - Học kỳ 2</h4>
                  {Object.entries(
                    applicationData.transcriptScores.semester2Grade12
                  ).map(([subject, score]) => (
                    <p key={subject}>
                      <strong>{subject}:</strong> {score}
                    </p>
                  ))}
                </div>
                <div className="semester-section">
                  <h4>Lớp 11 - Học kỳ 1</h4>
                  {Object.entries(
                    applicationData.transcriptScores.semester1Grade11
                  ).map(([subject, score]) => (
                    <p key={subject}>
                      <strong>{subject}:</strong> {score}
                    </p>
                  ))}
                </div>
                <div className="semester-section">
                  <h4>Lớp 11 - Học kỳ 2</h4>
                  {Object.entries(
                    applicationData.transcriptScores.semester2Grade11
                  ).map(([subject, score]) => (
                    <p key={subject}>
                      <strong>{subject}:</strong> {score}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="academic-info-review">
                <h3>Điểm thi</h3>
                {Object.entries(applicationData.scores).map(
                  ([subject, score]) => (
                    <p key={subject}>
                      <strong>{subject}:</strong> {score}
                    </p>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <div className="no-applications">
            <p>Không tìm thấy thông tin hồ sơ.</p>
            <button onClick={() => setPage("apply")} className="action-button">
              Đăng ký xét tuyển
            </button>
          </div>
        )}
      </div>
    </CommonLayout>
  );
};

export default Results;
