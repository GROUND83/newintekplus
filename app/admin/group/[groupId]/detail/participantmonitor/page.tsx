"use client";

import React from "react";
import { getFeedBackList } from "../../_components/actions";
import TableWrap from "@/components/commonUi/tableWrap";
import { columns } from "./_component/colums";
import { getMoreData } from "./_component/actions";

//
export default function Page({ params }: { params: { groupId: string } }) {
  console.log("groupId", params.groupId);
  const [feedBackList, setFeedBackList] = React.useState([]);
  const getFeedBack = async () => {
    //
    let res = await getFeedBackList(params.groupId);
    if (res.data) {
      //
      let data = JSON.parse(res.data);
      console.log("data", data);
      setFeedBackList(data);
    } else {
      //
    }
  };
  React.useEffect(() => {
    getFeedBack();
  }, []);
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="">
        {/*  */}
        <TableWrap
          columns={columns}
          getMoreData={getMoreData}
          subMenu={false}
        />
      </div>
    </div>
  );
}
