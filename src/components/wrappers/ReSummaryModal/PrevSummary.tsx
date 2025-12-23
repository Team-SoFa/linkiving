export default function PrevSummary({ content }: { content: string }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <span className="font-label-sm">기존 요약</span>
      <div className="rounded-lg bg-white p-2">
        <div className="custom-scrollbar font-body-md h-45 overflow-auto pr-1">{content}</div>
      </div>
    </div>
  );
}
