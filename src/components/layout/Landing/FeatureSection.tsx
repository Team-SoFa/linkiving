import ExperienceItem from './ExperienceItem';
import FAQItem from './FAQItem';
import HowUseItem from './HowUseItem';
import ScrollStackedCards from './ScrollStackedCards';

export default function FeatureSection() {
  return (
    <div className="flex w-full flex-col items-center px-10">
      <section className="my-30 w-full max-w-315">
        <h2 className="font-display mb-15">이런 경험, 있으신가요?</h2>
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
      <section className="my-30 w-full max-w-315">
        <h2 className="font-display mb-15">링카이빙과 함께하세요</h2>
        <ScrollStackedCards />
      </section>
      <section className="my-30 w-full max-w-315 items-center">
        <h2 className="font-display mb-15">어떻게 사용하나요?</h2>
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
        <h2 className="font-display mb-15">자주 묻는 질문</h2>
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
    </div>
  );
}
