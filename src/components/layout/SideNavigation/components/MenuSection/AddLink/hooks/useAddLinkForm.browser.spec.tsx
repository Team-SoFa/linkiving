import { StrictMode, act } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAddLinkForm } from './useAddLinkForm';
import { useDuplicateCheck } from './useDuplicateCheck';

const mocks = vi.hoisted(() => ({ scrape: vi.fn(), duplicate: vi.fn(), toast: vi.fn() }));
vi.mock('@/hooks/usePostLinkMetaScrape', () => ({
  usePostLinkMetaScrape: () => ({ mutateAsync: mocks.scrape, status: 'idle', reset: vi.fn() }),
}));
vi.mock('@/hooks/useCheckDuplicateLink', () => ({
  useDuplicateLinkMutation: () => ({ mutate: mocks.duplicate }),
}));
vi.mock('@/apis/linkApi', () => ({ fetchLink: vi.fn() }));
vi.mock('@/stores/toastStore', () => ({ showToast: mocks.toast }));

let form: ReturnType<typeof useAddLinkForm>;
function FormHarness() {
  form = useAddLinkForm();
  useDuplicateCheck(form.trimmedUrl, form.isValidUrl);
  return (
    <>
      <textarea
        {...form.form.register('url')}
        id="url-input"
        value={form.urlValue}
        onChange={event => form.handleUrlChange(event.target.value)}
        onBlur={form.handleUrlBlur}
        onPaste={form.handleUrlPaste}
      />
      <textarea
        {...form.form.register('title')}
        id="title-input"
        value={form.titleValue}
        onChange={event => form.handleTitleChange(event.target.value)}
      />
      <textarea {...form.form.register('memo')} id="memo-input" />
    </>
  );
}

const input = (id: string) => document.getElementById(id) as HTMLTextAreaElement;
async function type(id: string, value: string) {
  await act(async () => {
    const element = input(id);
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(
      element,
      value
    );
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function paste(text: string) {
  await act(async () => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', text);
    input('url-input').dispatchEvent(
      new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData })
    );
  });
}
const advance = async (ms = 550) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
const metadata = (title = '자동 제목') => ({
  title,
  description: '',
  image: 'https://example.com/image.png',
  url: 'https://example.com',
});

describe('웹 링크 입력 QA', () => {
  let root: Root;
  let container: HTMLDivElement;
  beforeEach(async () => {
    vi.useFakeTimers();
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    mocks.scrape.mockReset().mockResolvedValue(metadata());
    mocks.duplicate.mockReset();
    mocks.toast.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    await act(async () =>
      root.render(
        <StrictMode>
          <FormHarness />
        </StrictMode>
      )
    );
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('타이핑을 멈춰도 중복 조회하지 않고 붙여넣기는 즉시 조회한다', async () => {
    await type('url-input', 'example.com');
    await advance(1000);
    expect(mocks.duplicate).not.toHaveBeenCalled();
    input('url-input').select();
    await paste('naver.com');
    expect(form.urlValue).toBe('https://naver.com');
    expect(mocks.duplicate).toHaveBeenCalledTimes(1);
    expect(mocks.duplicate.mock.calls[0][0]).toBe('https://naver.com');
    await act(async () => form.handleUrlBlur());
    expect(mocks.duplicate).toHaveBeenCalledTimes(1);
  });

  it('붙여넣기는 선택 영역을 치환한 전체 URL로 판정한다', async () => {
    await type('url-input', 'https://example.com/path');
    input('url-input').setSelectionRange(8, 19);
    await paste('naver.com');
    expect(form.urlValue).toBe('https://naver.com/path');
    expect(mocks.duplicate.mock.calls[0][0]).toBe('https://naver.com/path');
  });

  it.each(['request', 'missing-title'])(
    '메타 실패(%s)는 토스트와 제목 포커스로 안내한다',
    async reason => {
      if (reason === 'request') mocks.scrape.mockRejectedValueOnce(new Error('test failure'));
      else mocks.scrape.mockResolvedValueOnce(metadata(''));
      await paste('example.com');
      await advance();
      await advance(32);
      expect(mocks.toast).toHaveBeenCalledTimes(1);
      expect(mocks.toast.mock.calls[0][0].message).toBe(
        '링크 정보를 불러오지 못했습니다. 제목을 직접 입력해 주세요.'
      );
      expect(document.activeElement).toBe(input('title-input'));
      expect(form.hasEditedTitle).toBe(false);
      if (reason === 'missing-title') expect(form.previewImageUrl).toBe(metadata().image);
    }
  );

  it('메모를 선택한 사용자의 포커스를 실패 응답이 빼앗지 않는다', async () => {
    mocks.scrape.mockResolvedValueOnce(metadata(''));
    await paste('example.com');
    input('memo-input').focus();
    await advance();
    await advance(32);
    expect(document.activeElement).toBe(input('memo-input'));
  });

  it('100자를 넘는 자동 제목은 잘라서 유효한 폼 값으로 채운다', async () => {
    mocks.scrape.mockResolvedValueOnce(metadata('가'.repeat(130)));
    await paste('example.com');
    await advance();
    expect(form.titleValue).toHaveLength(100);
    let valid = false;
    await act(async () => {
      valid = await form.form.trigger();
    });
    expect(valid).toBe(true);
  });

  it('사용자가 제목을 지운 이력은 자동 수집이 덮어쓰지 않는다', async () => {
    await type('title-input', '직접 입력');
    await type('title-input', '');
    await paste('example.com');
    await advance();
    expect(form.hasEditedTitle).toBe(true);
    expect(form.titleValue).toBe('');
  });

  it('URL 변경 후 도착한 이전 메타 응답은 반영하지 않는다', async () => {
    let resolve!: (data: ReturnType<typeof metadata>) => void;
    mocks.scrape.mockReturnValueOnce(
      new Promise(done => {
        resolve = done;
      })
    );
    await paste('example.com');
    await advance();
    await type('url-input', '입력 중');
    await act(async () => resolve(metadata('오래된 제목')));
    expect(form.titleValue).toBe('');
    expect(form.metaData).toBeNull();
    expect(mocks.toast).not.toHaveBeenCalled();
  });
});
