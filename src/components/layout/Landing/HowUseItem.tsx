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
    <div className="flex flex-col items-center gap-8">
      <div className="relative h-36 w-36">
        <Image src={image} alt={title} fill />
      </div>
      <div className="flex flex-col items-center">
        <span className="mb-2.5 text-[32px] font-semibold">{title}</span>
        <span className="font-title-md text-center">{description}</span>
      </div>
    </div>
  );
}
