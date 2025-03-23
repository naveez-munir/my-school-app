import { useState } from 'react';
import { EyeIcon, EyeOffIcon, LogInIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TextInput } from '../common/form/inputs/TextInput';

interface FormData {
  tenantName: string;
  identifier: string;
  password: string;
}

interface LoginResponse {
  access_token?: string;
  token?: string;
  data?: {
    token?: string;
  };
  message?: string | { message: string };
}

const loginUser = async (userData: FormData): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-name': userData.tenantName
    },
    body: JSON.stringify({
      identifier: userData.identifier,
      password: userData.password,
      tenantName: userData.tenantName
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message?.message || data.message || 'Login failed. Please try again.');
  }
  
  return data;
};

export const SignIn = () => {
  const [formData, setFormData] = useState<FormData>({
    tenantName: '',
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const token = data.access_token || data.token || data.data?.token;
      if (token) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        
        const authData = {
          token,
          tenantName: formData.tenantName,
          expiry: expirationDate.getTime()
        };
        
        localStorage.setItem('authData', JSON.stringify(authData));
        
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      } else {
        toast.error('Authentication failed: No token received');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An unexpected error occurred. Please try again.');
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-xl border border-gray-100">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </header>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <TextInput 
              label="School Name"
              name="tenantName"
              value={formData.tenantName}
              onChange={(value) => setFormData({ ...formData, tenantName: value })}
              required
            />
            
            <TextInput 
              label="Email or CNIC"
              name="identifier"
              value={formData.identifier}
              onChange={(value) => setFormData({ ...formData, identifier: value })}
              placeholder="Enter identifier"
              required
            />

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? 
                    <EyeOffIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="group relative w-full flex justify-center items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
          >
            {loginMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogInIcon className="h-4 w-4" />
                Sign In
              </span>
            )}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
};
//TODO move the login api call out of this component and also need to refactor the code
