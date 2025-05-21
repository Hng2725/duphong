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
  const [page, setPage] = useState('login');

  if (!loggedIn) {
    return page === 'login' ? (
      <Login setLoggedIn={setLoggedIn} setPage={setPage} />
    ) : (
      <Register setLoggedIn={setLoggedIn} setPage={setPage} />
    );
  }

  switch (page) {
    case 'dashboard':
      return <Dashboard setPage={setPage} />;
    case 'apply':
      return <ApplicationForm setPage={setPage} />;
    case 'status':
      return <ApplicationStatus setPage={setPage} />;
    case 'results':
      return <Results setPage={setPage} />;
    default:
      return <Dashboard setPage={setPage} />;
  }
};

export default App;