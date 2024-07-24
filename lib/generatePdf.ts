"use server";
import dayjs from "dayjs";
import path from "path";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";

//
export async function generatePdf(formData: FormData) {
  // we wrap everything with a Promise to make a nice interface
  // to just await a PDF content
  let userName = formData.get("userName");
  let department = formData.get("department");
  let lessonTime = formData.get("lessonTime");
  let lessonName = formData.get("lessonName");
  let start = formData.get("start");
  let end = formData.get("end");
  return new Promise((resolve, reject) => {
    console.time("pdf"); // we can track how long it took to generate a PDF

    let fontpath = "/font/NotoSansKR-Medium.ttf";
    let fontbold = "/font/NotoSansKR-Bold.ttf";
    // let logo = __dirname + "/template/logo/companyLogo.png";
    const doc = new PDFDocument({
      size: "A4",
    });
    const stream = doc.pipe(blobStream());
    let finalString = ""; // we collect the actual stream data in this variable
    doc.registerFont("NotoSansKR", fontpath);
    doc.registerFont("bold", fontbold);

    doc
      .font("NotoSansKR")
      //   .image(logo, 190, 320, { width: 250 }) // 297 420
      .fontSize(48) // we can configure different font size for the first line
      .text("교육 수료증", { align: "center" })
      .moveDown()
      .moveDown()
      .fontSize(16)
      .text(`성   명 : ${userName}`)
      .fontSize(16)
      .text(`소   속 : ${department || "-"}`)
      .fontSize(16)
      .text(`과 정 명 : ${lessonName}`)
      .fontSize(16)
      .text(`교육기간 : ${start} ~ ${end}`)
      .fontSize(16)
      .text(`교육시간 : ${lessonTime} 일`)
      .moveDown()
      .moveDown()
      .fontSize(16)
      .text(
        `위 사람은 "${lessonName}" 과정에  성실히 수료하였기에 이를 수여함. `
      )
      .moveDown()
      .moveDown()
      .fontSize(20)
      .text(`${dayjs().format("YYYY.MM.DD")}`, { align: "center" })
      .moveDown()
      .moveDown()
      .moveDown()

      .font("bold")
      .fontSize(20)
      .text(`인텍플러스 교육위원회`, { align: "center" })
      .end(); // this will trigger the "end" event on the stream
    stream.on("finish", function () {
      // get a blob you can do whatever you like with
      const blob = stream.toBlob("application/pdf");
      console.timeEnd("pdf");
      resolve(blob);
    });
    // stream.on("data", (chunk) => {
    //   finalString += chunk;
    // });

    // stream.on("end", () => {
    //   console.timeEnd("pdf"); // on my machine it took 32ms
    //   resolve(finalString);
    // });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}
