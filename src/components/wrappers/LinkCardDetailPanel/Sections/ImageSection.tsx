import Image from 'next/image';

import { styles } from '../LinkCardDetailPanel.style';

interface Props {
  imageUrl: string | undefined;
  title: string;
}

export default function ImageSection({ imageUrl, title }: Props) {
  const { imageWrapper } = styles();

  return (
    <section>
      <div className={imageWrapper()}>
        <Image
          src={imageUrl || '/images/default_linkcard_image.png'}
          alt={title || '웹페이지 썸네일 이미지'}
          width={520}
          height={220}
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
