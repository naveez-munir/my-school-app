import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FileQuestion, Home, LogIn } from 'lucide-react';
import { getAuthData } from '~/utils/auth';

export function NotFound() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authData = getAuthData();
    setIsAuthenticated(!!authData?.token);
  }, []);

  const handleGoBack = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-blue-100 p-6">
              <FileQuestion className="h-16 w-16 text-blue-600" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <button
            onClick={handleGoBack}
            className="group relative w-full flex justify-center items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <span className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Home className="h-4 w-4" />
                  Go to Dashboard
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Go to Sign In
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
