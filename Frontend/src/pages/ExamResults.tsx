import React from "react";
import CommonLayout from "../components/application/CommonLayout";
import { FormData } from "../types";
import "../styles.css";

interface ExamResultsProps {
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
  applicationData?: FormData & { status: string };
}

const ExamResults: React.FC<ExamResultsProps> = ({
  setPage,
  currentUser,
  applicationData,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "đã duyệt":
        return "status-approved";
      case "từ chối":
        return "status-rejected";
      default:
        return "";
    }
  };

  // Kiểm tra xem có hồ sơ và đã được xét duyệt chưa
  const isApplicationReviewed =
    applicationData &&
    (applicationData.status === "Đã duyệt" ||
      applicationData.status === "Từ chối");

  return (
    <CommonLayout
      setPage={setPage}
      currentUser={currentUser}
      activePage="results"
    >
      <div className="results-content">
        <h2>Kết quả xét tuyển điểm thi</h2>

        {!applicationData ? (
          <div className="no-applications">
            <p>Bạn chưa có hồ sơ xét tuyển nào.</p>
            <button onClick={() => setPage("apply")} className="action-button">
              Đăng ký xét tuyển
            </button>
          </div>
        ) : !isApplicationReviewed ? (
          <div className="pending-result">
            <div className="status-message">
              <p>Hồ sơ của bạn đang trong quá trình xét duyệt.</p>
              <p>Vui lòng quay lại sau khi hồ sơ đã được xét duyệt.</p>
              <p>
                Bạn có thể theo dõi trạng thái hồ sơ tại mục "Trạng thái hồ sơ".
              </p>
            </div>
            <button onClick={() => setPage("status")} className="action-button">
              Xem trạng thái hồ sơ
            </button>
          </div>
        ) : (
          <div className="results-container">
            <div className="application-status">
              <h3>
                Kết quả xét tuyển:{" "}
                <span className={getStatusColor(applicationData.status)}>
                  {applicationData.status === "Đã duyệt"
                    ? "Đạt tuyển"
                    : "Không đạt tuyển"}
                </span>
              </h3>
              <div
                className={`status-message ${getStatusColor(applicationData.status)}`}
              >
                {applicationData.status === "Đã duyệt" ? (
                  <p>
                    Chúc mừng! Bạn đã trúng tuyển vào {applicationData.major} -{" "}
                    {applicationData.school}. Vui lòng hoàn thành thủ tục nhập
                    học theo hướng dẫn được gửi qua email.
                  </p>
                ) : (
                  <p>
                    Rất tiếc, bạn chưa đạt điều kiện trúng tuyển vào{" "}
                    {applicationData.major} - {applicationData.school}. Bạn có
                    thể đăng ký xét tuyển đợt tiếp theo hoặc tham khảo các ngành
                    khác.
                  </p>
                )}
              </div>
            </div>

            <div className="review-section">
              <h3>Thông tin cá nhân</h3>
              <div className="info-grid">
                <p>
                  <strong>Họ tên:</strong> {applicationData.personalInfo.name}
                </p>
                <p>
                  <strong>CCCD:</strong> {applicationData.personalInfo.cccd}
                </p>
                <p>
                  <strong>Ngày sinh:</strong>{" "}
                  {applicationData.personalInfo.dateOfBirth}
                </p>
                <p>
                  <strong>Giới tính:</strong>{" "}
                  {applicationData.personalInfo.gender}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{" "}
                  {applicationData.personalInfo.address}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {applicationData.personalInfo.phone}
                </p>
              </div>
            </div>

            <div className="review-section">
              <h3>Thông tin đăng ký</h3>
              <div className="info-grid">
                <p>
                  <strong>Trường:</strong> {applicationData.school}
                </p>
                <p>
                  <strong>Ngành:</strong> {applicationData.major}
                </p>
                <p>
                  <strong>Tổ hợp xét tuyển:</strong>{" "}
                  {applicationData.examCombination}
                </p>
                <p>
                  <strong>Điểm xét tuyển:</strong>{" "}
                  {Object.entries(applicationData.scores)
                    .map(([subject, score]) => `${subject}: ${score}`)
                    .join(", ")}
                </p>
              </div>
            </div>

            <div className="review-section">
              <h3>Minh chứng đã nộp</h3>
              <ul className="documents-list">
                {applicationData.documents.map((doc, index) => (
                  <li key={index}>{doc.name}</li>
                ))}
              </ul>
            </div>

            <div className="submission-info">
              <p>
                <strong>Ngày nộp hồ sơ:</strong>{" "}
                {applicationData.submissionDate}
              </p>
            </div>

            {applicationData.status === "Đã duyệt" && (
              <div className="next-steps">
                <h3>Các bước tiếp theo</h3>
                <ol>
                  <li>
                    Kiểm tra email để nhận thông tin chi tiết về thủ tục nhập
                    học
                  </li>
                  <li>Chuẩn bị các giấy tờ cần thiết theo yêu cầu</li>
                  <li>Hoàn thành thủ tục nhập học đúng thời hạn</li>
                  <li>Liên hệ phòng tuyển sinh nếu cần hỗ trợ thêm</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </CommonLayout>
  );
};

export default ExamResults;
