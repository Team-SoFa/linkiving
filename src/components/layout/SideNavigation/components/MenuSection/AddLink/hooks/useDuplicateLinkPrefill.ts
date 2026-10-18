import type { Link } from '@/types/link';
import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { AddLinkForm } from './useAddLinkForm';

export function useDuplicateLinkPrefill(
  form: UseFormReturn<AddLinkForm>,
  isDuplicate: boolean,
  duplicateLinkData: Link | null,
  metaLoading: boolean,
  hasEditedTitle: boolean
) {
  useEffect(() => {
    if (!isDuplicate || !duplicateLinkData || metaLoading) return;
    if (!hasEditedTitle) {
      form.setValue('title', duplicateLinkData.title, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
    if (!form.formState.dirtyFields.memo) {
      form.setValue('memo', duplicateLinkData.memo ?? '', {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [isDuplicate, duplicateLinkData, metaLoading, form, hasEditedTitle]);
}
