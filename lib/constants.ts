export const PASSWORD_MIN_LENGHT = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_ERROR_MESSAGE = "4자리 이상 비밀번호를 입력하세요.";
export const PASSWORD_REGEX_ERROR =
  "비밀번호는 소문자,대문자,숫자,특수문자를 포함해야됩니다.";
