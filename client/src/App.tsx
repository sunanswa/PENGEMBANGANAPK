import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import ApplicantDashboard from './pages/ApplicantDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'applicant' | 'recruiter' | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
        setShowAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
      } else {
        setUserRole(data?.role || null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = (role: 'applicant' | 'recruiter') => {
    setUserRole(role);
    setShowAuth(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    if (showAuth) {
      return (
        <AuthForm 
          onSuccess={handleAuthSuccess}
          onBack={() => setShowAuth(false)}
        />
      );
    }
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!userRole) {
    return <LoadingScreen />;
  }

  if (userRole === 'applicant') {
    return <ApplicantDashboard user={user} onSignOut={handleSignOut} />;
  }

  if (userRole === 'recruiter') {
    return <RecruiterDashboard user={user} onSignOut={handleSignOut} />;
  }

  return <LoadingScreen />;
}

export default App;