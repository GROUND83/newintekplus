"use client";
import { Button } from "@/components/ui/button";
import ReactDOMServer from "react-dom/server";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sendCertification } from "./actions";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fonts } from "@/lib/fonts";
import vertificationTemplate from "@/lib/mailtemplate/vertificationTemplate";
import { sendCertificatesEmail } from "@/lib/sendMail/sendVertificationMail";
import { UploadFile } from "@/lib/fileUploader";
import { UploadResponse } from "nodejs-s3-typescript/dist/cjs/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const blobToFile = (theBlob: Blob, fileName: string): File => {
  return new File(
    [theBlob as any], // cast as any
    fileName,
    {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    }
  );
};
//

// const content = ({ html }) => {
//   const docRef = React.useRef<jsPDF>(null);
//   return (
//     <div>
//       <p>테스트</p>
//     </div>
//   );
// };
export default function SendVertification({
  group,
  participants,
}: {
  group: any;
  participants: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const html2pdf = async () => {
    let start = dayjs(group.startDate).format("YYYY.MM.DD");
    let end = dayjs(group.endDate).format("YYYY.MM.DD");
    let today = dayjs(group.endDate).format("YYYY.MM.DD");
    const doc = new jsPDF("p", "mm", "a4");
    doc.addFileToVFS("malgun.ttf", fonts);
    doc.addFont("malgun.ttf", "malgun", "normal");
    doc.addFont("malgun.ttf", "malgunbold", "bold");
    doc.setFont("malgun");
    // 297mm
    let position = 0;
    doc.setFontSize(40);
    doc.text("교육 수료증", 105, 50, { align: "center" });
    doc.setFontSize(16);
    doc.text(`성   명 : ${participants.username}`, 105, 80, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.text(`소   속 : ${participants.department || "-"}`, 105, 100, {
      align: "center",
    });
    doc.setFontSize(16);
    doc.text(`과 정 명 : ${group.name}`, 105, 120, {
      align: "center",
    });
    doc.setFontSize(16);
    doc.text(`교육기간 : ${start} ~ ${end}`, 105, 140, {
      align: "center",
    });
    // doc.setFontSize(40);
    // doc.text(`교육시간 : ${lessonTime} 일`, 105, 20, {
    //   align: "center",
    // });
    doc.setFontSize(16);
    doc.text(`위 사람은`, 105, 160, {
      align: "center",
    });
    doc.setFontSize(16);

    doc.text(`${group.name} `, 105, 180, {
      align: "center",
    });
    doc.text(`과정에 성실히 수료하였기에 이를 수여함. `, 105, 200, {
      align: "center",
    });
    doc.setFontSize(20);
    doc.text(`${today}`, 105, 230, {
      align: "center",
    });
    doc.setFontSize(20);
    doc.text(`인텍플러스 교육위원회`, 105, 250, {
      align: "center",
    });

    doc.save();
    const blob = new Blob([doc.output("blob")], { type: "application/pdf" });

    return blob;
  };
  const handlePrint = async () => {
    //
    setLoading(true);
    // console.log(docRef.current);
    try {
      let data = await html2pdf();
      console.log(data);

      const file = blobToFile(data, "my-image.png");
      console.log(file);
      let formData = new FormData();
      formData.append("file", file);
      let filedata = formData.get("file");

      let newformData = new FormData();
      newformData.append("file", filedata);
      newformData.append("folderName", "certification");
      let upload = await UploadFile(newformData);
      let { location } = upload as UploadResponse;

      console.log("location", location);
      let fileUrl = location;
      console.log("fileUrl", fileUrl, participants.email);
      //
      let to = `${participants.email}`;
      const mailData: any = {
        to: to,
        subject: "살롱캔버스 수료증 이메일 입니다.",
        from: "intekplus@saloncanvas.kr",
        html: vertificationTemplate({
          title: "수료증 발송",
          description: "첨부파일을 확인하세요.",
        }),
        attachments: [
          {
            filename: `${participants._id}.pdf`, // the file name
            path: location, // link your file
            contentType: file.type, //type of file
          },
        ],
      };
      let result = await sendCertificatesEmail(mailData);
      console.log("result", result);

      toast.success("메일 발송에 성공하였습니다.");

      //
    } catch (e) {
      toast.error(e);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Dialog open={open}>
        <DialogTrigger asChild>
          <Button size="xs" type="button" onClick={() => setOpen(true)}>
            수료증 발급
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[70vw] ">
          <DialogHeader>
            <DialogTitle>수료증 발급</DialogTitle>
            <DialogDescription>
              {participants.username}에게 수료증을 발급합니다.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex">
            <div className="flex flex-col w-full gap-2 ">
              <div className="p-12 w-full gap-3 flex flex-col">
                <div className="  flex flex-col items-center">
                  <p className=" font-bold text-4xl">교육 수료증</p>
                </div>
                <div className="  flex flex-col items-center justify-center text-md gap-3 mt-6 ">
                  <div className="flex flex-row items-center gap-6">
                    <div className="">
                      <p>성명</p>
                    </div>
                    <p>{participants.username}</p>
                  </div>
                  <div className="flex flex-row items-center gap-6">
                    <div className="">
                      <p>소속</p>
                    </div>
                    <p>{participants.department || "-"}</p>
                  </div>
                  <div className="flex flex-row items-center gap-6">
                    <div className="">
                      <p>과정명</p>
                    </div>
                    <p>{group.name}</p>
                  </div>
                  <div className="flex flex-row items-center gap-6">
                    <p>교육기간</p>
                    <p>{dayjs(group.startDate).format("YYYY.MM.DD")} ~ </p>
                    <p>{dayjs(group.endDate).format("YYYY.MM.DD")}</p>
                  </div>
                  <div className="flex flex-row items-center gap-6">
                    <p>교육시간</p>
                    <p>{dayjs(group.startDate).format("YYYY.MM.DD")}</p>
                  </div>
                </div>
                <div className=" col-span-12 flex flex-col items-center justify-center text-md gap-3 mt-6">
                  <p className="text-md">위 사람은 {group.name} 과정에</p>
                  <p className="text-md">성실히 수료하였기에 이를 수여함.</p>
                </div>
                <div className=" col-span-12 flex flex-row items-center justify-center text-md gap-3 mt-6">
                  <p className="text-md">{dayjs().format("YYYY.MM.DD")}</p>
                </div>
                <div className=" col-span-12 flex flex-row items-center justify-center text-md gap-3">
                  <p className="text-md">인텍플러스 교육위원회</p>
                </div>
              </div>
            </div>
            <DialogFooter className="  justify-center">
              <Button
                size="lg"
                type="button"
                onClick={() => handlePrint()}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className=" animate-spin size-4" />
                ) : (
                  <p>수료증 발급</p>
                )}
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setOpen(false)}
                >
                  닫기
                </Button>
              </DialogClose>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
