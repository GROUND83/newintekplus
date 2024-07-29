import { Button } from "@/components/ui/button";

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
          searchShow={true}
          placeHolder="그룹명을 검색하세요."
        />
      </div>
    </div>
  );
}
