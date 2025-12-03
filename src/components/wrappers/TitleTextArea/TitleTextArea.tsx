import TextArea from '../../basics/TextArea/TextArea';

interface TitleTextAreaProps {
  value: string;
  onChange: (value: string) => void;
}

const TitleTextArea = ({ value, onChange }: TitleTextAreaProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <TextArea
      value={value}
      heightLines={2}
      maxHeightLines={3}
      maxLength={100}
      onChange={handleChange}
    />
  );
};

export default TitleTextArea;
