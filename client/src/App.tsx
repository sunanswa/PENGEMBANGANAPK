import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import ApplicantDashboard from './pages/ApplicantDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import LoadingScreen from './components/LoadingScreen';
import SplashScreen from './components/SplashScreen';
import { queryClient } from './lib/queryClient';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'applicant';
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleStartApplication = () => {
    setShowAuth(true);
  };

  const handleShowAuth = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = (role: 'admin' | 'applicant') => {
    // Create a mock user based on role for demo purposes
    const mockUser: User = {
      id: role === 'admin' ? '1' : '2',
      email: role === 'admin' ? 'admin@example.com' : 'applicant@example.com',
      full_name: role === 'admin' ? 'Admin User' : 'John Doe',
      role: role
    };
    setUser(mockUser);
    setShowAuth(false);
  };

  const handleCancel = () => {
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowAuth(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {!user ? (
          <>
            {showAuth ? (
              <AuthForm
                onAuthSuccess={handleAuthSuccess}
                onCancel={handleCancel}
              />
            ) : (
              <LandingPage
                onStartApplication={handleStartApplication}
                onShowAuth={handleShowAuth}
              />
            )}
          </>
        ) : (
          <Switch>
            <Route path="/">
              {user.role === 'admin' ? (
                <RecruiterDashboard onLogout={handleLogout} />
              ) : (
                <ApplicantDashboard onLogout={handleLogout} userProfile={user} />
              )}
            </Route>
          </Switch>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;