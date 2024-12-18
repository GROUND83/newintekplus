"use client";
import TableWrap from "@/components/commonUi/tableWrap";

import { columns } from "./_components/table/colums";
import { getMoreData } from "./_components/table/actions";

export default function Page() {
  return (
    <div className="w-full ">
      <div className="  flex-1 w-full  relative ">
        <TableWrap
          columns={columns}
          getMoreData={getMoreData}
          subMenu={false}
          placeHolder="교육 형태, 레슨명을 검섹하세요."
          searchShow={true}
          height="h-[calc(100vh-170px)]"
        />
      </div>
    </div>
  );
}
