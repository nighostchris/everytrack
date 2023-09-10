import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { login } from '@api/everytrack_backend';
import { LoadingButton, TextInput } from '@components';
import { LoginFormSchema, loginFormSchema } from '@features/auth/validations';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loginError, setLoginError] = React.useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmitLoginForm = async ({ email, password }: LoginFormSchema) => {
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
            <TextInput type="email" label="email" register={register} displayLabel="Email Address" error={errors['email']?.message} />
            <TextInput type="password" label="password" register={register} displayLabel="Password" error={errors['password']?.message} />
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
