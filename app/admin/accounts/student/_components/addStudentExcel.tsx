"use client";
import ActionModal from "@/components/commonUi/ActionModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
//
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createParticipants, getParticipants } from "./table/actions";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
export default function AddStudentExcel() {
  const pdfinput = React.useRef<any>();
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | undefined>();
  const [studentData, setStudentData] = React.useState([]);
  const [exelData, setExelData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const getData = async () => {
    let res = await getParticipants();
    if (res.data) {
      let data = JSON.parse(res.data);
      setStudentData(data);
    }
  };
  //
  React.useEffect(() => {
    if (open) {
      getData();
      setFile(undefined);
      setExelData([]);
    }
  }, [open]);

  const checkExsit = (email: string) => {
    //
    console.log("studentData", email);
    return new Promise((resolve, reject) => {
      let check = studentData.findIndex((item) => item.email === email);
      if (check > -1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };
  const handleFileUpload = (event: any) => {
    if (studentData.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      setFile(file);
      console.log(file);

      //
      reader.onload = async (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data);

        // 첫 번째 시트를 가져옴
        const worksheet = workbook.SheetNames[0];
        const firstSheet = workbook.Sheets[worksheet];

        // 셀 데이터를 파싱하여 출력
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          header: 0,
          raw: false,
          dateNF: "yyyy-mm-dd HH:mm:ss",
        });
        console.log(jsonData);
        let newArray = [];
        for (const json of jsonData) {
          let num = json["No."];
          let username = json["성명"];
          let department = json["본부"];
          // let sector = json["부문명"];
          let jobSubGroup = json["파트명"]; //jobSubGroup
          // let part = json["파트명"]; //jobSubGroup
          let jobPosition = json["직위"]; //jobPosition !!
          // let train = json["직책"]; //train
          let jobGroup = json["부서명"]; //jobGroup   jobGroup == 개발직군
          let email = json["이메일"];

          let phone = json["전화번호"];
          // console.log("email", email);
          //
          let newobj = {
            num,
            username,
            department: department || "",
            //   part: part || "",
            jobSubGroup: jobSubGroup || "",
            jobPosition: jobPosition || "",
            //   train: train || "",
            jobGroup: jobGroup || "",
            email: email ? `${email.replace(/(\s*)/g, "").toLowerCase()}` : "",
            isExits: await checkExsit(email),
            phone,
          };
          newArray.push(newobj);
        }
        console.log(newArray);
        setExelData(newArray);
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert("교육생 가져오기를 실폐하였습니다.");
    }
  };
  const clickUpdate = async () => {
    //
    setLoading(true);
    try {
      let newArray = [];
      console.log("ExcelDta", exelData);
      for (const exelDatavalue of exelData) {
        if (!exelDatavalue.isExits) {
          //
          newArray.push(exelDatavalue);
        }
      }
      if (newArray.length > 0) {
        //
        let formData = new FormData();
        formData.append("paticipants", JSON.stringify(newArray));
        let res = await createParticipants(formData);
        if (res.data) {
          toast.success("교육생 추가 성공 하였습니다.");
          //   getMoreData();

          // getData();
          setStudentData([]);
          setFile(undefined);
          setExelData([]);
          window.location.reload();
        }
      } else {
        alert("업데이트 할 데이터가 없습니다.");
      }
    } catch (e) {
      toast.error(e);
    }
  };
  const onClickUpload = async () => {
    //
    if (pdfinput?.current) {
      pdfinput?.current.click();
    }
  };
  return (
    <div>
      <Dialog open={open}>
        <DialogTrigger asChild>
          <Button variant="defaultoutline" onClick={() => setOpen(true)}>
            + 교육생 업데이트
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80vw] flex flex-col items-start justify-start">
          <DialogHeader className="w-full flex flex-row items-center justify-between">
            <div>
              <DialogTitle>교육생 업데이트</DialogTitle>
              <DialogDescription>교육생을 업데이트 합니다.</DialogDescription>
            </div>
            <div>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant="outline"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          </DialogHeader>
          <div
            className="flex
           w-full h-full flex-col items-start justify-start"
          >
            <div className="flex flex-row items-center w-full p-3 bg-white border rounded-md">
              <div className="flex-1">{file && <p>{file.name}</p>}</div>
              <div>
                <Button variant="outline" onClick={() => onClickUpload()}>
                  + EXCEL 파일 선택
                </Button>
              </div>
              <input
                ref={pdfinput}
                id="file-input"
                type="file"
                accept="*.*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </div>
            <div className="w-full   mt-3">
              <div className=" w-full  mt-1 flex flex-row items-center gap-1 border-b py-3 bg-neutral-200">
                <div className="w-[50px]">
                  <p>순번</p>
                </div>
                <div className="w-[60px]">
                  <p>성명</p>
                </div>
                <div className="w-[120px]">
                  <p>본부</p>
                </div>
                <div className="w-[120px]">
                  <p>그룹</p>
                </div>
                <div className="w-[150px]">
                  <p>직군</p>
                </div>
                <div className="w-[50px]">
                  <p>직위</p>
                </div>
                <div className="w-[200px]">
                  <p>이메일</p>
                </div>
                <div className="w-[120px]">
                  <p>전화번호</p>
                </div>
                <div className="w-[80px]">
                  <p>계정 유무</p>
                </div>
              </div>
              <ScrollArea className="flex flex-col h-[600px]">
                <div className="flex flex-col items-start w-full gap-1 mt-1 ">
                  {exelData.length > 0 &&
                    exelData.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-row items-center gap-1 w-full py-2 border-b"
                        >
                          <div className="w-[50px]">
                            <p>{item.num}</p>
                          </div>
                          <div className="w-[60px]">
                            <p>{item.username}</p>
                          </div>
                          <div className="w-[120px]">
                            <p>{item.department}</p>
                          </div>
                          <div className="w-[120px]">
                            <p>{item.jobSubGroup}</p>
                          </div>
                          <div className="w-[150px]">
                            <p>{item.jobGroup}</p>
                          </div>
                          <div className="w-[50px]">
                            <p>{item.jobPosition}</p>
                          </div>
                          <div className="w-[200px]">
                            <p>{item.email}</p>
                          </div>
                          <div className="w-[120px]">
                            <p>{item.phone}</p>
                          </div>

                          <div className="w-[80px]">
                            {item.isExits ? (
                              <Badge>
                                <p>계정 있음</p>
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                <p>계정 없음</p>
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </div>
            {exelData.length > 0 && (
              <div className="w-full mt-3 h-[80px] flex flex-col items-end  justify-center">
                <Button onClick={() => clickUpdate()}>
                  {exelData.length} 업데이트
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
