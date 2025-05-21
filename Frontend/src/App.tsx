import React, { useState } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './components/application/ApplicationForm';
import ApplicationStatus from './components/application/ApplicationStatus';
import Results from './components/application/Results';
import './styles.css';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState('dashboard'); // Default to dashboard page
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);

  const handleLogin = (username: string) => {
    setLoggedIn(true);
    setCurrentUser(username);
    setPage('dashboard'); // Redirect to dashboard after login
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser(undefined);
    setPage('dashboard'); // Redirect to dashboard after logout
  };

  // If not logged in, show dashboard which will display login/register options
  if (!loggedIn) {
    return <Dashboard setPage={setPage} currentUser={currentUser} />;
  }

  // For logged in users, show the requested page
  switch (page) {
    case 'dashboard':
      return <Dashboard setPage={setPage} currentUser={currentUser} />;
    case 'apply':
      return <ApplicationForm setPage={setPage} />;
    case 'status':
      return <ApplicationStatus setPage={setPage} />;
    case 'results':
      return <Results setPage={setPage} />;
    case 'logout':
      handleLogout();
      return <Dashboard setPage={setPage} currentUser={undefined} />;
    default:
      return <Dashboard setPage={setPage} currentUser={currentUser} />;
  }
};

export default App;