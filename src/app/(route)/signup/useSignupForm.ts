'use client';

import { SignupFormValues, SignupSchema } from '@/types/api/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useSignupForm = () => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  return form;
};
