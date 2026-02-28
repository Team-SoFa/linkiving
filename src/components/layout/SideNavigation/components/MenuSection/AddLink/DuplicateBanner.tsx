import SVGIcon from '@/components/Icons/SVGIcon';
import Divider from '@/components/basics/Divider/Divider';

export default function DuplicateBanner() {
  return (
    <>
      <div className="m-6">
        <p className="font-title-md">중복 저장한 링크</p>
        <p className="font-body-md py-2">
          이 링크는 이미 저장되어 있습니다.
          <br />
          지금 입력한 내용으로 새로 덮어쓸까요, 아니면 기존 링크의 정보를 유지할까요?
        </p>
        <div className="font-body-md flex items-center gap-px">
          <SVGIcon icon="IC_Warning" className="text-yellow500" />
          <p>새로 덮어쓸 경우, 기존 링크의 제목, 이미지, 요약, 메모가 사라집니다.</p>
        </div>
      </div>
      <Divider />
    </>
  );
}
