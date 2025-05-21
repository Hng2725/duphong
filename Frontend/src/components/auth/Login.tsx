import React, { useState, useEffect } from 'react';
import { notification, Button, Input } from 'antd';
import './auth.css';

interface LoginProps {
  setCurrentUser: (user: string) => void;
  setPage: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ setCurrentUser, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    api.info({
      message: 'Thông báo',
      description: 'Hệ thống bảo trì từ 19h00 đến 22h00',
      placement: 'topRight',
      duration: 5,
    });
  }, [api]);

  const handleLogin = () => {
    if (username && password) {
      setCurrentUser(username); // Thiết lập currentUser
      setPage('dashboard');
    } else {
      api.warning({
        message: 'Lỗi đăng nhập',
        description: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu',
        placement: 'topRight',
        duration: 3,
      });
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: "url('/images/backroud.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {contextHolder}
      <div className="auth-content">
        <div className="login-container">
          <h2>Đăng nhập</h2>
          <div className="form-group">
            <label>
              Số CCCD/CMND/ĐDCN <span className="required">*</span>
            </label>
            <Input
              size="large"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập số CCCD/CMND/ĐDCN"
            />
          </div>
          <div className="form-group">
            <label>
              Mật khẩu <span className="required">*</span>
            </label>
            <Input.Password
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <Button type="primary" block size="large" onClick={handleLogin}>
            Đăng nhập
          </Button>
          <p className="register-link">
            Chưa có tài khoản?{' '}
            <a onClick={() => setPage('register')}>Đăng ký ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;