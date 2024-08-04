import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
        <p>대쉬보드</p>
        {/* <Button size={"sm"}>생성버튼</Button> */}
      </div>
      <div className="p-6 gap-3  w-full grid grid-cols-12  bg-white ">
        <div className=" col-span-12">
          <p className="text-lg font-bold">안녕하세요?</p>
          <p>관리자 대쉬보드입니다.</p>
        </div>
        <div className="border p-6 col-span-4 flex flex-col items-center justify-center h-[200px]">
          <p>6/12</p>
          <p>진행중인 학습그룹</p>
        </div>
        {/* <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div>
        <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div>
        <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div>
        <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div>
        <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div>
        <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div>
        <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div>
        <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div>
        <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div> */}
      </div>
    </div>
  );
}
