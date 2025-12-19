import TextArea from '@/components/basics/TextArea/TextArea';

export interface UserChatBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e?: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}
export default function UserChatBox({ value, onChange, onSubmit }: UserChatBoxProps) {
  return (
    <div className="max-w-150">
      <TextArea
        color="blue"
        value={value}
        radius="lg"
        heightLines={1}
        maxHeightLines={6}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
