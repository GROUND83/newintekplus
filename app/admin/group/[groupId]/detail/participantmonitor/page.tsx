"use client";

import React from "react";
import { getFeedBackList } from "../../_components/actions";
import TableWrap from "@/components/commonUi/tableWrap";
import { columns } from "./_component/colums";
import { getMoreData } from "./_component/actions";
import TableWrapUnlimit from "@/components/commonUi/tableWrapUnlimit";

//
export default function Page({ params }: { params: { groupId: string } }) {
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <TableWrapUnlimit
        columns={columns}
        getMoreData={getMoreData}
        subMenu={false}
        searchShow={false}
        placeHolder=""
      />
    </div>
  );
}
