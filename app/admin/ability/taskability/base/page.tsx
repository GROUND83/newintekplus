//
"use client";
import React, { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { gettaskabilityTitle } from "../../_component/actions";
import CompetencyModal from "../_component/competencyModal";

function PageWrap() {
  const [jobCompetencyData, setJobCompetencydata] = React.useState<any>();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  console.log("type", type);

  const getData = async () => {
    let res = await gettaskabilityTitle(type);
    if (res.data) {
      console.log(JSON.parse(res.data));
      setJobCompetencydata(JSON.parse(res.data));
    }
  };
  React.useEffect(() => {
    // getData();
    console.log("type", type);
    getData();
  }, [type]);
  return (
    <div className="w-full  h-[calc(100vh-120px)] px-3">
      {jobCompetencyData && (
        <div className="w-full flex flex-col  mt-1">
          <div className=" w-full grid grid-cols-12 gap-1">
            <div className="col-span-2 bg-white p-2 border">
              <p>그룹</p>
            </div>
            <div className="col-span-3  bg-white p-2 border">
              <p>직무명</p>
            </div>
            <div className="col-span-7  bg-white p-2 border">
              <p>행동 역량</p>
            </div>
          </div>
          {jobCompetencyData.group.map((group, index) => {
            return (
              <div key={index} className="grid w-full grid-cols-12 gap-1 mt-1">
                <div className="flex flex-row items-start justify-between col-span-2 p-2 transition-colors bg-white border ">
                  <p className="text-black">{group.groupName}</p>
                </div>
                <div className="col-span-10   gap-1 w-full grid grid-cols-10 ">
                  {group.jobprofile.length > 0 &&
                    group.jobprofile.map((prof, index) => {
                      return (
                        <div
                          key={index}
                          className=" col-span-10 grid grid-cols-10 gap-1 "
                        >
                          <div className="flex flex-row items-start justify-between col-span-3 p-2 transition-colors bg-white border ">
                            <p>{prof.jobProfileName}</p>
                          </div>
                          <div className="flex flex-row items-center justify-start col-span-7   bg-white border  gap-2 px-2">
                            {prof.competencys.map((competency, index) => {
                              return (
                                <CompetencyModal
                                  key={index}
                                  data={competency}
                                />
                              );
                            })}
                            <Button size="xs" variant="default">
                              역량 추가
                            </Button>
                          </div>
                        </div>
                        // <DutyNameJob
                        //   competencyData={prof}
                        //   group={group}
                        //   key={index}
                        //   getJobCompetnecy={getJobCompetnecy}
                        // />
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Page = () => {
  return (
    <Suspense>
      <PageWrap />
    </Suspense>
  );
};

export default Page;
