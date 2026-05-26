'use client';

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    if (!baseUrl) {
      console.error('NEXT_PUBLIC_BASE_API_URL is not configured');
      return;
    }

    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  return (
    <button onClick={handleGoogleLogin} className="">
      Google 계정으로 계속하기
    </button>
  );
}
