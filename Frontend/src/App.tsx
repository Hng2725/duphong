import React, { useState, useEffect } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import ApplicationForm from "./components/application/ApplicationForm";
import ApplicationStatus from "./components/application/ApplicationStatus";
import Results from "./pages/Results";
import ExamResults from "./pages/ExamResults";
import GuideRegistration from "./components/application/GuideRegistration";
import TranscriptForm from "./components/application/TranscriptForm";
import AdminDashboard from "./pages/AdminDashboard";
import { FormData, FormDataSetter } from "./types";
import "./styles.css";

const defaultFormData: FormData = {
  school: "",
  major: "",
  examCombination: "",
  personalInfo: {
    name: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    cccd: "",
    ethnicity: "",
    gender: "",
  },
  scores: {},
  transcriptScores: {
    semester1Grade12: {
      math: "",
      literature: "",
      english: "",
      physics: "",
      chemistry: "",
      biology: "",
    },
    semester2Grade12: {
      math: "",
      literature: "",
      english: "",
      physics: "",
      chemistry: "",
      biology: "",
    },
    semester1Grade11: {
      math: "",
      literature: "",
      english: "",
      physics: "",
      chemistry: "",
      biology: "",
    },
    semester2Grade11: {
      math: "",
      literature: "",
      english: "",
      physics: "",
      chemistry: "",
      biology: "",
    },
  },
  priorityCategories: [],
  documents: [],
  documents2: [],
  documents3: [],
  status: "Chờ duyệt",
  submissionDate: new Date().toLocaleDateString(),
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [allApplications, setAllApplications] = useState<FormData[]>(() => {
    const savedApplications = localStorage.getItem("applications");
    return savedApplications ? JSON.parse(savedApplications) : [];
  });

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user === "admin");
    }
  }, []);

  useEffect(() => {
    if (page === "logout") {
      setCurrentUser(null);
      setIsAdmin(false);
      localStorage.removeItem("currentUser");
      setPage("login");
    }
  }, [page]);

  // Lưu applications vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(allApplications));
  }, [allApplications]);

  const handleNextStep = () => {
    if (formData && currentUser) {
      console.log("Form submitted:", formData);
      const updatedFormData = {
        ...formData,
        status: "Chờ duyệt",
        submissionDate: new Date().toLocaleDateString(),
        personalInfo: {
          ...formData.personalInfo,
          name: currentUser,
        },
      };
      setFormData(updatedFormData);
      setAllApplications([...allApplications, updatedFormData]);
      setPage("status");
    }
  };

  const handleUpdateStatus = (applicationId: number, newStatus: string) => {
    const updatedApplications = allApplications.map((app, index) => {
      if (index === applicationId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    setAllApplications(updatedApplications);
  };

  const protectedPages = [
    "apply",
    "apply-transcript",
    "status",
    "results",
    "admin-dashboard",
    "dashboard",
  ];

  if (protectedPages.includes(page) && currentUser === null) {
    return (
      <Login
        setCurrentUser={setCurrentUser}
        setPage={setPage}
        setIsAdmin={setIsAdmin}
      />
    );
  }

  if (currentUser === null && page === "register") {
    return <Register setCurrentUser={setCurrentUser} setPage={setPage} />;
  }

  const handleSetFormData: FormDataSetter = (data) => {
    if (typeof data === "function") {
      setFormData((prev) => {
        const result = data(prev);
        return { ...defaultFormData, ...result };
      });
    } else {
      setFormData({ ...defaultFormData, ...data });
    }
  };

  // Lọc hồ sơ của người dùng hiện tại
  const userApplications = allApplications.filter((app) => {
    console.log("Checking application:", app);
    console.log("Current user:", currentUser);
    console.log("Application name:", app.personalInfo?.name);
    return app.personalInfo?.name === currentUser;
  });

  console.log("All applications:", allApplications);
  console.log("User applications:", userApplications);

  switch (page) {
    case "dashboard":
      return <Dashboard currentUser={currentUser} setPage={setPage} />;
    case "admin-dashboard":
      return (
        <AdminDashboard
          setPage={setPage}
          currentUser={currentUser}
          applications={allApplications}
          onUpdateStatus={handleUpdateStatus}
        />
      );
    case "apply":
      return (
        <ApplicationForm
          setPage={setPage}
          currentUser={currentUser}
          setFormData={handleSetFormData}
          nextStep={handleNextStep}
        />
      );
    case "apply-transcript":
      return (
        <TranscriptForm
          setPage={setPage}
          currentUser={currentUser}
          setFormData={handleSetFormData}
          nextStep={handleNextStep}
        />
      );
    case "status":
      return (
        <ApplicationStatus
          setPage={setPage}
          currentUser={currentUser}
          applications={isAdmin ? allApplications : userApplications}
        />
      );
    case "results":
      // Lấy hồ sơ mới nhất của người dùng
      const latestApplication = userApplications[userApplications.length - 1];
      return (
        <ExamResults
          setPage={setPage}
          currentUser={currentUser}
          applicationData={latestApplication}
        />
      );
    case "guide":
      return <GuideRegistration setPage={setPage} currentUser={currentUser} />;
    case "login":
      return (
        <Login
          setCurrentUser={setCurrentUser}
          setPage={setPage}
          setIsAdmin={setIsAdmin}
        />
      );
    case "register":
      return <Register setCurrentUser={setCurrentUser} setPage={setPage} />;
    default:
      return <Dashboard currentUser={currentUser} setPage={setPage} />;
  }
};

export default App;
