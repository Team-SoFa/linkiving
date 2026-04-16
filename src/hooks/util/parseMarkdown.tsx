import { memo, useMemo } from 'react';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const formatInline = (raw: string) => {
  if (!raw) return '';

  const escaped = escapeHtml(raw);

  // Bold 처리
  const boldTokens: string[] = [];
  const tokenized = escaped.replace(/\*\*(.+?)\*\*/g, (_, g1) => {
    const index = boldTokens.length;
    boldTokens.push(`<strong class="font-semibold">${g1}</strong>`);
    return `%%BOLD_${index}%%`;
  });

  // 인라인 코드 처리
  const inlineTokens: string[] = [];
  const inlineProcessed = tokenized.replace(/`([^`]+)`/g, (_, code) => {
    const index = inlineTokens.length;
    inlineTokens.push(`<code class="bg-gray200 rounded px-1 text-sm">${code}</code>`);
    return `%%INLINE_${index}%%`;
  });

  // placeholder 복원
  let restored = inlineProcessed.replace(/%%BOLD_(\d+)%%/g, (_, i) => boldTokens[Number(i)]);
  restored = restored.replace(/%%INLINE_(\d+)%%/g, (_, i) => inlineTokens[Number(i)]);

  return restored;
};

function parseMarkdown(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // 코드블록 추출
  const codeBlocks: string[] = [];
  let processed = text.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) => {
    const index = codeBlocks.length;
    codeBlocks.push(
      `<pre class="bg-gray800 text-green400 rounded p-3 text-sm overflow-x-auto my-2"><code>${escapeHtml(
        code
      )}</code></pre>`
    );
    return `%%CODEBLOCK_${index}%%`;
  });

  // 라인 단위로 처리
  // 라인 단위로 처리
  const lines = processed.split('\n');
  const result: string[] = [];

  const listStack: string[][] = []; // depth별 리스트 스택

  const flushAllLists = () => {
    while (listStack.length > 0) {
      const items = listStack.pop();
      if (items) {
        result.push(`<ul class="my-1 pl-3">${items.join('')}</ul>`);
      }
    }
  };

  for (const line of lines) {
    const trimmed = line.replace(/\t/g, '  '); // 탭 방지

    const listMatch = trimmed.match(/^(\s*)- (.+)$/);
    if (listMatch) {
      const indent = listMatch[1].length;
      const depth = Math.floor(indent / 2); // 2칸 기준 (필요하면 4로 변경)

      // depth 맞추기
      while (listStack.length > depth) {
        const items = listStack.pop();
        if (items) {
          result.push(`<ul class="my-2 pl-3">${items.join('')}</ul>`);
        }
      }

      while (listStack.length < depth) {
        listStack.push([]);
      }

      if (!listStack[depth]) {
        listStack[depth] = [];
      }

      listStack[depth].push(
        `<li class="ml-${depth * 4} list-disc my-0.5">${formatInline(listMatch[2])}</li>`
      );

      continue;
    } else {
      flushAllLists();
    }

    // 기존 헤딩 / 텍스트 처리 유지
    const clean = line.trim();

    if (/^### (.+)/.test(clean)) {
      result.push(
        `<h3 class="text-base font-semibold mt-3 mb-1">${escapeHtml(clean.replace(/^### /, ''))}</h3>`
      );
      continue;
    }
    if (/^## (.+)/.test(clean)) {
      result.push(
        `<h2 class="text-lg font-semibold mt-4 mb-1">${escapeHtml(clean.replace(/^## /, ''))}</h2>`
      );
      continue;
    }
    if (/^# (.+)/.test(clean)) {
      result.push(
        `<h1 class="text-xl font-bold mt-4 mb-2">${escapeHtml(clean.replace(/^# /, ''))}</h1>`
      );
      continue;
    }

    result.push(formatInline(clean));
  }

  flushAllLists();
  processed = result.join('');

  // 코드블록 placeholder 복원
  processed = processed.replace(/%%CODEBLOCK_(\d+)%%/g, (_, i) => codeBlocks[Number(i)]);

  return processed;
}

export default memo(function MarkdownRenderer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const html = useMemo(() => parseMarkdown(content ?? ''), [content]);
  return <div className={`px-4 ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: html }} />;
});
