import React from "react";
import { FormData } from "../types";
import "../styles.css";

interface AdminDashboardProps {
  setPage: (page: string) => void;
  currentUser?: string | null;
  applications: FormData[];
  onUpdateStatus: (applicationId: number, newStatus: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setPage,
  currentUser,
  applications,
  onUpdateStatus,
}) => {
  if (currentUser !== "admin") {
    return (
      <div className="unauthorized">
        <h2>Không có quyền truy cập</h2>
        <button onClick={() => setPage("dashboard")} className="back-button">
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Quản lý hồ sơ xét tuyển</h2>
        <button onClick={() => setPage("logout")} className="logout-button">
          Đăng xuất
        </button>
      </div>

      <div className="applications-list">
        {applications.length === 0 ? (
          <div className="no-applications">
            <p>Chưa có hồ sơ xét tuyển nào.</p>
          </div>
        ) : (
          applications.map((application, index) => (
            <div key={index} className="admin-application-card">
              <div className="application-header">
                <h3>Hồ sơ #{index + 1}</h3>
                <div className="status-controls">
                  <select
                    value={application.status}
                    onChange={(e) => onUpdateStatus(index, e.target.value)}
                    className="status-select"
                  >
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đã duyệt">Duyệt</option>
                    <option value="Từ chối">Từ chối</option>
                  </select>
                </div>
              </div>

              <div className="application-details">
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
                      <strong>Trường:</strong> {application.school}
                    </p>
                    <p>
                      <strong>Ngành:</strong> {application.major}
                    </p>
                    <p>
                      <strong>Tổ hợp xét tuyển:</strong>{" "}
                      {application.examCombination}
                    </p>
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
