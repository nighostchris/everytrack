import { z } from 'zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Button } from '@components';
import { login } from '@api/everytrack_backend';

const loginFormSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Email must be of type string.',
      required_error: 'Email is required.',
    })
    .email({
      message: 'Invalid email.',
    }),
  password: z
    .string({
      invalid_type_error: 'Password must be of type string.',
      required_error: 'Password is required.',
    })
    .min(9, {
      message: 'Password must contain at least 9 characters.',
    })
    .max(20, {
      message: 'Password must not contain more than 20 characters.',
    })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&*])/, {
      message: 'Password should contain at least 1 lower case letter, 1 upper case letter, 1 decimal and 1 special character.',
    }),
});

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loginError, setLoginError] = React.useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmitLoginForm = async (data: any) => {
    const { email, password } = data as z.infer<typeof loginFormSchema>;
    setIsLoading(true);
    try {
      const {
        success,
        data: { token, refresh },
      } = await login({ email, password });
      if (success) {
        setLoginError(undefined);
        setIsLoading(false);
        localStorage.setItem('token', token);
        localStorage.setItem('refresh', refresh);
        navigate('/dashboard');
      }
    } catch (error: any) {
      setLoginError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col items-start justify-between bg-slate-800 p-10 lg:flex">
        <img src="/logo.svg" alt="Everytrack" className="h-14 object-scale-down" />
        <div className="flex flex-col gap-y-1">
          <p className="text-xl font-semibold text-white">"Everything Tracked."</p>
          <p className="text-sm text-slate-500">The Everytrack Team © 2023-2024</p>
        </div>
      </div>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 px-8 sm:mx-auto sm:w-full sm:max-w-sm sm:px-0">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmitLoginForm)}>
            <Input
              type="email"
              label="Email Address"
              formId="email"
              register={register}
              error={errors['email']?.message}
              className="!max-w-none"
            />
            <Input
              type="password"
              label="Password"
              formId="password"
              register={register}
              error={errors['password']?.message}
              className="!max-w-none"
            />
            {typeof loginError !== 'undefined' ? <p className="mt-1 text-sm text-red-700">{loginError}</p> : null}
            <div>
              <Button type="submit" variant="contained" isLoading={isLoading} className="w-full">
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
