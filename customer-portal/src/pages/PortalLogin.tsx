import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Package2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function PortalLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login credentials:', data);
      // Navigate to a protected route after successful login
      navigate('/portal/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <Package2 className="text-white w-6 h-6" />
          </div>
          <img src="/lizome-logo.png" alt="LIZOME" className="h-12 object-contain" />
          <p className="text-slate-500 dark:text-slate-400 mt-1">Customer Self-Service Portal</p>
        </div>

        <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-none dark:border dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Need an account?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                Contact your account manager
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
