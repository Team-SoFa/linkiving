/* eslint-disable @next/next/no-img-element */
import React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string;
    alt: string;
};

/**
 * 테스트용 Image 컴포넌트
 * - src는 필수
 * - alt 기본값은 빈 문자열
 */
export default function Image({ src, alt = "", ...rest }: ImageProps) {
    return <img src={src} alt={alt} {...rest} />;
}