import Label from '@/components/basics/Label/Label';
import Skeleton from '@/components/basics/Skeleton/Skeleton';
import Spinner from '@/components/basics/Spinner/Spinner';
import TextArea from '@/components/basics/TextArea/TextArea';
import Image from 'next/image';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import { AddLinkForm } from './hooks/useAddLinkForm';

interface Props {
  control: Control<AddLinkForm>;
  errors: FieldErrors<AddLinkForm>;
  metaLoading: boolean;
  isValidUrl: boolean;
  shouldDisableDetails: boolean;
  previewImageUrl: string;
}

export default function LinkThumbnailTitleSection({
  control,
  errors,
  metaLoading,
  isValidUrl,
  shouldDisableDetails,
  previewImageUrl,
}: Props) {
  return (
    <div className="flex gap-2">
      <div className="flex flex-1 flex-col">
        <Label>썸네일</Label>
        <div
          className={`relative h-[4.2rem] w-full overflow-hidden rounded-lg bg-white ${
            shouldDisableDetails ? 'opacity-60' : ''
          }`}
          aria-disabled={shouldDisableDetails}
        >
          {metaLoading && isValidUrl ? (
            <>
              <Skeleton className="h-full w-full" radius="lg" animated />
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            </>
          ) : (
            <Image src={previewImageUrl} alt="link thumbnail" fill />
          )}
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
              placeholder="제목을 입력해 주세요."
              id="title-input"
              radius="lg"
              heightLines={2}
              maxHeightLines={2}
              maxLength={100}
              isLoading={metaLoading && isValidUrl}
              disabled={shouldDisableDetails}
              value={field.value ?? ''}
              onChange={e => field.onChange(e)}
            />
          )}
        />
        {errors.title && !shouldDisableDetails && (
          <span className="text-red500 text-xs">{errors.title.message as string}</span>
        )}
      </div>
    </div>
  );
}
