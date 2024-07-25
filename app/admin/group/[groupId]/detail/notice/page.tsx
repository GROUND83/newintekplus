"use client";

import TableWrap from "@/components/commonUi/tableWrap";
import DataTable from "./_components/table/table";
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
          subMenu={false}
        />
      </div>
    </div>
  );
}
