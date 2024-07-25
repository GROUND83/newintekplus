"use client";

import React from "react";
import Link from "next/link";

import { useParams, usePathname } from "next/navigation";
import { detailGroup } from "../_components/actions";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const [group, setGroup] = React.useState<any>();

  const params = useParams<{ groupId: string }>();
  const pathname = usePathname();
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
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center gap-2 h-[50px]">
        <Link
          href={`/admin/group/${params.groupId}/detail/notice`}
          className={`px-3 py-2 text-xs ${
            pathname.includes("/detail/notice")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          그룹 공지사항
        </Link>
        <Link
          href={`/admin/group/${params.groupId}/detail/message`}
          className={`px-3 py-2 text-xs ${
            pathname.includes("/detail/message")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          메세지
        </Link>
        <Link
          href={`/admin/group/${params.groupId}/detail/livesurvey`}
          className={`px-3 py-2 text-xs ${
            pathname.includes("/detail/livesurvey")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          설문응답
        </Link>
        {group?.courseProfile?.eduForm !== "집합교육" && (
          <div>
            <Link
              href={`/admin/group/${params.groupId}/detail/readermonitor`}
              className={`px-3 py-2 text-xs ${
                pathname.includes("/detail/readermonitor")
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-black border"
              } rounded-md`}
            >
              리더 모니터링
            </Link>
            <Link
              href={`/admin/group/${params.groupId}/detail/participantmonitor`}
              className={`px-3 py-2 text-xs ${
                pathname.includes("/detail/participantmonitor")
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-black border"
              } rounded-md`}
            >
              교육생 과제 모니터링
            </Link>
          </div>
        )}
        <Link
          href={`/admin/group/${params.groupId}/detail/participantProgress`}
          className={`px-3 py-2 text-xs ${
            pathname.includes("/detail/participantProgress")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          교육생 진도율
        </Link>
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
