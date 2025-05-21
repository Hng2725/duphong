import React from 'react';
import '../styles/Home.css'; // Assuming you have a CSS file for styling

interface DashboardProps {
  setPage: (page: string) => void;
  currentUser?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ setPage, currentUser }) => (
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
            <button className="logout-btn" onClick={() => setPage('logout')}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => setPage('login')}>
              Đăng nhập
            </button>
            <button className="register-btn" onClick={() => setPage('register')}>
              Đăng ký tài khoản
            </button>
          </div>
        )}
      </div>
    </header>

    {/* Main Navigation */}
    <nav className="main-nav">
      <button className="nav-btn active" onClick={() => setPage('dashboard')}>
        <i className="icon">🏠</i> Trang chủ
      </button>
      <button className="nav-btn" onClick={() => setPage('apply')}>
        <i className="icon">📝</i> Đăng ký xét tuyển
      </button>
      <button className="nav-btn" onClick={() => setPage('status')}>
        <i className="icon">📋</i> Trạng thái hồ sơ
      </button>
      <button className="nav-btn" onClick={() => setPage('results')}>
        <i className="icon">🏆</i> Kết quả xét tuyển
      </button>
      <button className="nav-btn" onClick={() => setPage('guide')}>
        <i className="icon">❓</i> Hướng dẫn
      </button>
    </nav>

    {/* Main Content Area */}
    <main className="content-area">
      {/* Hero Banner */}
      <section className="hero-banner">
        <h1>HỆ THỐNG ĐĂNG KÝ XÉT TUYỂN ĐẠI HỌC</h1>
        <p>Nền tảng đăng ký trực tuyến thuận tiện và hiệu quả</p>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Thao tác nhanh</h2>
        <div className="action-grid">
          <button className="action-card" onClick={() => setPage('apply')}>
            <div className="action-icon">📝</div>
            <h3>Tạo hồ sơ mới</h3>
            <p>Đăng ký xét tuyển vào các ngành học</p>
          </button>
          
          <button className="action-card" onClick={() => setPage('status')}>
            <div className="action-icon">🔍</div>
            <h3>Kiểm tra hồ sơ</h3>
            <p>Theo dõi trạng thái hồ sơ của bạn</p>
          </button>
          
          <button className="action-card" onClick={() => setPage('results')}>
            <div className="action-icon">📊</div>
            <h3>Xem kết quả</h3>
            <p>Tra cứu kết quả xét tuyển</p>
          </button>
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
    </main>

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
      <div className="copyright">© 2023 Đại học Quốc gia - Hệ thống tuyển sinh trực tuyến</div>
    </footer>
  </div>
);

export default Dashboard;