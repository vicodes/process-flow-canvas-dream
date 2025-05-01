
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, User } from 'lucide-react';
import { getEnvironment } from '@/config/environments';

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading, devLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const environment = getEnvironment();
  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async () => {
    try {
      if (environment.name === 'Development') {
        await devLogin();
      } else {
        await login();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-soft p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" fill="#e20074"/>
              <path d="M22.67,35.28h-6.67v-6.6h6.67v6.6Zm-6.67-21.78v11.22h2v-.33c0-5.28,3-8.58,8.67-8.58h.33v23.76c0,3.3-1.33,4.62-4.67,4.62h-1v2.31h17.33v-2.31h-1c-3.33,0-4.67-1.32-4.67-4.62V15.81h.33c5.67,0,8.67,3.3,8.67,8.58v.33h2V13.5H16Zm21.33,21.78h6.67v-6.6h-6.67v6.6Z"
                    fill="#fff"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to OrchesT</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in to access your dashboard
          </p>
          
          {environment.name === 'Development' && (
            <div className="mt-4 p-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded">
              Development Mode Active - Using Automatic Login
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full py-6 text-lg"
            onClick={handleLogin}
          >
            {environment.name === 'Development' ? (
              <>
                <User className="mr-2 h-5 w-5" />
                Development Login
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign in with Microsoft
              </>
            )}
          </Button>
          
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
