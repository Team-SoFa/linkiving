import Image from 'next/image';

export default function ExperienceItem({
  image,
  title,
  content,
}: {
  image: string;
  title: string;
  content: string;
}) {
  return (
    <div className="border-gray50 flex flex-1 flex-col gap-6 rounded-[20px] bg-[linear-gradient(180deg,#F5F6FA_0%,#EAEDFF_100%)] px-10 py-15">
      <div className="relative h-12 w-12">
        <Image src={image} alt={title} fill />
      </div>
      <span className="text-[32px] font-semibold">{title}</span>
      <span className="font-title-md">{content}</span>
    </div>
  );
}
