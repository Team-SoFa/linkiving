'use client';

import Anchor from '@/components/basics/Anchor/Anchor';
import Button from '@/components/basics/Button/Button';
import IconButton from '@/components/basics/IconButton/IconButton';
import Label from '@/components/basics/Label/Label';
import Skeleton from '@/components/basics/Skeleton/Skeleton';
import TextArea from '@/components/basics/TextArea/TextArea';
import { useDuplicateLinkMutation } from '@/hooks/useCheckDuplicateLink';
import { usePostLinkMetaScrape } from '@/hooks/usePostLinkMetaScrape';
import { usePostLinks } from '@/hooks/usePostLinks';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import AddLinkUrlInput from './AddLinkUrlInput';

interface LinkItem {
  id: string;
  url: string;
  title: string;
  memo: string;
  thumbnailUrl: string | null;
  status: 'loading' | 'success' | 'error' | 'idle';
}

interface AddMultiLinksProps {
  onToggle: () => void;
}

export default function AddMultiLinks({ onToggle }: AddMultiLinksProps) {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const duplicateCheck = useDuplicateLinkMutation();
  const metaScrape = usePostLinkMetaScrape();
  const queryClient = useQueryClient();
  const createLink = usePostLinks({ skipInvalidate: true });
  const { close } = useModalStore();

  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    if (urlError) setUrlError(null);
  };

  const handleAdd = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed || isChecking) return;

    let normalizedUrl = '';

    try {
      const parsed = new URL(trimmed);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Unsupported protocol');
      }
      normalizedUrl = parsed.toString();
    } catch {
      setUrlError('유효하지 않은 링크 주소입니다. URL을 다시 확인해 주세요.');
      return;
    }

    if (links.some(l => l.url === normalizedUrl)) {
      setUrlError('이미 추가한 주소입니다.');
      return;
    }

    setIsChecking(true);
    try {
      const { exists } = await duplicateCheck.mutateAsync(normalizedUrl);
      if (exists) {
        setUrlError('이미 추가한 주소입니다.');
        setIsChecking(false);
        return;
      }
    } catch {
      // 중복 체크 실패 시 계속 진행
    }
    setIsChecking(false);

    const newId = crypto.randomUUID();
    setLinks(prev => [
      ...prev,
      {
        id: newId,
        url: normalizedUrl,
        title: '',
        memo: '',
        thumbnailUrl: null,
        status: 'loading',
      },
    ]);
    setUrlInput('');
    inputRef.current?.focus();

    try {
      const meta = await metaScrape.mutateAsync(normalizedUrl);
      setLinks(prev =>
        prev.map(l =>
          l.id === newId
            ? { ...l, title: meta.title ?? '', thumbnailUrl: meta.image ?? null, status: 'success' }
            : l
        )
      );
    } catch {
      setLinks(prev => prev.map(l => (l.id === newId ? { ...l, status: 'error' } : l)));
    }
  };

  const handleUpdateField = (id: string, field: 'title' | 'memo', value: string) => {
    setLinks(prev => prev.map(l => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleRemove = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const results = await Promise.allSettled(
      links.map(link =>
        createLink.mutateAsync({
          url: link.url,
          title: link.title || link.url,
          memo: link.memo || undefined,
          imageUrl: link.thumbnailUrl || undefined,
        })
      )
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failCount = results.filter(r => r.status === 'rejected').length;

    if (successCount > 0) {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    }

    const succeededIds = new Set(
      links.filter((_, i) => results[i].status === 'fulfilled').map(l => l.id)
    );
    setLinks(prev => prev.filter(l => !succeededIds.has(l.id)));

    setIsSaving(false);

    if (failCount === 0) {
      showToast({
        message: `${successCount}개 링크가 저장되었습니다.`,
        variant: 'success',
        showIcon: true,
        placement: 'modal-bottom',
        actionLabel: '저장된 링크 확인',
        actionLabelIcon: 'IC_AllLink',
        onAction: () => {
          router.push('/all-link');
        },
      });
      close();
    } else {
      showToast({
        message: `${successCount}개 저장 완료, ${failCount}개 저장에 실패했습니다.`,
        variant: 'error',
        showIcon: true,
        placement: 'modal-bottom',
      });
    }
  };

  const isLoading = links.some(l => l.status === 'loading');

  return (
    <div className="m-6 flex flex-col gap-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="font-title-sm">새 링크 추가</h2>
        <Button variant="secondary" size="sm" label="한 개씩 추가하기" onClick={onToggle} />
      </div>

      {/* URL 입력 */}
      <div className="flex flex-col gap-1">
        <Label>링크 주소</Label>
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <AddLinkUrlInput
              ref={inputRef}
              value={urlInput}
              id="url-input"
              placeholder="URL을 입력하고 + 버튼을 누르세요."
              onChange={handleUrlChange}
              errorMessage={urlError ?? undefined}
            />
          </div>
          <IconButton
            icon="IC_LinkAdd"
            variant="tertiary_subtle"
            contextStyle="onPanel"
            ariaLabel="저장할 링크 리스트에 추가"
            onClick={handleAdd}
            disabled={isChecking || !!urlError}
          />
        </div>
      </div>

      {/* 리스트 */}
      {links.length > 0 && (
        <div className="flex flex-col overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-[6rem_1fr_1fr_2rem] gap-3 border-b border-gray-200 px-3 py-2">
            <span className="text-gray500 font-body-sm">썸네일</span>
            <span className="text-gray500 font-body-sm">제목 / 링크</span>
            <span className="text-gray500 font-body-sm">메모</span>
            <span />
          </div>

          {/* 스크롤 영역 */}
          <div className="custom-scrollbar max-h-72 overflow-x-hidden overflow-y-auto">
            {links.map(link => (
              <div
                key={link.id}
                className="grid grid-cols-[6rem_1fr_1fr_2rem] items-center gap-3 px-3 py-2.5"
              >
                {/* 썸네일 */}
                <div className="bg-gray100 relative h-14 w-full shrink-0 overflow-hidden rounded-md">
                  {link.status === 'loading' ? (
                    <Skeleton className="h-full w-full" radius="lg" animated />
                  ) : link.thumbnailUrl ? (
                    <Image src={link.thumbnailUrl} alt="" fill className="object-cover" />
                  ) : (
                    <Image
                      src={'/images/default_linkcard_image.png'}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* 제목 / 링크 */}
                <div className="flex max-w-80 min-w-0 flex-col gap-1">
                  {link.status === 'loading' ? (
                    <>
                      <Skeleton className="h-3.5 w-3/4 rounded" animated />
                      <Skeleton className="h-3 w-1/2 rounded" animated />
                    </>
                  ) : (
                    <>
                      <TextArea
                        value={link.title}
                        onChange={e => handleUpdateField(link.id, 'title', e.target.value)}
                        placeholder="제목을 직접 입력해 주세요."
                        textSize="sm"
                        heightLines={1}
                        maxHeightLines={1}
                      />

                      <Anchor href={link.url}>{link.url}</Anchor>
                    </>
                  )}
                </div>

                {/* 메모 */}
                <div className="max-w-80 min-w-0">
                  {link.status === 'loading' ? (
                    <div className="h-3.5 w-full animate-pulse rounded bg-gray-200" />
                  ) : (
                    <TextArea
                      value={link.memo}
                      heightLines={2}
                      textSize="sm"
                      placeholder="메모를 입력해주세요"
                      onChange={e => handleUpdateField(link.id, 'memo', e.target.value)}
                    />
                  )}
                </div>

                {/* 삭제 */}
                <IconButton
                  icon="IC_Delete"
                  variant="tertiary_subtle"
                  contextStyle="onPanel"
                  ariaLabel="링크 리스트에서 삭제"
                  onClick={() => handleRemove(link.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 저장 버튼 */}
      <Button
        disabled={links.length === 0 || isLoading || isSaving}
        label={isSaving ? '저장 중...' : isLoading ? '크롤링 중...' : `${links.length}개 저장하기`}
        onClick={handleSave}
      />
    </div>
  );
}
