import Button from '@/components/basics/Button/Button';
import Modal from '@/components/basics/Modal/Modal';
import TextArea from '@/components/basics/TextArea/TextArea';
import usePostReport from '@/hooks/usePostReport';
import { useModalStore } from '@/stores/modalStore';
import { FormEvent, useState } from 'react';

const ReportModal = () => {
  const { close } = useModalStore();
  const [content, setContent] = useState('');
  const [validationError, setValidationError] = useState('');
  const { submit, isLoading } = usePostReport(() => {
    setValidationError('');
    close();
  });

  const validate = (value: string): boolean => {
    if (value.length < 5) {
      setValidationError('최소 5자 이상 입력해주세요.');
      return false;
    }
    if (value.length > 500) {
      setValidationError('500자 이내로 입력해주세요.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validate(content)) return;

    submit({ content });
  };

  return (
    <Modal type="REPORT">
      <form onSubmit={handleSubmit} className="flex w-full max-w-150 flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <span className="font-title-md">문제 보내기</span>
          <div className="flex flex-col">
            <span className="font-body-md">
              어떤 점이 마음에 들지 않으셨나요? 자세한 답변을 알려주시면 더 좋은 서비스를 만드는 데
              도움이 됩니다.
            </span>
          </div>
        </div>
        <div>
          <TextArea
            id="report-content"
            value={content}
            placeholder="어떤 문제를 겪으셨나요?"
            radius="lg"
            heightLines={4}
            maxHeightLines={4}
            showMax
            maxLength={500}
            className="w-150"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? 'report-error' : undefined}
            onChange={e => {
              const next = e.target.value;
              setContent(next);
              validate(next);
            }}
          />

          {validationError && (
            <p id="report-error" role="alert" className="text-red500 text-sm">
              {validationError}
            </p>
          )}
        </div>
        <Button
          type="submit"
          label="제출하기"
          disabled={content.length < 5 || content.length > 500 || isLoading}
        />
      </form>
    </Modal>
  );
};

export default ReportModal;
