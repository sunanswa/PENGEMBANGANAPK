import { useState, useEffect } from 'react';

// Mock authentication untuk deployment Vercel
const mockUser = {
  id: '1',
  email: 'admin@swapro.com',
  name: 'Admin SWAPRO',
  role: 'admin',
  profileImage: null
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Check localStorage for auth state
      const storedAuth = localStorage.getItem('swapro_auth');
      if (storedAuth) {
        setUser(JSON.parse(storedAuth));
      } else {
        // Auto-login for demo
        setUser(mockUser);
        localStorage.setItem('swapro_auth', JSON.stringify(mockUser));
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('swapro_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('swapro_auth');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
}