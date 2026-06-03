import Image from 'next/image';

interface FeatureCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: React.ReactNode;
  bgClassName: string;
  index: number;
}

export default function FeatureCard({
  image,
  imageAlt,
  title,
  description,
  bgClassName,
  index,
}: FeatureCardProps) {
  return (
    <div
      style={{ top: '140px' }}
      className={`${bgClassName} sticky flex h-120 flex-col items-center gap-10 rounded-[20px] px-[55px] py-18 shadow-xl md:flex-row`}
    >
      <div className="relative aspect-700/337 w-full max-w-[700px] overflow-hidden rounded-lg">
        <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 700px, 100vw" />
      </div>
      <div className="flex flex-col gap-7">
        <span className="text-[28px] font-semibold">{title}</span>
        <span className="font-body-lg">{description}</span>
      </div>
    </div>
  );
}
