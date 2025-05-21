# Linkiving

이 저장소는 **Linkiving** 서비스의 프론트엔드 프로젝트입니다. IT 종사자들이 북마크한 링크를 빠르고 효율적으로 관리할 수 있도록 AI 기반 폴더링, 태그, 요약 기능을 제공하는 스마트 북마크 & 아카이빙 서비스입니다.

## 🏗️ 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/) (App Router)
- **언어**: TypeScript
- **UI 라이브러리**: React
- **스타일링**: Tailwind CSS
- **서버 상태 관리**: TanStack Query
- **클라이언트 상태 관리**: Zustand
- **라우팅 & 링크**: Next.js `Link`
- **폰트 관리**: `next/font`
- **클래스 조합 유틸리티**: clsx
- **린트 & 포맷**: ESLint, Prettier, lint-staged
- **Git 훅**: Husky
- **임포트 별칭**: `@/*` → `src/*`

## 🚀 시작하기

### 1. 필수 요구사항

- Node.js **>= 18.18.0** (또는 >= 20.x)
- npm (Node.js 설치 시 포함)

### 2. 클론 & 설치

```bash
# 저장소 클론
git clone https://github.com/Team-SoFa/linkiving.git
cd linkiving

# 의존성 설치
npm install
```

### 3. 개발 모드 실행

```bash
# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 4. 빌드 & 프로덕션 모드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 🛠️ 사용 가능한 스크립트

- `npm run dev` – 개발 서버 실행
- `npm run build` – 프로덕션 빌드 생성
- `npm run start` – 프로덕션 서버 실행
- `npm run lint` – ESLint 실행
- `npm run format` – Prettier 포맷 실행
- `npm run lint:staged` – lint-staged로 변경된 파일 린트 및 포맷

## 📁 디렉터리 구조

```
└── src
    ├── app/             # App Router 페이지 & 레이아웃
    ├── components/      # 재사용 가능한 React 컴포넌트
    ├── store/           # Zustand 스토어
    ├── services/        # API 호출 및 TanStack Query 설정
    ├── styles/          # 글로벌 CSS & Tailwind 설정
    └── utils/           # 헬퍼 함수, 상수, 타입 정의
```

---

_이제 Linkiving과 함께 스마트하고 효율적인 북마크 관리를 시작해보세요!_
