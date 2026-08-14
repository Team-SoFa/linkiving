import Image from 'next/image';

export default function LandingFooterLogo() {
  return (
    <Image
      src="/images/brand/full-logo-beta-white.svg"
      alt="Linkiving BETA"
      width={189}
      height={25}
      className="shrink-0"
      unoptimized
    />
  );
}
