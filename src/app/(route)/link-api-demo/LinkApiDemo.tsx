'use client';

import Button from '@/components/basics/Button/Button';
import Input from '@/components/basics/Input/Input';
import Label from '@/components/basics/Label/Label';
import TextArea from '@/components/basics/TextArea/TextArea';
import { useCheckDuplicateLink } from '@/hooks/useCheckDuplicateLink';
import { useDeleteLink } from '@/hooks/useDeleteLink';
import { useGetLinks } from '@/hooks/useGetLinks';
import { usePostLinks } from '@/hooks/usePostLinks';
import { useUpdateLinkMemo } from '@/hooks/useUpdateLinkMemo';
import { useUpdateLinkTitle } from '@/hooks/useUpdateLinkTitle';
import type { Link } from '@/types/link';
import { useEffect, useMemo, useState } from 'react';

const defaultCreate = {
  url: '',
  title: '',
  memo: '',
  imageUrl: '',
  metadataJson: '',
  tags: '',
  isImportant: false,
};

export default function LinkApiDemo() {
  const [createForm, setCreateForm] = useState(defaultCreate);
  const [duplicateUrl, setDuplicateUrl] = useState('');
  const [duplicateQueryUrl, setDuplicateQueryUrl] = useState<string | undefined>();
  const { data, isLoading, isError, refetch } = useGetLinks({ page: 0, size: 20 });
  const createMut = usePostLinks();
  const deleteMut = useDeleteLink();
  const updateTitleMut = useUpdateLinkTitle();
  const updateMemoMut = useUpdateLinkMemo();
  const {
    data: duplicateResult,
    isFetching: isCheckingDuplicate,
    error: duplicateError,
  } = useCheckDuplicateLink(duplicateQueryUrl);

  useEffect(() => {
    if (createMut.isSuccess) {
      setCreateForm(defaultCreate);
    }
  }, [createMut.isSuccess]);

  const links = useMemo(() => data?.content ?? [], [data]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMut.mutateAsync(createForm);
    } catch {
      // 에러는 createMut.isError를 통해 UI에서 표시
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMut.mutateAsync(id);
    } catch {
      // 에러는 LinkCardRow 혹은 deleteMut.isError를 통해 표시
    }
  };

  const handleUpdateTitle = async (id: number, title: string) => {
    await updateTitleMut.mutateAsync({ id, title });
  };

  const handleUpdateMemo = async (id: number, memo: string) => {
    await updateMemoMut.mutateAsync({ id, memo });
  };

  const handleCheckDuplicate = (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateQueryUrl(duplicateUrl);
  };

  const renderStatus = () => {
    if (isLoading) return <span className="text-gray600">불러오는 중...</span>;
    if (isError) return <span className="text-red500">목록을 불러오지 못했습니다.</span>;
    return null;
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Link API 데모</h1>
        <p className="text-gray600">
          목록 조회, 생성, 제목/메모 수정, 삭제, 중복 확인을 한 눈에 확인할 수 있습니다.
        </p>
      </header>

      {/* 생성 */}
      <section className="border-gray200 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">새 링크 생성</h2>
        <form className="mt-4 grid grid-cols-2 gap-4" onSubmit={handleCreate}>
          <div className="col-span-2 flex flex-col gap-2">
            <Label htmlFor="create-url">URL</Label>
            <Input
              id="create-url"
              value={createForm.url}
              placeholder="https://example.com"
              onChange={e => setCreateForm(prev => ({ ...prev, url: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-title">제목</Label>
            <Input
              id="create-title"
              value={createForm.title}
              placeholder="링크 제목"
              onChange={e => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-tags">태그 (콤마 구분)</Label>
            <Input
              id="create-tags"
              value={createForm.tags}
              placeholder="예) 개발,자료,참고"
              onChange={e => setCreateForm(prev => ({ ...prev, tags: e.target.value }))}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <Label htmlFor="create-memo">메모</Label>
            <TextArea
              id="create-memo"
              value={createForm.memo}
              onChange={e => setCreateForm(prev => ({ ...prev, memo: e.target.value }))}
              placeholder="나중에 읽어볼 것"
              heightLines={2}
              maxHeightLines={4}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button
              type="submit"
              label={createMut.isPending ? '생성 중...' : '생성하기'}
              disabled={!createForm.url || !createForm.title || createMut.isPending}
            />
            {createMut.isError && (
              <span className="text-red500 text-sm">생성 실패: {createMut.error?.message}</span>
            )}
            {createMut.isSuccess && (
              <span className="text-green600 text-sm">생성 완료! 목록을 새로고침했습니다.</span>
            )}
          </div>
        </form>
      </section>

      {/* 중복 체크 */}
      <section className="border-gray200 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">URL 중복 체크</h2>
        <form className="mt-3 flex flex-wrap items-center gap-3" onSubmit={handleCheckDuplicate}>
          <Input
            className="min-w-80 flex-1"
            value={duplicateUrl}
            placeholder="중복을 확인할 URL 입력"
            onChange={e => setDuplicateUrl(e.target.value)}
          />
          <Button type="submit" label={isCheckingDuplicate ? '확인 중...' : '중복 확인'} />
          {duplicateError && <span className="text-red500 text-sm">{duplicateError.message}</span>}
          {duplicateQueryUrl && !isCheckingDuplicate && !duplicateError && duplicateResult && (
            <span
              className={`text-sm ${duplicateResult.exists ? 'text-red600' : 'text-green600'}`}
              data-testid="duplicate-result"
            >
              {duplicateResult.exists
                ? `이미 존재하는 URL입니다${duplicateResult.linkId ? ` (id: ${duplicateResult.linkId})` : ''}.`
                : '사용 가능한 URL입니다.'}
            </span>
          )}
        </form>
      </section>

      {/* 목록 */}
      <section className="border-gray200 rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">링크 목록</h2>
            <p className="text-gray600 text-sm">총 {data?.totalElements ?? 0}개</p>
          </div>
          <Button variant="secondary" label="새로고침" onClick={() => refetch()} />
        </div>
        {renderStatus()}
        {!isLoading && links.length === 0 && (
          <p className="text-gray600">표시할 링크가 없습니다. 새 링크를 생성해 보세요.</p>
        )}
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {links.map(link => (
            <LinkCardRow
              key={link.id}
              link={link}
              onDelete={handleDelete}
              onUpdateTitle={handleUpdateTitle}
              onUpdateMemo={handleUpdateMemo}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function LinkCardRow({
  link,
  onDelete,
  onUpdateTitle,
  onUpdateMemo,
}: {
  link: Link;
  onDelete: (id: number) => Promise<void>;
  onUpdateTitle: (id: number, title: string) => Promise<void>;
  onUpdateMemo: (id: number, memo: string) => Promise<void>;
}) {
  const [nextTitle, setNextTitle] = useState(link.title);
  const [nextMemo, setNextMemo] = useState(link.memo ?? '');
  const [saving, setSaving] = useState<'title' | 'memo' | 'delete' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNextTitle(link.title);
    setNextMemo(link.memo ?? '');
  }, [link.title, link.memo]);

  const handleTitleSave = async () => {
    setSaving('title');
    setError(null);
    try {
      await onUpdateTitle(link.id, nextTitle);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleMemoSave = async () => {
    setSaving('memo');
    setError(null);
    try {
      await onUpdateMemo(link.id, nextMemo);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async () => {
    setSaving('delete');
    setError(null);
    try {
      await onDelete(link.id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="border-gray200 flex flex-col gap-3 rounded-lg border p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-gray500 text-sm">#{link.id}</span>
          <a
            href={link.url}
            className="text-blue600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.url}
          </a>
          <span className="text-gray500 text-xs">
            생성: {new Date(link.createdAt).toLocaleString()}
          </span>
        </div>
        <Button
          size="sm"
          variant="tertiary_neutral"
          label={saving === 'delete' ? '삭제 중...' : '삭제'}
          onClick={handleDelete}
          disabled={saving !== null}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`title-${link.id}`}>제목</Label>
        <div className="flex gap-2">
          <Input
            id={`title-${link.id}`}
            value={nextTitle}
            onChange={e => setNextTitle(e.target.value)}
            className="flex-1"
          />
          <Button
            size="sm"
            label={saving === 'title' ? '저장 중...' : '제목 수정'}
            onClick={handleTitleSave}
            disabled={saving !== null}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`memo-${link.id}`}>메모</Label>
        <TextArea
          id={`memo-${link.id}`}
          value={nextMemo}
          onChange={e => setNextMemo(e.target.value)}
          heightLines={2}
          maxHeightLines={4}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="secondary"
            label={saving === 'memo' ? '저장 중...' : '메모 수정'}
            onClick={handleMemoSave}
            disabled={saving !== null}
          />
        </div>
      </div>

      {link.tags && <p className="text-gray600 text-sm">태그: {link.tags}</p>}
      {link.isImportant && <p className="text-amber600 text-sm">중요 표시됨</p>}
      {error && <p className="text-red500 text-sm">오류: {error}</p>}
    </div>
  );
}
