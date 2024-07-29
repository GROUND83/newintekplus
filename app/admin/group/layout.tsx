"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { detailGroup } from "./[groupId]/_components/actions";
import GroupData from "@/components/commonUi/groupData";
import { MainTitleWrap, SubWrap } from "@/components/commonUi/mainTitleWrap";
import { getTestData } from "./_components/table/actions";

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
  const getTest = async () => {
    let res = await getTestData();
    let data = JSON.parse(res.data);
    console.log("res", data);
  };

  //

  React.useEffect(() => {
    getGroup();
  }, [params]);
  return (
    <SubWrap>
      <MainTitleWrap>
        <div className="flex flex-row items-center gap-2">
          <p>학습그룹</p>
          {group && <GroupData group={group} />}
        </div>
        <Button onClick={() => getTest()}>text</Button>
        {pathname === "/admin/group" && (
          <Button asChild size={"sm"}>
            <Link
              href={"/admin/group/new"}
              className="flex flex-row items-center gap-2"
            >
              <PlusIcon className="size-4" />
              학습그룹 생성
            </Link>
          </Button>
        )}
      </MainTitleWrap>

      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </SubWrap>
  );
}
