"use client";

import React from "react";
import Link from "next/link";

import { useParams, usePathname } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Submenu, SubMenuWrap } from "@/components/commonUi/mainTitleWrap";
import { detailGroup } from "@/components/commonActions/commonActions";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams<{ groupId: string }>();
  const pathname = usePathname();

  const {
    data: group,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["detail_group_id"],
    queryFn: async () => {
      let res = await detailGroup(params.groupId);
      if (res.data) {
        let group = JSON.parse(res.data);
        console.log("group", group);
        // setGroup(group);
        return group;
      } else {
        return null;
      }
    },
  });

  return (
    <div className="w-full flex flex-col ">
      <SubMenuWrap isLoading={isLoading}>
        <Submenu
          link={`/admin/group/${params.groupId}/detail/notice`}
          pathname={pathname}
          title="그룹 공지사항"
          size="sm"
        />

        {/* <Submenu
          link={`/admin/group/${params.groupId}/detail/message`}
          pathname={pathname}
          title="메세지"
          size="sm"
        /> */}

        <Submenu
          link={`/admin/group/${params.groupId}/detail/module`}
          pathname={pathname}
          title="학습리스트"
          size="sm"
        />

        <Submenu
          link={`/admin/group/${params.groupId}/detail/livesurvey`}
          pathname={pathname}
          title="설문응답"
          size="sm"
        />

        {group?.courseProfile?.eduForm !== "집합교육" ? (
          <div className="flex flex-row items-center gap-2">
            <Submenu
              link={`/admin/group/${params.groupId}/detail/readermonitor`}
              pathname={pathname}
              title="리더 모니터링"
              size="sm"
            />
            <Submenu
              link={`/admin/group/${params.groupId}/detail/participantmonitor`}
              pathname={pathname}
              title="교육생 과제 모니터링"
              size="sm"
            />
          </div>
        ) : null}
        <Submenu
          link={`/admin/group/${params.groupId}/detail/participantProgress`}
          pathname={pathname}
          title="교육생 진도율"
          size="sm"
        />
      </SubMenuWrap>

      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
