import React, { useState, useEffect } from 'react';
// Import Ant Design components and styles
import { notification, Button, Input, Space } from 'antd';
import './auth.css';

interface LoginProps {
  setLoggedIn: (value: boolean) => void;
  setPage: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ setLoggedIn, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    // Hiển thị thông báo khi component mount
    api.info({
      message: 'Thông báo',
      description: 'Hệ thống  bảo trì từ 19h00 đến 22h00 ',
      placement: 'topRight',
      duration: 5,
    });
  }, [api]);

  const handleLogin = () => {
    if (username && password) {
      setLoggedIn(true);
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
    <div className="auth-page">
      {/* Notification context holder */}
      {contextHolder}
      <div className="auth-content">
        {/* Column trái: Form đăng nhập */}
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
          <Button
            type="primary"
            block
            size="large"
            onClick={handleLogin}
          >
            Đăng nhập
          </Button>
          <p className="register-link">
            Chưa có tài khoản?{' '}
            <a onClick={() => setPage('register')}>Đăng ký ngay</a>
          </p>
        </div>

        {/* Column phải: Thông báo tĩnh */}
       
      </div>
    </div>
  );
};

export default Login;
