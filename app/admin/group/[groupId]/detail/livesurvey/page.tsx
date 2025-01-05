"use client";

import React from "react";
import { getGroupDetail, settingResult } from "./_component/actions";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import ViewResultSurvey from "./_component/viewResultSurvey";
import SendVertification from "./_component/sendVertification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import ViewTotalResultSurvey from "./_component/viewTotalResultSurvey";
import { Button } from "@/components/ui/button";
import ViewResultSurvey from "@/components/commonUi/viewResultSurvey";
import NewSendVertification from "./_component/newSendVertification";

export default function Page({ params }: { params: { groupId: string } }) {
  const [group, setGroup] = React.useState() as any;
  const [livesurvey, setLivesurvey] = React.useState([]);
  const [resultSurvey, setResultSurvey] = React.useState([]);

  const fetchDataOptions = {
    groupId: params.groupId,
  };

  const getData = async () => {
    let res = await getGroupDetail(params.groupId);
    if (res.data) {
      let data = JSON.parse(res.data);

      // let resultSurvey = JSON.parse(res.resultSurvey);

      for (let participant of data?.participants) {
        for (let resultSur of data.resultSurvey) {
          if (
            JSON.stringify(resultSur.onwer) === JSON.stringify(participant._id)
          ) {
            participant.resultSur = resultSur;
          }
        }
      }
      // setResultData(resultSurvey);
      console.log("data", data);
      // setGroup(data);
      setGroup(data);
      setLivesurvey(data.liveSurvey);
      setResultSurvey(data.resultSurvey);
    }
  };
  React.useEffect(() => {
    getData();
  }, [params]);
  // const {
  //   data: data,
  //   isLoading,
  //   isError,
  //   refetch,
  // } = useQuery({
  //   //
  //   queryKey: ["evauation", fetchDataOptions],
  //   queryFn: async () => {
  //     let res = await getGroupDetail(params.groupId);
  //     if (res.data) {
  //       let data = JSON.parse(res.data);

  //       // let resultSurvey = JSON.parse(res.resultSurvey);

  //       for (let participant of data?.participants) {
  //         for (let resultSur of data.resultSurvey) {
  //           if (
  //             JSON.stringify(resultSur.onwer) ===
  //             JSON.stringify(participant._id)
  //           ) {
  //             participant.resultSur = resultSur;
  //           }
  //         }
  //       }
  //       // setResultData(resultSurvey);
  //       console.log("data", data);
  //       // setGroup(data);
  //       return {
  //         group: data,
  //         livesurvey: data.liveSurvey,
  //         resultSurvey: data.resultSurvey,
  //       };
  //     }
  //   },
  // });
  // if (isLoading) {
  //   return (
  //     <div
  //       className={`w-full  h-[calc(100vh-170px)]  flex flex-col items-center justify-center`}
  //     >
  //       <Loader2 className=" animate-spin size-8 text-primary" />
  //     </div>
  //   );
  // }

  const clickSetting = async () => {
    //
    let res = await settingResult(params.groupId);
    console.log(res);
  };
  return (
    <div className="w-full flex flex-col   ">
      {group && (
        <div className=" flex flex-col  w-full">
          <div className="flex flex-row items-center justify-between">
            {group?.liveSurvey && (
              <div className="bg-white border w-full p-6 flex flex-col items-start gap-2 h-[calc(100vh-170px)] flex-1">
                <p className=" font-bold">{group.liveSurvey?.title}</p>
                <div className="mt-3 w-full">
                  <p>설문내용</p>
                  <div className="mt-3 flex flex-col items-start w-full gap-1">
                    {group.liveSurvey?.surveys.map((item: any, index: any) => {
                      return (
                        <div
                          key={item._id}
                          className="flex flex-row items-center gap-2 border-b w-full py-2"
                        >
                          <Badge variant="defaultOutline">{item.type}</Badge>
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
            {group && (
              <div className="bg-white border  w-full p-6 flex flex-col items-start gap-2 h-[calc(100vh-170px)] flex-1">
                {/* <div className="h-[30px] flex flex-row items-center gap-2">
                <p className=" font-bold">설문 결과</p>
              </div> */}
                <NewSendVertification group={group} getData={getData} />
                {/* <ScrollArea className="w-full h-[calc(100vh-200px)] flex flex-col">
                <div className="w-full flex flex-col gap-1 mt-2">
                  {data?.group.resultSurvey.map((item: any, index: any) => {
                    console.log("iten", item);
                    return (
                      <div
                        key={item._id}
                        className="w-full flex flex-row items-center gap-2 border px-2 py-1  justify-between"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <p>
                            {index + 1}. {item.onwer?.username}
                          </p>

                          {item.isDone ? (
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
                          {item.isSend ? (
                            <Badge
                              className=" text-xs font-normal"
                              variant="defaultOutline"
                            >
                              발급완료
                            </Badge>
                          ) : (
                            <Badge
                              className=" text-xs font-normal"
                              variant="secondaryOutline"
                            >
                              발급대기
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          {item.isDone ? (
                            <ViewResultSurvey resultSurvey={item} />
                          ) : (
                            <Button
                              size="xs"
                              disabled
                              variant="outline"
                              className="flex flex-row items-center gap-2"
                            >
                              <Loader2 className="size-3" />
                              <p>설문 대기</p>
                            </Button>
                          )}

                          <div className="flex flex-row items-center gap-2">
                            <SendVertification
                              group={data.group}
                              participants={item.onwer}
                              resultSurveyId={item._id || ""}
                              isSend={item.isSend}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea> */}
              </div>
            )}
          </div>
          {group && (
            <div className="h-[50px] flex flex-row items-center px-6 border-b bg-white  justify-end">
              <ViewTotalResultSurvey groupId={params.groupId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
