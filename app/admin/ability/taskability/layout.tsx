"use client";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import Group from "@/models/group";
import { usePathname, useSearchParams } from "next/navigation";
import { gettaskability } from "../_component/actions";
function LayoutWrap({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const pathname = usePathname();
  //
  const searchParams = useSearchParams();
  // console.log("searchParams", searchParams);
  const type = searchParams.get("type");
  const [taskAbility, setTaskability] = React.useState([]);
  const getData = async () => {
    let res = await gettaskability();
    if (res.data) {
      console.log(JSON.parse(res.data));
      setTaskability(JSON.parse(res.data));
    }
  };
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between  h-[70px]">
        <p>직무 역량</p>
        <Button size={"sm"} disabled={true}>
          역량 불러오기
        </Button>
      </div>
      <div className="flex flex-col  bg-neutral-100">
        <div className="gap-3 w-full bg-white flex flex-row items-center border-b  h-[50px] px-6 justify-between">
          <div className="flex flex-row items-center gap-2">
            {taskAbility.length > 0 &&
              taskAbility.map((item, index) => {
                return (
                  <Link
                    href={`/admin/ability/taskability/base?type=${item.title}`}
                    className={`text-md px-2 py-2 text-sm rounded-md border ${
                      type === item.title
                        ? "bg-primary text-white"
                        : "bg-neutral-100 text-black"
                    } `}
                    key={index}
                  >
                    {item.title}
                  </Link>
                );
              })}
          </div>
          <div className=" flex flex-row items-center gap-2 px-3 bg-white ">
            <Link
              href={`/admin/ability/taskability/base?type=${type}`}
              className={`text-md px-2 py-2 text-sm rounded-md border ${
                pathname.includes("/admin/ability/taskability/base")
                  ? "border-primary text-primary border"
                  : "bg-neutral-100 text-black"
              } `}
            >
              행동 역량
            </Link>
            <Link
              href={`/admin/ability/taskability/special?type=${type}`}
              className={`text-md px-2 py-2 text-sm rounded-md border ${
                pathname.includes("/admin/ability/taskability/special")
                  ? "border-primary text-primary border"
                  : "bg-neutral-100 text-black"
              } `}
            >
              전문 역량
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Suspense>
      <LayoutWrap>{children}</LayoutWrap>
    </Suspense>
  );
};

export default Layout;
