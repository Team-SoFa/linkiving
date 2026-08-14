import Image from 'next/image';

export default function HowUseItem({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-7">
      <div className="relative h-36 w-36">
        <Image src={image} alt={title} fill />
      </div>
      <div className="flex flex-col items-center">
        <span className="mb-4 text-[clamp(20px,6.25vw,28px)] font-semibold">{title}</span>
        <span className="font-body-lg text-center text-[16px] md:text-[18px]">{description}</span>
      </div>
    </div>
  );
}
