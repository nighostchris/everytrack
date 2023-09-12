import { z } from 'zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { login } from '@api/everytrack_backend';
import { Input, LoadingButton } from '@components';

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
      const { success } = await login({ email, password });
      if (success) {
        setLoginError(undefined);
        setIsLoading(false);
        navigate('/dashboard');
      }
    } catch (error: any) {
      setLoginError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmitLoginForm)}>
            <Input type="email" label="Email Address" formId="email" register={register} error={errors['email']?.message} />
            <Input type="password" label="Password" formId="password" register={register} error={errors['password']?.message} />
            {typeof loginError !== 'undefined' ? <p className="mt-1 text-sm text-red-700">{loginError}</p> : null}
            <div>
              <LoadingButton label="Login" type="submit" isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
