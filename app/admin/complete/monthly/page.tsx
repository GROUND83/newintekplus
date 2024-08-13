"use client";
import TableWrap from "@/components/commonUi/tableWrap";
import { columns } from "./_components/table/colums";
import { getMoreData } from "./_components/table/actions";
import TableWrapMonthly from "./_components/table/tableWrapMonthly";

export default function Page() {
  return (
    <div className="w-full ">
      <div className="  flex-1 w-full  relative ">
        {/* <AddStudentExcel getMoreData={getMoreData} /> */}
        <TableWrapMonthly
          columns={columns}
          getMoreData={getMoreData}
          subMenu={true}
          placeHolder="이름 또는 이메일을 검색하세요."
          searchShow={true}
          height="h-[calc(100vh-220px)]"
        />
      </div>
    </div>
  );
}
