'use client';

import Button from '@/components/basics/Button/Button';
import Divider from '@/components/basics/Divider/Divider';
import Input from '@/components/basics/Input/Input';
import Modal from '@/components/basics/Modal/Modal';
import TextArea from '@/components/basics/TextArea/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const addLinkSchema = z.object({
  url: z.string().url({ message: '유효한 URL을 입력해주세요.' }),
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  memo: z.string().optional(),
});
type AddLinkForm = z.infer<typeof addLinkSchema>;

const AddLinkModal = () => {
  const [imageUrl] = useState('/file.svg');
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddLinkForm>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: { url: '', title: '', memo: '' },
    mode: 'all', // 유효성 검사
  });

  const onSubmit = (data: AddLinkForm) => {
    console.log(data);
  };

  return (
    <Modal type="ADD_LINK">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span>URL</span>
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="URL을 입력해주세요" className="w-full" />
            )}
          />
          {errors.url && <span className="text-red500 text-xs">{errors.url.message}</span>}
        </div>
        <Divider width={2} />
        <div className="flex flex-col gap-1">
          <span>Contents</span>
          <div className="flex items-center gap-2">
            <div className="border-gray100 relative h-28 w-42 rounded-2xl border bg-white">
              <Image src={imageUrl} alt="link thumbnail" fill />
            </div>
            <div className="flex flex-col">
              <span>Title</span>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="제목을 입력해주세요"
                    widthPx={400}
                    radius="lg"
                    heightLines={2}
                    maxHeightLines={2}
                    maxLength={100}
                  />
                )}
              />
              {errors.title && <span className="text-red500 text-xs">{errors.title.message}</span>}
            </div>
          </div>
        </div>
        <Divider width={2} />
        <div className="flex flex-col">
          <span>Memo</span>
          <Controller
            name="memo"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                value={field.value ?? ''}
                placeholder="메모를 입력해주세요"
                radius="lg"
                widthPx={576}
                heightLines={3}
                maxHeightLines={3}
                maxLength={600}
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
