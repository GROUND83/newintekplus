import TableWrap from "@/components/commonUi/tableWrap";
import { columns } from "./_components/colums";
import { getMoreData } from "./_components/actions";

export default function Page() {
  return (
    <div className="w-full">
      <div className="w-full ">
        <TableWrap
          columns={columns}
          getMoreData={getMoreData}
          subMenu={false}
          placeHolder="제목을 입력하세요."
          searchShow={true}
          height="h-[calc(100vh-170px)]"
        />
      </div>
    </div>
  );
}
