import React, { useState, useEffect } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import ApplicationForm from "./components/application/ApplicationForm";
import ApplicationStatus from "./components/application/ApplicationStatus";
import Results from "./components/application/Results";
import "./styles.css";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (page === "logout") {
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      setPage("dashboard");
    }
  }, [page]);

  const protectedPages = ["apply", "status", "results"];

  if (protectedPages.includes(page) && currentUser === null) {
    return <Login setCurrentUser={setCurrentUser} setPage={setPage} />;
  }

  if (currentUser === null && page === "register") {
    return <Register setCurrentUser={setCurrentUser} setPage={setPage} />;
  }

  switch (page) {
    case "dashboard":
      return <Dashboard currentUser={currentUser} setPage={setPage} />;
    case "apply":
      return <ApplicationForm setPage={setPage} currentUser={currentUser} />;
    case "status":
      return <ApplicationStatus setPage={setPage} currentUser={currentUser} />;
    case "results":
      return <Results setPage={setPage} currentUser={currentUser} />;
    case "login":
      return <Login setCurrentUser={setCurrentUser} setPage={setPage} />;
    case "register":
      return <Register setCurrentUser={setCurrentUser} setPage={setPage} />;
    default:
      return <Dashboard currentUser={currentUser} setPage={setPage} />;
  }
};

export default App;
