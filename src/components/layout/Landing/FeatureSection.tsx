import { GoogleLoginButton } from '@/components/wrappers/GoogleLoginButton';

import ExperienceItem from './ExperienceItem';
import FAQItem from './FAQItem';
import FeatureCard from './FeatureCard';
import HowUseItem from './HowUseItem';

export default function FeatureSection() {
  return (
    <div className="flex w-full flex-col items-center px-10">
      <section className="my-25 w-full max-w-315">
        <h2 className="mb-10 text-[40px] font-semibold">이런 경험, 있으신가요?</h2>
        <div className="flex flex-col gap-7.5 lg:flex-row">
          <ExperienceItem
            image="/images/landing_icon_bookmark.png"
            title="북마크가 너무 많아요"
            content="폴더로 정리해도 시간이 지날수록 너무 많은 북마크가 쌓여서 불편해요"
          />
          <ExperienceItem
            image="/images/landing_icon_questionmark.png"
            title="내용이 기억 안나요"
            content="왜 저장했는지, 어떤 내용이었는지 기억이 나지 않아 링크만 남게 돼요"
          />
          <ExperienceItem
            image="/images/landing_icon_searchoff.png"
            title="다시 찾아보기 힘들어요"
            content="이전에 저장했던 북마크를 찾아보기 어려워서 다시 검색하게 돼요"
          />
        </div>
      </section>
      <section className="my-25 w-full max-w-315">
        <h2 className="mb-10 text-[40px] font-semibold">링카이빙과 함께하세요</h2>
        <div className="flex flex-col gap-10">
          <FeatureCard
            index={0}
            bgClassName="bg-blue100"
            image="/images/landing-5.png"
            imageAlt="예시 화면 1"
            title="손쉽게 링크를 북마크하세요"
            description={
              <>
                Chrome 익스텐션으로 링크를 손쉽게 북마크하세요.
                <br />
                원하는 제목으로 수정하고 메모도 남길 수 있어요.
              </>
            }
          />
          <FeatureCard
            index={1}
            bgClassName="bg-blue200"
            image="/images/landing-6.png"
            imageAlt="예시 화면 2"
            title="잊어버린 링크를 바로 찾아드려요"
            description={
              <>
                북마크를 어디에 했는지 기억이 안 나도 괜찮아요.
                <br />
                AI에게 물어보면 바로 찾아드려요.
              </>
            }
          />
          <FeatureCard
            index={2}
            bgClassName="bg-blue300"
            image="/images/landing-7.png"
            imageAlt="예시 화면 3"
            title="요약은 링카이빙이 대신 할게요"
            description={
              <>
                저장한 링크는 자동으로 AI 요약이 생성돼요.
                <br />
                언제든 확인하고, 다시 생성할 수 있어요.
              </>
            }
          />
        </div>
      </section>
      <section className="my-25 w-full max-w-315 items-center">
        <h2 className="mb-10 text-[40px] font-semibold">어떻게 사용하나요?</h2>
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row">
          <HowUseItem
            image="/images/landing-extension.png"
            title="1. 익스텐션 설치"
            description={
              <>
                Chrome 웹스토어에서 설치하고
                <br />
                링카이빙을 시작해보세요
              </>
            }
          />
          <HowUseItem
            image="/images/landing-add.png"
            title="2. 링크 북마크"
            description={
              <>
                원하는 링크를 저장해보세요
                <br />
                제목, 메모를 직접 작성할 수 있어요
              </>
            }
          />
          <HowUseItem
            image="/images/landing-ai.png"
            title="3. AI 자동 요약"
            description={
              <>
                AI가 자동으로 요약을 진행해요
                <br />내 홈에서 요약을 볼 수 있어요
              </>
            }
          />
          <HowUseItem
            image="/images/landing-chatbot.png"
            title="4. 챗봇으로 탐색"
            description={
              <>
                저장한 링크에서 정보를 찾고
                <br />
                내용을 요약해드려요
              </>
            }
          />
        </div>
      </section>
      <section className="my-30 w-full max-w-315 items-center">
        <h2 className="mb-10 text-[40px] font-semibold">자주 묻는 질문</h2>
        <ul className="flex flex-col gap-8">
          <FAQItem
            title="Chrome 외의 브라우저에서도 사용할 수 있나요?"
            content="링카이빙은 Chrome 환경을 전제로 제작되었습니다. 다른 브라우저에서 사용할 수 있지만, Chrome 익스텐션과 같은 확장 플러그인은 Chrome 환경에서만 사용할 수 있습니다. 사용자분들께서 더 많은 환경에서 만나보실 수 있도록 점차 범위를 확대해나갈 예정입니다."
          />
          <FAQItem
            title="저장한 링크와 정보들은 안전하게 관리되나요?"
            content="링크와 더불어 함께 작성한 제목 및 메모들은 개인 계정에만 저장되며 외부에는 공개되지 않습니다. 외부 노출 걱정 없이 나만의 링크 저장소를 만들어보세요."
          />
          <FAQItem
            title="무료로 사용할 수 있나요?"
            content="네, 현재 링카이빙은 무료로 사용 가능합니다. 앞으로 더 다양한 기능을 추가해나갈 예정이니, 많은 관심과 사용 부탁드립니다."
          />
        </ul>
      </section>
      <footer className="bg-gray900 mx-10 mt-50 mb-10 flex h-113.5 w-full flex-col items-center justify-between rounded-[20px] p-15">
        <div className="flex w-full max-w-105 flex-col items-center justify-center gap-10">
          <span className="text-gray50 text-[40px] leading-[146%] font-semibold">
            나만의 AI 북마크 저장소
            <br />
            지금 바로 시작해보세요.
          </span>
          <GoogleLoginButton />
        </div>
        <div className="font-body-md text-gray100 flex w-full justify-between">
          <span>@ 2026 Linkiving all rights reserved</span>
          <span>E-MAIL | linkivingsofa@gmail.com</span>
        </div>
      </footer>
    </div>
  );
}
