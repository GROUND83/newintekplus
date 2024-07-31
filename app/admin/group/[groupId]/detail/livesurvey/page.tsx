"use client";

import React from "react";
import { getGroupDetail } from "./_component/actions";
import { Button } from "@/components/ui/button";
import { CircleCheckIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ViewResultSurvey from "./_component/viewResultSurvey";
import SendVertification from "./_component/sendVertification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import ViewTotalResultSurvey from "./_component/viewTotalResultSurvey";

export default function Page({ params }: { params: { groupId: string } }) {
  // console.log("groupId", params.groupId);
  // const [livesurvey, setLiveSurvey] = React.useState<any>();
  // //
  // const [group, setGroup] = React.useState<any>();

  // const getData = async () => {
  //   let res = await getGroupDetail(params.groupId);
  //   if (res.data) {
  //     let data = JSON.parse(res.data);
  //     console.log("data", data);
  //     if (data.liveSurvey) {
  //       setLiveSurvey(data.liveSurvey);
  //     }
  //     let resultSurvey = JSON.parse(res.resultSurvey);
  //     console.log("resultSurvey", resultSurvey);
  //     for (let participant of data?.participants) {
  //       for (let resultSur of data.resultSurvey) {
  //         console.log("rest");
  //         if (
  //           JSON.stringify(resultSur.onwer) === JSON.stringify(participant._id)
  //         ) {
  //           console.log("findData", resultSur);
  //           participant.resultSur = resultSur;
  //         }
  //       }
  //     }
  //     // setResultData(resultSurvey);
  //     console.log("data", data);
  //     setGroup(data);
  //   }
  // };

  // React.useEffect(() => {
  //   getData();
  // }, []);

  const fetchDataOptions = {
    groupId: params.groupId,
  };
  const {
    data: data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    //
    queryKey: ["evauation", fetchDataOptions],
    queryFn: async () => {
      let res = await getGroupDetail(params.groupId);
      if (res.data) {
        let data = JSON.parse(res.data);
        console.log("data", data);
        // if (data.liveSurvey) {
        //   setLiveSurvey(data.liveSurvey);
        // }
        let resultSurvey = JSON.parse(res.resultSurvey);
        console.log("resultSurvey", resultSurvey);
        for (let participant of data?.participants) {
          for (let resultSur of data.resultSurvey) {
            console.log("rest");
            if (
              JSON.stringify(resultSur.onwer) ===
              JSON.stringify(participant._id)
            ) {
              console.log("findData", resultSur);
              participant.resultSur = resultSur;
            }
          }
        }
        // setResultData(resultSurvey);
        console.log("data", data);
        // setGroup(data);
        return {
          group: data,
          livesurvey: data.liveSurvey,
        };
      }
    },
  });
  if (isLoading) {
    return (
      <div
        className={`w-full  h-[calc(100vh-170px)]  flex flex-col items-center justify-center`}
      >
        <Loader2 className=" animate-spin size-8 text-primary" />
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col   ">
      <div className=" flex flex-col  w-full">
        <div className="flex flex-row items-center justify-between">
          {data?.livesurvey && (
            <div className="bg-white border w-full p-6 flex flex-col items-start gap-2 h-[calc(100vh-170px)] flex-1">
              <p className=" font-bold">{data.livesurvey?.title}</p>
              <div className="mt-3">
                <p>설문내용</p>
                <div className="mt-3">
                  {data.livesurvey?.surveys.map((item: any, index: any) => {
                    return (
                      <div key={item._id}>
                        <p>
                          {index + 1}. {item.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {data.group && (
            <div className="bg-white border  w-full p-6 flex flex-col items-start gap-2 h-[calc(100vh-170px)] flex-1">
              <div className="h-[30px]">
                <p className=" font-bold">설문 결과</p>
              </div>
              <ScrollArea className="w-full h-[calc(100vh-200px)] flex flex-col">
                <div className="w-full flex flex-col gap-1 mt-2">
                  {data.group?.participants.map((item: any, index: any) => {
                    return (
                      <div
                        key={item._id}
                        className="w-full flex flex-row items-center gap-2 border px-2 py-1  justify-between"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <p>
                            {index + 1}. {item.username}
                          </p>

                          {item.resultSur ? (
                            <Badge
                              className=" text-xs font-normal"
                              variant="defaultOutline"
                            >
                              완료
                            </Badge>
                          ) : (
                            <Badge
                              className=" text-xs font-normal"
                              variant="secondaryOutline"
                            >
                              미완료
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          {item.resultSur && (
                            <ViewResultSurvey resultSurvey={item.resultSur} />
                          )}

                          {item.resultSur?.isSend ? (
                            <div className="flex flex-row items-center gap-2">
                              <SendVertification
                                group={data.group}
                                participants={item}
                                resultSurveyId={item.resultSur?._id || ""}
                                isSend={item.resultSur?.isSend}
                              />
                            </div>
                          ) : (
                            <SendVertification
                              group={data.group}
                              participants={item}
                              resultSurveyId={item.resultSur?._id || ""}
                              isSend={item.resultSur?.isSend}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
        {data.group && (
          <div className="h-[50px] flex flex-row items-center px-6 border-b bg-white  justify-end">
            <ViewTotalResultSurvey groupId={params.groupId} />
          </div>
        )}
      </div>
    </div>
  );
}
