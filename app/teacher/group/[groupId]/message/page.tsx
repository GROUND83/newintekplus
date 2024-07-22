"use client";
export default function Page({ params }: { params: { groupId: string } }) {
  console.log("groupId", params.groupId);
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="p-3 flex-1 flex flex-col  w-full">
        <div className="bg-white border flex-1 w-full p-6 flex flex-col items-start gap-2">
          <p>작업중...</p>
        </div>
      </div>
    </div>
  );
}
