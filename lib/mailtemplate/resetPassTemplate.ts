export default function resetPassTemplate({ auth }: { auth: string }) {
  let html = `<!doctype html>
      <html>

<body>
  <div>
    <p style='text-align: center;color:black;font-weight:800;font-size: 24px;'>SANLONCANVAS 비밀번호 변경 이메일입니다.</p>
    <p style='text-align: center;color:black'>아래의 비밀번호 변경 버튼을 통해 비밀번호를 변경해주세요.</p>
    <p style="text-align: center;margin-top: 30px;">
      <a style="background: #004DE5;padding: 10px 20px;text-decoration: none;color:white;border-radius: 5px;" href="https://intekplus.saloncanvas.kr/auth/resetpass/${auth}">비밀번호 변경하기</a>
    </p>
  </div>
</body>

</html>
    `;

  return html;
}
