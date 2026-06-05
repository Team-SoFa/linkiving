import { expect, test } from '@playwright/test';

test.describe('랜딩 페이지', () => {
  test('핵심 요소가 렌더링된다', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Linkiving/);
    await expect(page.getByText('똑똑하게 관리하는')).toBeVisible();
    await expect(page.getByText('나만의 북마크 저장소')).toBeVisible();
  });

  test('헤더와 푸터가 보인다', async ({ page }) => {
    await page.goto('/');

    // LandingHeader 내 로고/브랜드명
    await expect(page.locator('header, nav').first()).toBeVisible();

    // LandingFooter
    await expect(page.locator('footer').first()).toBeVisible();
  });
});

test.describe('회원가입 페이지', () => {
  test('이메일·비밀번호 폼이 렌더링된다', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByLabel('이메일')).toBeVisible();
    await expect(page.getByLabel('비밀번호')).toBeVisible();
    await expect(page.getByRole('button', { name: '회원가입하기' })).toBeVisible();
  });

  test('빈 폼 제출 시 버튼이 비활성화된다', async ({ page }) => {
    await page.goto('/signup');

    const submitBtn = page.getByRole('button', { name: '회원가입하기' });
    await expect(submitBtn).toBeDisabled();
  });
});

test.describe('인증 가드', () => {
  test('/home 미인증 접근 시 랜딩으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/home');

    await expect(page).toHaveURL(/\/(\?.*)?$/);
  });

  test('/all-link 미인증 접근 시 랜딩으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/all-link');

    await expect(page).toHaveURL(/\/(\?.*)?$/);
  });

  test('/mypage 미인증 접근 시 랜딩으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/mypage');

    await expect(page).toHaveURL(/\/(\?.*)?$/);
  });

  test('로그인 상태에서 랜딩 접근 시 /home으로 리다이렉트된다', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-token-for-redirect-test',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/');

    await expect(page).toHaveURL('/home');
  });
});
