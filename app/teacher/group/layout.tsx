"use client";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { detailGroup } from "./_components/table/actions";
import GroupData from "@/components/commonUi/groupData";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const [group, setGroup] = React.useState<any>();
  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();
  const getGroup = async () => {
    if (params.groupId) {
      let res = await detailGroup(params.groupId);
      if (res.data) {
        let group = JSON.parse(res.data);
        console.log("group", group);
        setGroup(group);
      }
    } else {
      setGroup(null);
    }
  };
  React.useEffect(() => {
    getGroup();
  }, [params]);
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
        <p>학습그룹</p>
        {group && <GroupData group={group} />}
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
