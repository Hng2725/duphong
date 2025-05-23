import React, { useState } from "react";
import "../../styles.css";

interface LoginProps {
  setCurrentUser: (user: string) => void;
  setPage: (page: string) => void;
  setIsAdmin?: (isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({
  setCurrentUser,
  setPage,
  setIsAdmin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra tài khoản admin
    if (username === "admin" && password === "123") {
      setCurrentUser("admin");
      setIsAdmin && setIsAdmin(true);
      setPage("admin-dashboard");
      return;
    }

    // Xử lý đăng nhập cho người dùng thông thường
    if (username && password) {
      setCurrentUser(username);
      setIsAdmin && setIsAdmin(false);
      setPage("dashboard");
      localStorage.setItem("currentUser", username);
    } else {
      setError("Vui lòng nhập đầy đủ thông tin!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="login-container">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
        <div className="register-link">
          Chưa có tài khoản?{" "}
          <a onClick={() => setPage("register")}>Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
