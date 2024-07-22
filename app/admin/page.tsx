import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
        <p>대쉬보드</p>
        {/* <Button size={"sm"}>생성버튼</Button> */}
      </div>
      <div className="p-3 flex-1 grid grid-cols-12 gap-3  w-full">
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
        </div>
        <div className="bg-white border flex-1 w-full p-6 col-span-4">
          <p>대쉬보드</p>
        </div>
      </div>
    </div>
  );
}
