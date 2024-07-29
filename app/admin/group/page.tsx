"use client";

import TableWrap from "@/components/commonUi/tableWrap";
import { columns } from "./_components/table/colums";
import { getMoreData, getTestData } from "./_components/table/actions";
import React from "react";

export default function Page() {
  return (
    <div className="w-full ">
      <div className="w-full  relative">
        <TableWrap
          columns={columns}
          getMoreData={getMoreData}
          subMenu={false}
          placeHolder="상태, 그룹 명을 검색하세요."
          searchShow={true}
        />
      </div>
    </div>
  );
}
