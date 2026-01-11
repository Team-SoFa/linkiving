'use client';

import Button from '@/components/basics/Button/Button';
import Input from '@/components/basics/Input/Input';
import Label from '@/components/basics/Label/Label';
import { useSignupSubmit } from '@/hooks/server/useSignup';

import { useSignupForm } from './useSignupForm';

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useSignupForm();

  const { submit, isPending } = useSignupSubmit();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-10">
      <span className="font-title-md">회원가입</span>
      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        {/* 이메일 */}
        <Label htmlFor="email">이메일</Label>
        <div>
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            autoComplete="email"
            className={errors.email && 'border-red500 focus:border-red-500'}
          />
          {errors.email && <span className="text-red-500">{errors.email?.message}</span>}
        </div>

        {/* 비밀번호 */}
        <Label htmlFor="password">비밀번호</Label>
        <div>
          <Input
            {...register('password')}
            id="password"
            placeholder="8자 이상 입력해 주세요"
            autoComplete="new-password"
            className={errors.password && 'border-red500 focus:border-red-500'}
          />
          {errors.password && <span className="text-red-500">{errors.password?.message}</span>}
        </div>
        <Button
          className="mt-2"
          type="submit"
          label="회원가입하기"
          disabled={!isValid || isSubmitting || isPending}
        />
      </form>
    </div>
  );
};

export default SignupPage;
