import React from "react";
import "../../styles.css";
import { FormData } from "../../types";
import CommonLayout from "./CommonLayout";

interface ApplicationStatusProps {
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
  applications: FormData[];
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({
  setPage,
  currentUser,
  applications,
}) => {
  // Add status and submission date if not present
  const applicationsWithStatus = applications.map((app) => ({
    ...app,
    status: app.status || "Chờ duyệt",
    submissionDate: app.submissionDate || new Date().toLocaleDateString(),
  }));

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case "chờ duyệt":
        return "Hồ sơ của bạn đang được xét duyệt. Thời gian xét duyệt thông thường từ 3-5 ngày làm việc.";
      case "đã duyệt":
        return "Chúc mừng! Hồ sơ của bạn đã được chấp nhận.";
      case "từ chối":
        return "Rất tiếc, hồ sơ của bạn không được chấp nhận. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.";
      default:
        return "";
    }
  };

  return (
    <CommonLayout
      setPage={setPage}
      currentUser={currentUser}
      activePage="status"
    >
      <div className="status-container">
        <h2>Trạng thái hồ sơ</h2>
        {applicationsWithStatus.length === 0 ? (
          <div className="no-applications">
            <p>Bạn chưa có hồ sơ xét tuyển nào.</p>
            <button onClick={() => setPage("apply")} className="action-button">
              Đăng ký xét tuyển
            </button>
          </div>
        ) : (
          <div className="applications-list">
            {applicationsWithStatus.map((application, index) => (
              <div key={index} className="application-card">
                <div className="application-header">
                  <h3>{application.school}</h3>
                  <span
                    className={`status-badge status-${application.status.toLowerCase().replace(" ", "-")}`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="status-message">
                  <p>{getStatusMessage(application.status)}</p>
                </div>

                <div className="detail-section">
                  <h4>Thông tin cá nhân</h4>
                  <div className="info-grid">
                    <p>
                      <strong>Họ tên:</strong> {application.personalInfo.name}
                    </p>
                    <p>
                      <strong>CCCD:</strong> {application.personalInfo.cccd}
                    </p>
                    <p>
                      <strong>Ngày sinh:</strong>{" "}
                      {application.personalInfo.dateOfBirth}
                    </p>
                    <p>
                      <strong>Giới tính:</strong>{" "}
                      {application.personalInfo.gender}
                    </p>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Thông tin đăng ký</h4>
                  <div className="info-grid">
                    <p>
                      <strong>Ngành:</strong> {application.major}
                    </p>
                    {application.examCombination && (
                      <p>
                        <strong>Tổ hợp xét tuyển:</strong>{" "}
                        {application.examCombination}
                      </p>
                    )}
                    {application.transcriptScores && (
                      <p>
                        <strong>Hình thức:</strong> Xét tuyển học bạ
                      </p>
                    )}
                    {!application.transcriptScores && (
                      <p>
                        <strong>Hình thức:</strong> Xét tuyển điểm thi
                      </p>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Điểm xét tuyển</h4>
                  <div className="info-grid">
                    {application.transcriptScores ? (
                      <>
                        <p>
                          <strong>Học kỳ 1 - Lớp 12:</strong>
                        </p>
                        {Object.entries(
                          application.transcriptScores.semester1Grade12
                        ).map(([subject, score]) => (
                          <p key={subject}>
                            <strong>{subject}:</strong> {score}
                          </p>
                        ))}
                      </>
                    ) : (
                      Object.entries(application.scores).map(
                        ([subject, score]) => (
                          <p key={subject}>
                            <strong>{subject}:</strong> {score}
                          </p>
                        )
                      )
                    )}
                  </div>
                </div>

                <div className="submission-info">
                  <p>
                    <strong>Ngày nộp:</strong> {application.submissionDate}
                  </p>
                  <button
                    onClick={() => setPage("results")}
                    className="view-details-button"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CommonLayout>
  );
};

export default ApplicationStatus;
