import NextImage from 'next/image';
import type { ReactElement } from 'react';

type ImageProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

/**
 * 테스트용 Image 컴포넌트
 * - src는 필수
 * - alt 기본값은 빈 문자열
 */
export default function CustomImage({
  src,
  alt = '',
  width = 20,
  height = 20,
  ...rest
}: ImageProps): ReactElement {
  return <NextImage src={src} alt={alt} width={width} height={height} {...rest} />;
}
