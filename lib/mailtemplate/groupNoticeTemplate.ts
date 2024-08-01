export default function groupNotiveTemplate({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  let html = `<!doctype html>
    <html>
    <body style="width:500px;">
    <div style="border: 1px;width: 400px;background-color: #f5f5f5;border: 1px solid #e5e7eb;padding: 70px;border-radius: 20px;">
    <h1 style="font-size: 24px; margin-top: 20px">그룹 공지사항 입니다.</h1>
    <p style="font-size: 24px">${title}</p>
    <div
      style="
        width: 100%;
        margin-top: 20px;
      "
    >
      <div
        style="
          width: 100%;
          padding-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
        "
      >
        <span>내용</span>
        </div>
        <div
        style="width: 100%;  margin-top: 10px;">
      <span style="margin-left: 10px; white-space: pre-wrap;">${description}</span>
      </div>
    </div>
    <div style="margin-top: 50px">
      <p style="color: #737373">© 2024. saloncanvas All rights reserved.</p>
    </div>
  </div>
  </body>
  </html>
  `;

  return html;
}
