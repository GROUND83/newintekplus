"use client";

import TableWrap from "@/components/commonUi/tableWrap";

import { columns } from "./_components/table/colums";
import { getMoreData } from "./_components/table/actions";

export default function Page({ params }: { params: { groupId: string } }) {
  console.log("groupId", params.groupId);
  return (
    <div className="w-full ">
      <div className="  flex-1 w-full  relative ">
        <TableWrap
          columns={columns}
          getMoreData={getMoreData}
          subMenu={true}
          searchShow={true}
          placeHolder="제목을 검색해세요."
        />
      </div>
    </div>
  );
}
