'use client';

import { safeFetch } from '@/hooks/util/api';
import { FetchError, TimeoutError } from '@/hooks/util/api/error/errors';
import { useToastStore } from '@/stores/toastStore';
import { SignupRequest, SignupResponse } from '@/types/api/authApi';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const signup = async (data: SignupRequest) => {
  return safeFetch<SignupResponse>('/api/member/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export function useSignupSubmit() {
  const router = useRouter();
  const { showToast } = useToastStore();

  const mutation = useMutation({
    mutationFn: signup,
    retry: false,
    onSuccess: () => {
      showToast({
        id: 'alert',
        message: '회원가입이 완료되었습니다.',
        variant: 'success',
        duration: 2000,
      });
      router.push('/login');
    },
    onError: err => {
      if (err instanceof FetchError) {
        if (err.status === 409) {
          showToast({
            id: 'alert',
            message: '이미 사용 중인 이메일입니다.',
            variant: 'error',
            duration: 2000,
          });
          return;
        }
        if (!err.status || err.status >= 500) {
          showToast({
            id: 'alert',
            message: '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.',
            variant: 'error',
            duration: 2000,
          });
          return;
        }
        return;
        // 기타 에러
        showToast({
          id: 'alert',
          message: '요청이 올바르지 않습니다. 입력값을 확인해 주세요.',
          variant: 'error',
          duration: 2000,
        });
      }

      if (err instanceof TimeoutError) {
        showToast({
          id: 'alert',
          message: '요청 시간이 초과되었습니다. 다시 시도해 주세요.',
          variant: 'error',
          duration: 2000,
        });
        return;
      }
      showToast({
        id: 'alert',
        message: '알 수 없는 오류가 발생했습니다.',
        variant: 'error',
        duration: 2000,
      });
    },
  });

  return {
    submit: (data: SignupRequest) => {
      if (mutation.isPending) return;
      mutation.mutate(data);
    },
    isPending: mutation.isPending,
  };
}
