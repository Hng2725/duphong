import React, { useState } from "react";
import "./auth.css";

interface LoginProps {
  setCurrentUser: (user: string) => void;
  setPage: (page: string) => void;
  setIsAdmin?: (isAdmin: boolean) => void; // Thêm prop setIsAdmin
}

const Login: React.FC<LoginProps> = ({
  setCurrentUser,
  setPage,
  setIsAdmin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate input
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Đăng nhập thành công!");
        setCurrentUser(username);

        // Kiểm tra nếu là admin
        if (username === "admin" && password === "admin123") {
          setIsAdmin && setIsAdmin(true); // Đặt trạng thái admin
          setPage("admin-dashboard"); // Chuyển tới giao diện admin
        } else {
          setIsAdmin && setIsAdmin(false); // Đặt trạng thái người dùng
          setPage("dashboard"); // Chuyển tới giao diện người dùng
        }
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên tài khoản</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên tài khoản"
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">
          Đăng nhập
        </button>
      </form>
      <p className="register-link">
        Chưa có tài khoản?{" "}
        <a onClick={() => setPage("register")}>Đăng ký ngay</a>
      </p>
    </div>
  );
};

export default Login;
