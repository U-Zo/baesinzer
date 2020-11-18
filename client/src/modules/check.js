export function chkEmail(str) {
  let email = str;
  let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  if (!regExp.test(str)) {
    return false;
  }

  return true;
}
