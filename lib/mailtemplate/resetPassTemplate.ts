export default function resetPassTemplate({ auth }: { auth: string }) {
  let html = `<!DOCTYPE html>
<html>
  <body>
    <div style="width: 500px">
      <p
        style="
          text-align: center;
          color: black;
          font-weight: 800;
          font-size: 24px;
        "
      >
        SANLONCANVAS 임시 비밀번호 안내 메일입니다.
      </p>
      <p style="text-align: center; color: black">
        아래의 임시비밀번호을 통해 로그인 후
      </p>
      <p style="text-align: center; color: black">
        비밀번호 변경을 통해 비밀번호를 변경해주세요.
      </p>
      <p
        style="
          background: #004de5;
          padding: 10px 20px;
          text-decoration: none;
          color: white;
          border-radius: 5px;
          text-align: center;
        "
      >
        ${auth}
      </p>
    </div>
  </body>
</html>


    `;

  return html;
}