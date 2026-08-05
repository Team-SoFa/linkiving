import { clientApiClient } from '@/lib/client/apiClient';
import type { TermsAgreementRequest, TermsAgreementResponse } from '@/types/api/termsApi';

export const agreeTerms = async (data: TermsAgreementRequest) => {
  return clientApiClient<TermsAgreementResponse>('/api/member/terms-agreement', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
