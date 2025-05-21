import React from "react";
import CommonLayout from "../components/application/CommonLayout";
import "../styles/Home.css";

interface DashboardProps {
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
}

const Dashboard: React.FC<DashboardProps> = ({ setPage, currentUser }) => (
  <CommonLayout
    setPage={setPage}
    currentUser={currentUser}
    activePage="dashboard"
  >
    {/* Hero Banner */}
    <section className="hero-banner">
      <h1>HỆ THỐNG ĐĂNG KÝ XÉT TUYỂN ĐẠI HỌC</h1>
      <p>Nền tảng đăng ký trực tuyến thuận tiện và hiệu quả</p>
    </section>

    {/* Quick Actions */}
    <section className="quick-actions">
      <h2>Thao tác nhanh</h2>
      <div className="action-grid">
        <button className="action-card" onClick={() => setPage("apply")}>
          <div className="action-icon">📝</div>
          <h3>Tạo hồ sơ mới</h3>
          <p>Đăng ký xét tuyển vào các ngành học</p>
        </button>
        <button className="action-card" onClick={() => setPage("status")}>
          <div className="action-icon">🔍</div>
          <h3>Kiểm tra hồ sơ</h3>
          <p>Theo dõi trạng thái hồ sơ của bạn</p>
        </button>
        <button className="action-card" onClick={() => setPage("results")}>
          <div className="action-icon">📊</div>
          <h3>Xem kết quả</h3>
          <p>Tra cứu kết quả xét tuyển</p>
        </button>
      </div>
    </section>

    {/* News Section */}
    <section className="news-section">
      <h2>Tin tức mới nhất</h2>
      <div className="news-grid">
        <div className="news-card">
          <h3>Thông báo tuyển sinh 2025</h3>
          <p>
            Đại học Quốc gia công bố lịch trình tuyển sinh cho năm 2025. Thông
            tin chi tiết về các ngành học, chỉ tiêu và phương thức xét tuyển đã
            được cập nhật.
          </p>
          <a href="#" className="read-more">
            Xem thêm →
          </a>
        </div>
        <div className="news-card">
          <h3>Hội thảo hướng nghiệp</h3>
          <p>
            Tham gia hội thảo hướng nghiệp vào ngày 25/05/2025. Cơ hội gặp gỡ
            các chuyên gia đầu ngành và tìm hiểu về các cơ hội nghề nghiệp trong
            tương lai.
          </p>
          <a href="#" className="read-more">
            Xem thêm →
          </a>
        </div>
        <div className="news-card">
          <h3>Cập nhật quy chế xét tuyển</h3>
          <p>
            Quy chế xét tuyển mới đã được cập nhật với nhiều thay đổi quan
            trọng. Các thí sinh cần lưu ý về thời gian và phương thức đăng ký.
          </p>
          <a href="#" className="read-more">
            Xem thêm →
          </a>
        </div>
      </div>
    </section>

    {/* Statistics Section */}
    <section className="stats-section">
      <div className="stat-card">
        <div className="stat-value">15.000+</div>
        <div className="stat-label">Hồ sơ đã đăng ký</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">50+</div>
        <div className="stat-label">Ngành đào tạo</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">99%</div>
        <div className="stat-label">Hồ sơ xử lý đúng hạn</div>
      </div>
    </section>
  </CommonLayout>
);

export default Dashboard;
