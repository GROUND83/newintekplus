"use client";

import DataTable from "./_components/table/table";

export default function Page({ params }: { params: { groupId: string } }) {
  console.log("groupId", params.groupId);
  return (
    <div className="w-full ">
      <div className="  flex-1 w-full  relative ">
        <DataTable />
      </div>
    </div>
  );
}
