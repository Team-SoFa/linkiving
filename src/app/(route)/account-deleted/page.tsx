import SVGIcon from '@/components/Icons/SVGIcon';
import Button from '@/components/basics/Button/Button';
import Link from 'next/link';

export default function AccountDeletedPage() {
  return (
    <main className="bg-gray50 relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="absolute inset-x-0 bottom-0 h-[34%] bg-[url('/images/account-deleted-background.webp')] bg-cover bg-center"
        aria-hidden="true"
      />
      <section className="border-gray100 relative z-10 flex w-full max-w-[520px] flex-col items-center rounded-2xl border bg-white px-8 py-11 text-center">
        <SVGIcon icon="IC_Complete" size="2xl" className="text-blue400" aria-hidden="true" />
        <h1 className="font-title-md text-gray900 mt-6">회원 탈퇴가 완료되었습니다.</h1>
        <p className="font-body-md text-gray600 mt-4">
          그동안 링카이빙을 이용해 주셔서 진심으로 감사드립니다.
          <br />
          앞으로 더 좋은 모습으로 만나뵐 수 있기를 바랍니다.
        </p>
        <Button asChild label="링카이빙 홈으로 이동하기" className="mt-10 w-full">
          <Link href="/">링카이빙 홈으로 이동하기</Link>
        </Button>
      </section>
    </main>
  );
}
