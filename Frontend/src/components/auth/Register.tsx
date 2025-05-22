import React, { useState } from 'react';
import './auth.css';

interface RegisterProps {
  setCurrentUser: (user: string) => void;
  setPage: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ setCurrentUser, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (username && password && password === confirmPassword) {
      setCurrentUser(username);
      setPage('dashboard');
    } else if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký</h2>
      <div className="form-group">
        <label>Tên tài khoản</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Vui lòng nhập tên tài khoản"
        />
      </div>
      <div className="form-group">
        <label>Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
        />
      </div>
      <div className="form-group">
        <label>Xác nhận mật khẩu</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Xác nhận mật khẩu"
        />
      </div>
      <button className="register-button" onClick={handleRegister}>
        Đăng ký
      </button>
      <p className="login-link">
        Đã có tài khoản?{' '}
        <a onClick={() => setPage('login')}>Đăng nhập ngay</a>
      </p>
    </div>
  );
};

export default Register;