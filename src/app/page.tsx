import Landing from './LandingPage';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return <Landing error={params?.error} />;
}
