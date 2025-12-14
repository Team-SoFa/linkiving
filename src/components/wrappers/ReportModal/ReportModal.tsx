import Button from '@/components/basics/Button/Button';
import Modal from '@/components/basics/Modal/Modal';
import TextArea from '@/components/basics/TextArea/TextArea';
import { useModalStore } from '@/stores/modalStore';
import { showToast } from '@/stores/toastStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const reportSchema = z.object({
  content: z.string().min(5, '최소 5자 이상 입력해주세요.').max(500, '500자 이내로 입력해 주세요.'),
});

type ReportForm = z.infer<typeof reportSchema>;

const ReportModal = () => {
  const { close } = useModalStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: { content: '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: ReportForm) => {
    try {
      // TODO: 실제 신고 API 호출
      console.log('신고 내용: ', data.content);

      reset();
      showToast({
        id: 'report-submit-toast',
        message: '신고가 제출되었습니다.',
        variant: 'success',
        duration: 2000,
      });
      close();
    } catch (err) {
      if (err instanceof Error) {
        alert(`${err.message}: 제출에 실패했습니다.`);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <Modal type="REPORT">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="font-title-md">발생한 문제 상황을 알려주세요</span>
          <span>작성해주신 의견은 더 나은 서비스를 제공하는데에 참고하겠습니다😊</span>
        </div>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextArea
              placeholder="신고할 내용을 입력해주세요."
              heightLines={5}
              className="w-150"
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.content && <p className="text-red500 text-sm">{errors.content.message}</p>}
        <Button type="submit" label="제출하기" disabled={!isValid || isSubmitting} />
      </form>
    </Modal>
  );
};

export default ReportModal;
