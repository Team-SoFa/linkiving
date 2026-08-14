'use client';

import IcForward from '@/components/Icons/svgs/ic_forward.svg';
import Button from '@/components/basics/Button/Button';
import Checkbox from '@/components/basics/Checkbox/Checkbox';
import { useTermsAgreementSubmit } from '@/hooks/server/useTermsAgreement';
import Image from 'next/image';
import { useState } from 'react';

const TERMS_VERSION = '2026-08-03';
const PRIVACY_VERSION = '2026-08-03';

const COPY = {
  title: '\ub9c1\uce74\uc774\ube59 \uc774\uc6a9\uc57d\uad00 \ub3d9\uc758',
  description:
    '\ub9c1\uce74\uc774\ube59 \uc11c\ube44\uc2a4\ub97c \uc2dc\uc791\ud558\uae30 \uc704\ud574 \uc544\ub798 \uc57d\uad00 \ub3d9\uc758\uac00 \ud544\uc694\ud569\ub2c8\ub2e4',
  allAgreement: '\uc804\uccb4 \ub3d9\uc758',
  required: '(\ud544\uc218)',
  serviceTerms: '\uc774\uc6a9\uc57d\uad00 \ub3d9\uc758',
  privacyPolicy: '\uac1c\uc778\uc815\ubcf4 \ucc98\ub9ac\ubc29\uce68',
  more: '\ub354\ubcf4\uae30',
  submit: '\ub3d9\uc758\ud558\uace0 \uc2dc\uc791\ud558\uae30',
};

type TermKey = 'service' | 'privacy';

const TERM_URLS: Record<TermKey, string> = {
  service: 'https://linkiving.notion.site/3b1e28654151808499e4c3a8c06d727d?source=copy_link',
  privacy: 'https://linkiving.notion.site/v1-0-3b1e2865415180dfab49ea4c733666e5?source=copy_link',
};

const TermsPage = () => {
  const [serviceAgreed, setServiceAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const { submit, isPending } = useTermsAgreementSubmit();

  const allAgreed = serviceAgreed && privacyAgreed;

  const handleAllAgreementChange = (checked: boolean) => {
    setServiceAgreed(checked);
    setPrivacyAgreed(checked);
  };

  const handleSubmit = () => {
    if (!allAgreed || isPending) return;

    submit({
      termsAgreed: true,
      privacyAgreed: true,
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION,
    });
  };

  const renderMoreLink = (term: TermKey) => (
    <a
      href={TERM_URLS[term]}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray500 hover:text-gray700 flex shrink-0 items-center gap-1 text-[16px] leading-[160%] font-normal tracking-[-0.02em]"
    >
      <span>{COPY.more}</span>
      <IcForward className="text-gray400 size-6" aria-hidden="true" />
    </a>
  );

  return (
    <div className="bg-gray50 relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[34vh] min-h-56 w-full overflow-hidden">
        <Image
          src="/images/sofa_login_bg_resource.png"
          alt=""
          width={1920}
          height={1080}
          priority
          className="h-full w-full object-cover object-bottom"
        />
      </div>

      <section className="border-gray100 relative z-10 flex min-h-[570px] w-full max-w-[520px] flex-col items-center gap-20 rounded-2xl border bg-white p-8 shadow-[0_8px_30px_rgba(17,19,29,0.06)] sm:p-10">
        <div className="flex w-full flex-col items-center gap-[60px]">
          <Image
            src="/images/brand/full-logo-beta.svg"
            alt="Linkiving BETA"
            width={189}
            height={25}
            className="shrink-0"
            unoptimized
          />

          <div className="flex w-full flex-col gap-10">
            <div className="flex w-full flex-col gap-3">
              <h1 className="text-gray900 text-[28px] leading-[160%] font-semibold">
                {COPY.title}
              </h1>
              <p className="font-body-lg text-gray700">{COPY.description}</p>
            </div>

            <div className="flex w-full flex-col gap-5">
              <div className="flex h-8 items-center justify-between">
                <Checkbox
                  checked={allAgreed}
                  onChange={event => handleAllAgreementChange(event.target.checked)}
                  label={COPY.allAgreement}
                  labelClassName="text-[20px] leading-[160%] font-semibold"
                  checkboxSize="lg"
                  align="center"
                  disabled={isPending}
                />
              </div>

              <div className="border-gray200 w-full border-t" />

              <div className="flex flex-col gap-2">
                <div className="flex min-h-[29px] items-center justify-between gap-6">
                  <Checkbox
                    checked={serviceAgreed}
                    onChange={event => setServiceAgreed(event.target.checked)}
                    label={
                      <span className="flex items-center gap-1">
                        <span className="text-red500">{COPY.required}</span>
                        <span>{COPY.serviceTerms}</span>
                      </span>
                    }
                    labelClassName="text-[16px] leading-[160%] font-normal tracking-[-0.02em]"
                    checkboxSize="lg"
                    align="center"
                    disabled={isPending}
                  />
                  {renderMoreLink('service')}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex min-h-[29px] items-center justify-between gap-6">
                  <Checkbox
                    checked={privacyAgreed}
                    onChange={event => setPrivacyAgreed(event.target.checked)}
                    label={
                      <span className="flex items-center gap-1">
                        <span className="text-red500">{COPY.required}</span>
                        <span>{COPY.privacyPolicy}</span>
                      </span>
                    }
                    labelClassName="text-[16px] leading-[160%] font-normal tracking-[-0.02em]"
                    checkboxSize="lg"
                    align="center"
                    disabled={isPending}
                  />
                  {renderMoreLink('privacy')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="h-12 w-full"
          size="lg"
          type="button"
          label={COPY.submit}
          disabled={!allAgreed}
          loading={isPending}
          onClick={handleSubmit}
        />
      </section>
    </div>
  );
};

export default TermsPage;
