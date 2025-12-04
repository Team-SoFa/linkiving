import Button from '../../Button/Button';

const AddSummaryButton = () => {
  const onSummaryGenerate = () => {
    console.log('요약 생성 요청');
  };
  return (
    <Button
      icon="IC_SumGenerate"
      label="요약 생성"
      variant="tertiary_subtle"
      size="sm"
      className="w-[93px]"
      aria-label="요약 생성 버튼"
      onClick={onSummaryGenerate}
    />
  );
};

export default AddSummaryButton;
