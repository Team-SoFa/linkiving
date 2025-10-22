import Link from 'next/link';

// homepage (new chat page)
export default function homepage() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <p> home page</p>
      <Link href="/chat">Chat Page</Link>
      <Link href="/allLink">All link Page</Link>
    </div>
  );
}
