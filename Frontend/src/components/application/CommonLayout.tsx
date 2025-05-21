import React from "react";
import "../../styles.css";

interface CommonLayoutProps {
  children: React.ReactNode;
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
  activePage?: string;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({
  children,
  setPage,
  currentUser,
  activePage = "dashboard",
}) => (
  <div className="desktop-container">
    {/* Header with Logo and User Controls */}
    <header className="app-header">
      <div className="header-left">
        <div className="logo">TUYỂN SINH ĐẠI HỌC</div>
      </div>
      <div className="header-right">
        {currentUser ? (
          <div className="user-profile">
            <span className="user-greeting">Xin chào, {currentUser}</span>
            <button className="logout-btn" onClick={() => setPage("logout")}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => setPage("login")}>
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </header>

    {/* Main Navigation */}
    <nav className="main-nav">
      <button
        className={`nav-btn ${activePage === "dashboard" ? "active" : ""}`}
        onClick={() => setPage("dashboard")}
      >
        <i className="icon">🏠</i> Trang chủ
      </button>
      <button
        className={`nav-btn ${activePage === "apply" ? "active" : ""}`}
        onClick={() => setPage("apply")}
      >
        <i className="icon">📝</i> Đăng ký xét tuyển
      </button>
      <button
        className={`nav-btn ${activePage === "status" ? "active" : ""}`}
        onClick={() => setPage("status")}
      >
        <i className="icon">📋</i> Trạng thái hồ sơ
      </button>
      <button
        className={`nav-btn ${activePage === "results" ? "active" : ""}`}
        onClick={() => setPage("results")}
      >
        <i className="icon">🏆</i> Kết quả xét tuyển
      </button>
      <button
        className={`nav-btn ${activePage === "guide" ? "active" : ""}`}
        onClick={() => setPage("guide")}
      >
        <i className="icon">❓</i> Hướng dẫn
      </button>
    </nav>

    {/* Main Content Area */}
    <main className="content-area">{children}</main>

    {/* Footer */}
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Liên hệ</h3>
          <p>Hotline: 1800 1234</p>
          <p>Email: tuyensinh@university.edu.vn</p>
        </div>
        <div className="footer-section">
          <h3>Thời gian làm việc</h3>
          <p>Thứ 2 - Thứ 6: 7:30 - 17:00</p>
          <p>Thứ 7: 7:30 - 12:00</p>
        </div>
      </div>
      <div className="copyright">
        © 2025 Đại học Quốc gia - Hệ thống tuyển sinh trực tuyến
      </div>
    </footer>
  </div>
);

export default CommonLayout;
