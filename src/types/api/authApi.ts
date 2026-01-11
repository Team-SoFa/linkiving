import { z } from 'zod';

import { ApiResponseBase } from './linkApi';

export const Email = z
  .string()
  .min(1, '이메일을 입력해 주세요.')
  .email('이메일 형식이 올바르지 않습니다.');
export const Password = z
  .string()
  .trim()
  .min(1, '비밀번호를 입력해 주세요.')
  .min(8, '비밀번호는 8자 이상이어야 합니다.');

// ========== LOGIN ==========
export const LoginSchema = z.object({
  email: Email,
  password: Password,
});
export type LoginFormValues = z.infer<typeof LoginSchema>;

// ========== SIGN UP ==========
export const SignupSchema = z.object({
  email: Email,
  password: Password,
});

export type SignupFormValues = z.infer<typeof SignupSchema>;

export interface AuthTokenData {
  accessToken: string;
  refreshToken: string;
}

export type SignupResponse = ApiResponseBase<AuthTokenData>;

export const SignupRequestSchema = z.object({
  email: Email,
  password: Password,
});
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
