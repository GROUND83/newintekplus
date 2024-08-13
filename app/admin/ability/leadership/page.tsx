//
"use client";
import React from "react";
import { getCommonAbility, getleadership } from "../_component/actions";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [abilityData, setAbilityData] = React.useState([]);
  const getData = async () => {
    let res = await getleadership();
    if (res.data) {
      console.log(JSON.parse(res.data));
      setAbilityData(JSON.parse(res.data));
    }
  };
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-full p-3">
      <div className="grid grid-cols-12 w-full gap-3 ">
        {abilityData.length > 0 ? (
          abilityData.map((item, index) => {
            return (
              <div
                key={index}
                className=" col-span-4 flex flex-col items-start w-full p-6 bg-white border rounded-md"
              >
                <div className="flex flex-row items-center justify-between w-full">
                  <p className="px-3 py-1 text-blue-700 border-blue-700 rounded-md border bg-blue-700/20">
                    {item.title}
                  </p>
                  <div>
                    <Button variant="outline" size="sm">
                      제거
                    </Button>
                  </div>
                </div>
                <p className="mt-6 text-black">{item.description}</p>
                <div className="grid w-full grid-cols-12 gap-3 mt-6">
                  <div className="col-span-12">
                    <p className="mb-2 font-bold text-black">하위 요소</p>
                    <div className="flex flex-row items-center flex-wrap gap-1">
                      {item.subElements?.map((element: any, index: any) => {
                        return (
                          <p
                            key={index}
                            className="px-2 py-1  text-black rounded-md bg-neutral-200"
                          >
                            {element}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-span-12 ">
                    <p className="mb-2 font-bold text-black">행동 지표</p>
                    <ul className="flex flex-col w-full gap-1 pl-3">
                      {item.behaviorIndicator?.map(
                        (behavior: any, index: any) => {
                          return (
                            <li key={index} className=" text-black list-disc">
                              {behavior}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center col-span-1 row-span-3 ">
            <p className="text-black">역량 데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
