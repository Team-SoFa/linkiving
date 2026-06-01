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
- pnpm (별도 설치 필요)

### 2. 클론 & 설치

```bash
# 저장소 클론
git clone https://github.com/Team-SoFa/linkiving.git
cd linkiving

# 의존성 설치
pnpm install
```

### 3. 개발 모드 실행

```bash
# 개발 서버 실행
pnpm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 4. 빌드 & 프로덕션 모드

```bash
# 프로덕션 빌드
pnpm run build

# 프로덕션 서버 실행
pnpm run start
```

## 🛠️ 사용 가능한 스크립트

- `pnpm run dev` – 개발 서버 실행
- `pnpm run build` – 프로덕션 빌드 생성
- `pnpm run start` – 프로덕션 서버 실행
- `pnpm run lint` – ESLint 실행
- `pnpm run format` – Prettier 포맷 실행
- `pnpm run lint:staged` – lint-staged로 변경된 파일 린트 및 포맷

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

## Environment variables

| 키                         | 용도                                                                     | 사용처                               |
| -------------------------- | ------------------------------------------------------------------------ | ------------------------------------ |
| `NEXT_PUBLIC_BASE_API_URL` | Linkiving API 베이스 URL                                                 | App / CI / Vercel / Chromatic        |
| `NEXT_PUBLIC_WS_BASE_URL`  | Linkiving API WebSocket 베이스 URL                                       | App / CI / Vercel / Chromatic        |
| `AUTH_REFRESH_ENDPOINT`    | Access/Refresh Token 재발급 API 경로 (기본값: `/v1/auth/reissue`)        | App / CI / Vercel                    |
| `NEXT_PUBLIC_API_TOKEN`    | API Bearer 토큰                                                          | App / CI / Vercel / Chromatic        |
| `CHROMATIC_PROJECT_TOKEN`  | Chromatic 퍼블리시 토큰                                                  | Chromatic 워크플로우 / 로컬 퍼블리시 |
| `STORYBOOK_TOKEN`          | Chromatic 토큰 대체용 (로컬/CI에서 CHROMATIC_PROJECT_TOKEN 부재 시 대체) | Chromatic 로컬 퍼블리시              |

로컬 실행:

1. `.env.example`를 `.env.local`로 복사한 뒤 값을 채웁니다.
2. 실행: `pnpm dev`(Next) / `pnpm storybook`(Storybook)
   - Chromatic 퍼블리시: `CHROMATIC_PROJECT_TOKEN=xxx pnpm chromatic` (혹은 `STORYBOOK_TOKEN` 설정)

GitHub Secrets (Repository → Settings → Secrets and variables → Actions):

- `NEXT_PUBLIC_BASE_API_URL`
- `NEXT_PUBLIC_WS_BASE_URL`
- `NEXT_PUBLIC_API_TOKEN`
- `CHROMATIC_PROJECT_TOKEN`
  - 필요 시 `STORYBOOK_TOKEN`을 같은 값으로 추가해도 됩니다.
    CI와 `chromatic.yml`이 자동으로 사용합니다.

Vercel (Project Settings → Environment Variables):

- Production/Preview에 `NEXT_PUBLIC_BASE_API_URL`, `NEXT_PUBLIC_WS_BASE_URL`, `NEXT_PUBLIC_API_TOKEN`을 추가해 빌드/런타임에서 사용합니다.
