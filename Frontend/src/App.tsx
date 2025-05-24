import React, { useState, useEffect, useMemo } from "react";
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
import { UniversityProvider } from "./contexts/UniversityContext";
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
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [allApplications, setAllApplications] = useState<FormData[]>(() => {
    try {
      const savedApplications = localStorage.getItem("applications");
      console.log("Loading saved applications:", savedApplications);
      return savedApplications ? JSON.parse(savedApplications) : [];
    } catch (error) {
      console.error("Error loading applications:", error);
      return [];
    }
  });

  // Load user and applications on mount
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user === "admin");
    }

    // Load applications
    try {
      const savedApplications = localStorage.getItem("applications");
      if (savedApplications) {
        const parsed = JSON.parse(savedApplications);
        console.log("Loaded applications on mount:", parsed);
        setAllApplications(parsed);
      }
    } catch (error) {
      console.error("Error loading applications on mount:", error);
    }
  }, []);

  // Save applications whenever they change
  useEffect(() => {
    try {
      console.log("Saving applications:", allApplications);
      localStorage.setItem("applications", JSON.stringify(allApplications));
    } catch (error) {
      console.error("Error saving applications:", error);
    }
  }, [allApplications]);

  useEffect(() => {
    if (page === "logout") {
      setCurrentUser(null);
      setIsAdmin(false);
      localStorage.removeItem("currentUser");
      setPage("login");
    }
  }, [page]);

  const handleNextStep = () => {
    console.log("handleNextStep called with:", { formData, currentUser });

    if (!currentUser) {
      console.error("No current user found");
      return;
    }

    // Validate required fields
    if (!formData.school || !formData.major || !formData.examCombination) {
      console.error("Missing required form fields:", {
        school: formData.school,
        major: formData.major,
        examCombination: formData.examCombination,
      });
      return;
    }

    console.log("Form data before update:", formData);

    const updatedFormData = {
      ...formData,
      status: "Chờ duyệt",
      submissionDate: new Date().toLocaleDateString(),
      personalInfo: {
        ...formData.personalInfo,
        name: currentUser,
      },
    };

    console.log("Updated form data:", updatedFormData);

    // Cập nhật state
    setFormData(updatedFormData);
    setAllApplications((prev) => {
      const newApplications = [...prev, updatedFormData];
      console.log("New applications list:", newApplications);
      return newApplications;
    });

    // Lưu trực tiếp vào localStorage
    try {
      const currentApps = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );
      const newApps = [...currentApps, updatedFormData];
      localStorage.setItem("applications", JSON.stringify(newApps));
      console.log("Saved to localStorage:", newApps);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }

    // Chuyển hướng sau khi đã lưu thành công
    setPage("status");
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

  const handleSetFormData: FormDataSetter = (data) => {
    if (typeof data === "function") {
      setFormData((prev) => {
        const result = data(prev);
        const newData = { ...defaultFormData, ...result };
        console.log("Setting form data (function):", newData);
        return newData;
      });
    } else {
      const newData = { ...defaultFormData, ...data };
      console.log("Setting form data (direct):", newData);
      setFormData(newData);
    }
  };

  // Lọc hồ sơ của người dùng hiện tại
  const userApplications = useMemo(() => {
    return allApplications.filter((app) => {
      const matches = app.personalInfo?.name === currentUser;
      console.log("Filtering application:", {
        applicationName: app.personalInfo?.name,
        currentUser,
        matches,
      });
      return matches;
    });
  }, [allApplications, currentUser]);

  console.log("Current state:", {
    allApplications,
    userApplications,
    currentUser,
  });

  const renderContent = () => {
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
        return (
          <GuideRegistration setPage={setPage} currentUser={currentUser} />
        );
      default:
        return <Dashboard currentUser={currentUser} setPage={setPage} />;
    }
  };

  return (
    <UniversityProvider>
      {currentUser === null ? (
        page === "register" ? (
          <Register setCurrentUser={setCurrentUser} setPage={setPage} />
        ) : (
          <Login
            setCurrentUser={setCurrentUser}
            setPage={setPage}
            setIsAdmin={setIsAdmin}
          />
        )
      ) : (
        renderContent()
      )}
    </UniversityProvider>
  );
};

export default App;
