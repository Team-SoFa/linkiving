import Anchor from '@/components/basics/Anchor/Anchor';
import Divider from '@/components/basics/Divider/Divider';
import IconButton from '@/components/basics/IconButton/IconButton';

import CopyButton from '../../CopyButton';
import { styles } from '../LinkCardDetailPanel.style';

interface Props {
  safeUrl: string;
  onClose?: () => void;
}

export default function HeaderSection({ safeUrl, onClose }: Props) {
  const { header } = styles();

  return (
    <div>
      <header className={header()}>
        <div className="bg-gray50 flex flex-1 items-center gap-3">
          <div className="max-w-100 flex-1">
            {safeUrl ? (
              <Anchor href={safeUrl} target="_blank" className="text-gray400 truncate">
                {safeUrl}
              </Anchor>
            ) : (
              <span className="text-gray500 font-body-sm">유효하지 않은 URL입니다.</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <CopyButton
              value={safeUrl}
              successMsg="URL을 복사했습니다."
              failMsg="URL 복사에 실패했습니다. 다시 시도해주세요."
              tooltipMsg="URL 복사하기"
              contextStyle="onPanel"
            />
            {onClose && (
              <IconButton
                icon="IC_Close"
                size="sm"
                variant="tertiary_subtle"
                contextStyle="onPanel"
                ariaLabel="상세패널 닫기"
                onClick={onClose}
              />
            )}
          </div>
        </div>
      </header>
      <Divider />
    </div>
  );
}
