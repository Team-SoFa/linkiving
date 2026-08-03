import { ApiResponseBase } from './linkApi';

export interface TermsAgreementRequest {
  termsAgreed: true;
  privacyAgreed: true;
  termsVersion: string;
  privacyVersion: string;
}

export type TermsAgreementResponse = ApiResponseBase<{
  accessToken?: string;
  refreshToken?: string;
} | null>;
