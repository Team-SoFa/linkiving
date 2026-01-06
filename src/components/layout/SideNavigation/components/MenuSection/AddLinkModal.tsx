'use client';

import Button from '@/components/basics/Button/Button';
import Label from '@/components/basics/Label/Label';
import Modal from '@/components/basics/Modal/Modal';
import TextArea from '@/components/basics/TextArea/TextArea';
import { useModalStore } from '@/stores/modalStore';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import AddLinkUrlInput from '../AddLinkUrlInput';

const addLinkSchema = z.object({
  url: z.string().url({ message: '유효하지 않은 링크 주소입니다. URL을 다시 확인해주세요.' }),
  title: z.string().min(1, { message: '제목을 입력해 주세요.' }),
  memo: z.string().optional(),
});
type AddLinkForm = z.infer<typeof addLinkSchema>;

const AddLinkModal = () => {
  const { close } = useModalStore();
  const [imageUrl] = useState('/file.svg');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddLinkForm>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: { url: '', title: '', memo: '' },
    mode: 'all',
  });

  const onSubmit = (data: AddLinkForm) => {
    console.log(data);
    close();
  };

  return (
    <Modal type="ADD_LINK" className="m-10 min-w-150">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="url-input">링크 주소</Label>
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <AddLinkUrlInput
                {...field}
                id="url-input"
                placeholder="URL을 입력해 주세요"
                onChange={field.onChange}
                errorMessage={errors.url?.message}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col">
              <Label>썸네일</Label>
              <div className="relative h-23 rounded-lg bg-white">
                <Image src={imageUrl} alt="link thumbnail" fill />
              </div>
            </div>
            <div className="flex flex-3 flex-col">
              <Label htmlFor="title-input">제목</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="제목을 입력해 주세요"
                    id="title-input"
                    radius="lg"
                    heightLines={2}
                    maxHeightLines={2}
                    maxLength={100}
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e)}
                  />
                )}
              />
              {errors.title && <span className="text-red500 text-xs">{errors.title.message}</span>}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <Label htmlFor="memo-input">메모</Label>
          <Controller
            name="memo"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                id="memo-input"
                placeholder="메모를 입력해 주세요"
                radius="lg"
                heightLines={3}
                maxHeightLines={3}
                maxLength={600}
                value={field.value ?? ''}
                onChange={e => field.onChange(e)}
              />
            )}
          />
        </div>
        <Button type="submit" label="제출하기" disabled={!isValid} />
      </form>
    </Modal>
  );
};

AddLinkModal.displayName = 'AddLinkModal';
export default AddLinkModal;
