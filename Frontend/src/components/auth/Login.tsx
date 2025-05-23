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
    console.log("Form submitted"); // Debug log

    // Reset error
    setError("");

    // Validate input
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiểm tra tài khoản admin
    if (username === "admin" && password === "123") {
      console.log("Admin login"); // Debug log
      setCurrentUser("admin");
      if (setIsAdmin) setIsAdmin(true);
      localStorage.setItem("currentUser", "admin");
      setPage("admin-dashboard");
      return;
    }

    // Xử lý đăng nhập cho người dùng thông thường
    console.log("User login"); // Debug log
    setCurrentUser(username);
    if (setIsAdmin) setIsAdmin(false);
    localStorage.setItem("currentUser", username);
    setPage("dashboard");
  };

  const handleLoginClick = () => {
    console.log("Login button clicked"); // Debug log
  };

  return (
    <div className="auth-wrapper">
      <div className="login-container">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="login-button"
            onClick={handleLoginClick}
          >
            Đăng nhập
          </button>
        </form>
        <div className="register-link">
          Chưa có tài khoản?{" "}
          <span
            onClick={() => setPage("register")}
            style={{ cursor: "pointer", color: "#3498db" }}
          >
            Đăng ký ngay
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
