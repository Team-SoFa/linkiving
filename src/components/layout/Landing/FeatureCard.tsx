import Image from 'next/image';

interface FeatureCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: React.ReactNode;
  bgClassName: string;
}

export default function FeatureCard({
  image,
  imageAlt,
  title,
  description,
  bgClassName,
}: FeatureCardProps) {
  return (
    <div
      className={`${bgClassName} flex h-[60vh] flex-col items-center gap-10 rounded-[20px] px-[55px] py-18 shadow-xl md:flex-row`}
    >
      <div className="relative aspect-700/337 w-full max-w-[700px]">
        <Image src={image} alt={imageAlt} fill />
      </div>
      <div className="flex flex-col gap-7">
        <span className="text-[32px] font-semibold">{title}</span>
        <span className="font-title-md">{description}</span>
      </div>
    </div>
  );
}
