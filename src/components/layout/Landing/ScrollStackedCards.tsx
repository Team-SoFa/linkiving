'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import FeatureCard from './FeatureCard';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ScrollStackedCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // b: 화면 밖 아래에서 a와 완전히 겹치는 위치(y=0)까지 — scroll 0~50%
  const bY = useTransform(scrollYProgress, p => {
    if (typeof window === 'undefined') return 0;
    const t = easeOutCubic(Math.max(0, Math.min(p / 0.5, 1)));
    return (1 - t) * window.innerHeight;
  });

  // c: scroll 50~100% 구간에서 b와 완전히 겹치는 위치(y=0)까지
  const cY = useTransform(scrollYProgress, p => {
    if (typeof window === 'undefined') return 0;
    const t = easeOutCubic(Math.max(0, Math.min((p - 0.5) / 0.5, 1)));
    return (1 - t) * window.innerHeight;
  });

  return (
    // 400vh = sticky 컨테이너(100vh) + 애니메이션 스크롤 공간(300vh)
    // 300vh 스크롤이 끝나면 sticky가 풀리며 다음 섹션으로 자연스럽게 이동
    <div ref={containerRef} style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Card a — 고정 */}
        <div className="absolute inset-x-0" style={{ top: '80px', zIndex: 1 }}>
          <FeatureCard
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
        </div>

        {/* Card b — a와 완전히 겹칠 때까지 상승 */}
        <motion.div className="absolute inset-x-0" style={{ top: '80px', y: bY, zIndex: 2 }}>
          <FeatureCard
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
        </motion.div>

        {/* Card c — b와 완전히 겹칠 때까지 상승, 이후 다음 섹션으로 이동 */}
        <motion.div className="absolute inset-x-0" style={{ top: '80px', y: cY, zIndex: 3 }}>
          <FeatureCard
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
        </motion.div>
      </div>
    </div>
  );
}
