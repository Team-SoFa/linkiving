export function redirectToGoogleOAuth(): void {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  if (!baseUrl) {
    console.error('NEXT_PUBLIC_BASE_API_URL is not configured');
    return;
  }

  window.location.href = `${baseUrl}/oauth2/authorization/google`;
}
