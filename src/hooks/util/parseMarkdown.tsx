// HTML 특수문자 이스케이프 (XSS 방지)
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseMarkdown(text: string): string {
  if (!text || typeof text !== 'string') return '';
  // 1단계: 코드블록을 먼저 플레이스홀더로 추출 (내부 내용이 다른 regex에 오염되지 않도록)
  const codeBlocks: string[] = [];
  let processed = text.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) => {
    const index = codeBlocks.length;
    codeBlocks.push(
      `<pre class="bg-gray800 text-green400 rounded p-3 text-sm overflow-x-auto my-2"><code>${escapeHtml(code)}</code></pre>`
    );
    return `%%CODEBLOCK_${index}%%`;
  });

  // 2단계: 인라인 코드도 플레이스홀더로 추출
  const inlineCodes: string[] = [];
  processed = processed.replace(/`([^`]+)`/g, (_, code) => {
    const index = inlineCodes.length;
    inlineCodes.push(`<code class="bg-gray200 rounded px-1 text-sm">${escapeHtml(code)}</code>`);
    return `%%INLINECODE_${index}%%`;
  });

  // 일반 텍스트 구간의 raw HTML 차단
  processed = escapeHtml(processed);

  // 3단계: 나머지 마크다운 변환 (코드블록 밖에서만 적용됨)
  processed = processed
    // 헤딩
    .replace(
      /^### (.+)$/gm,
      (_, g1) => `<h3 class="text-base font-semibold mt-3 mb-1">${escapeHtml(g1)}</h3>`
    )
    .replace(
      /^## (.+)$/gm,
      (_, g1) => `<h2 class="text-lg font-semibold mt-4 mb-1">${escapeHtml(g1)}</h2>`
    )
    .replace(
      /^# (.+)$/gm,
      (_, g1) => `<h1 class="text-xl font-bold mt-4 mb-2">${escapeHtml(g1)}</h1>`
    )
    // bold
    .replace(
      /\*\*(.+?)\*\*/g,
      (_, g1) => `<strong class="font-semibold">${escapeHtml(g1)}</strong>`
    )
    // 리스트
    .replace(/^\s*- (.+)$/gm, (_, g1) => `<li class="ml-4 list-disc">${escapeHtml(g1)}</li>`)
    // 표
    .replace(/(\|.+\|\n)((\|[-:| ]+\|\n))((\|.+\|\n?)+)/g, match => {
      const rows = match.trim().split('\n');
      const headers = rows[0]
        .split('|')
        .filter(Boolean)
        .map(
          h =>
            `<th class="border border-gray300 px-3 py-1 bg-gray100 font-semibold text-left">${escapeHtml(h.trim())}</th>`
        )
        .join('');
      const bodyRows = rows
        .slice(2)
        .map(row => {
          const cells = row
            .split('|')
            .filter(Boolean)
            .map(c => `<td class="border border-gray300 px-3 py-1">${escapeHtml(c.trim())}</td>`)
            .join('');
          return `<tr>${cells}</tr>`;
        })
        .join('');
      return `<table class="border-collapse w-full my-3 text-sm"><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    })
    // 줄바꿈
    .replace(/\n(?!<)/g, '<br/>');

  // 4단계: 플레이스홀더를 실제 HTML로 복원
  processed = processed.replace(/%%INLINECODE_(\d+)%%/g, (_, i) => inlineCodes[Number(i)]);
  processed = processed.replace(/%%CODEBLOCK_(\d+)%%/g, (_, i) => codeBlocks[Number(i)]);

  return processed;
}

export default function MarkdownRenderer({
  content,
  className,
}: {
  content: string;
  className: string;
}) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: parseMarkdown(content ?? '') }} />
  );
}
