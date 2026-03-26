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

  // Bold 처리
  const boldTokens: string[] = [];
  const tokenized = raw.replace(/\*\*(.+?)\*\*/g, (_, g1) => {
    const index = boldTokens.length;
    boldTokens.push(`<strong class="font-semibold">${escapeHtml(g1)}</strong>`);
    return `%%BOLD_${index}%%`;
  });

  // 인라인 코드 처리
  const inlineTokens: string[] = [];
  const inlineProcessed = tokenized.replace(/`([^`]+)`/g, (_, code) => {
    const index = inlineTokens.length;
    inlineTokens.push(`<code class="bg-gray200 rounded px-1 text-sm">${escapeHtml(code)}</code>`);
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
  const lines = processed.split('\n');
  const result: string[] = [];

  let inList = false;
  let listItems: string[] = [];
  const flushList = () => {
    if (!inList) return;
    result.push(`<ul class="my-2">${listItems.join('')}</ul>`);
    listItems = [];
    inList = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // 리스트 처리
    const listMatch = trimmed.match(/^- (.+)$/);
    if (listMatch) {
      inList = true;
      listItems.push(`<li class="ml-4 list-disc">${formatInline(listMatch[1])}</li>`);
      continue;
    } else {
      flushList();
    }

    // 헤딩 처리
    if (/^### (.+)/.test(trimmed)) {
      result.push(
        `<h3 class="text-base font-semibold mt-3 mb-1">${escapeHtml(trimmed.replace(/^### /, ''))}</h3>`
      );
      continue;
    }
    if (/^## (.+)/.test(trimmed)) {
      result.push(
        `<h2 class="text-lg font-semibold mt-4 mb-1">${escapeHtml(trimmed.replace(/^## /, ''))}</h2>`
      );
      continue;
    }
    if (/^# (.+)/.test(trimmed)) {
      result.push(
        `<h1 class="text-xl font-bold mt-4 mb-2">${escapeHtml(trimmed.replace(/^# /, ''))}</h1>`
      );
      continue;
    }

    // 일반 텍스트
    result.push(formatInline(trimmed));
  }

  flushList();

  processed = result.join('<br/>');

  // 코드블록 placeholder 복원
  processed = processed.replace(/%%CODEBLOCK_(\d+)%%/g, (_, i) => codeBlocks[Number(i)]);

  return processed;
}

export default function MarkdownRenderer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: parseMarkdown(content ?? '') }} />
  );
}
