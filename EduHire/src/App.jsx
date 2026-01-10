import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import ProfileBuilder from './components/ProfileBuilder';
import AIResumeBuilder from './components/AIResumeBuilder';
import AICVBuilder from './components/AICVBuilder';
import UploadSection from './components/UploadSection';
import StudentProfile from './components/StudentProfile';
import Login from './components/Login';
import Register from './components/Register';
import { getCurrentUser, logoutUser } from './utils/userData';
import Footer from './components/Footer';
import StyleGuide from './components/StyleGuide';
import { ToastProvider } from './context/ToastContext';
import Settings from './components/Settings';

function App() {
  console.log('App component rendering (Partial)');
  const [currentSection, setCurrentSection] = useState('hero');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const user = await getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        // If we are on the default 'hero' section, redirect to dashboard
        if (currentSection === 'hero') {
          setCurrentSection('dashboard');
        }
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    // Mock login
    setIsLoggedIn(true);
    setCurrentSection('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentSection('login');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'login':
        return <Login onSectionChange={setCurrentSection} onLogin={handleLogin} />;
      case 'register':
        return <Register onSectionChange={setCurrentSection} onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard onSectionChange={setCurrentSection} />;
      case 'profile':
        return <ProfileBuilder onSectionChange={setCurrentSection} />;
      case 'resume-ai':
        return <AIResumeBuilder onSectionChange={setCurrentSection} />;
      case 'cv-ai':
        return <AICVBuilder onSectionChange={setCurrentSection} />;
      case 'upload':
        return <UploadSection onSectionChange={setCurrentSection} />;
      case 'student-profile':
        return <StudentProfile onSectionChange={setCurrentSection} />;
      case 'settings':
        return <Settings onSectionChange={setCurrentSection} />;
      case 'styleguide':
        return <StyleGuide onSectionChange={setCurrentSection} />;
      default:
        return <Hero onGetStarted={() => setCurrentSection('register')} />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onSectionChange={setCurrentSection}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
          {renderSection()}
          <Footer />
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;