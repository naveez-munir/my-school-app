import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogInIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { TextInput } from '../common/form/inputs/TextInput';
import { PasswordInput } from '../common/form/inputs/PasswordInput';
import { storeAuthData, type DecodedToken } from '~/utils/auth';

const loginSchema = z.object({
  tenantName: z.string().min(3, 'School name is required'),
  identifier: z.string().min(6, 'Email or CNIC is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponse {
  access_token?: string;
  token?: string;
  data?: {
    token?: string;
  };
  message?: string | { message: string };
}

const loginUser = async (userData: LoginFormData): Promise<LoginResponse> => {
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
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { 
    handleSubmit, 
    formState: { errors },
    setValue,
    watch
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenantName: '',
      identifier: '',
      password: ''
    }
  });

  const formValues = watch();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const token = data.access_token || data.token || data.data?.token;
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          storeAuthData(token, formValues.tenantName, {
            isSuperAdmin: decodedToken.isSuperAdmin || false,
            isAdmin: decodedToken.isAdmin || false,
            role: decodedToken.role,
            permissions: decodedToken.permissions || []
          });
          toast.success('Successfully logged in!');
          if (decodedToken.isSuperAdmin) {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          storeAuthData(token, formValues.tenantName);
          navigate('/dashboard');
        }
      } else {
        setServerError('Authentication failed: No token received');
      }
    },
    onError: (error: Error) => {
      setServerError(error.message || 'An unexpected error occurred. Please try again.');
    }
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);
    loginMutation.mutate(data);
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    if (serverError) {
      setServerError(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-xl border border-gray-100">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </header>

        {serverError && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <TextInput 
              label="School Name"
              name="tenantName"
              value={formValues.tenantName}
              onChange={(value) => handleInputChange('tenantName', value)}
              error={errors.tenantName?.message}
              required
            />
            
            <TextInput 
              label="Email or CNIC"
              name="identifier"
              value={formValues.identifier}
              onChange={(value) => handleInputChange('identifier', value)}
              error={errors.identifier?.message}
              placeholder="Enter email or CNIC"
              required
            />

            <PasswordInput 
              label="Password"
              name="password"
              value={formValues.password}
              onChange={(value) => handleInputChange('password', value)}
              error={errors.password?.message}
              required
            />
            
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="group relative w-full flex justify-center items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
          >
            {loginMutation.isPending ? (
              <span className="flex items-center gap-2">
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogInIcon className="h-4 w-4" />
                Sign In
              </span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
};
