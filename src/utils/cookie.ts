import Cookies from "js-cookie";
import { responsiveStorageNameSpace } from "@/config";
import { TOKEN_KEY, SINGLE_CAPTCHA } from "./constants";

export function getCookie(key) {
  return Cookies.get(key);
}

export function setCookie(key, value) {
  return Cookies.set(key, value);
}

export function removeCookie(key) {
  return Cookies.remove(key);
}

export function getToken() {
  return getCookie(`${responsiveStorageNameSpace()}${TOKEN_KEY}`);
}

export function setToken(token) {
  return setCookie(`${responsiveStorageNameSpace()}${TOKEN_KEY}`, token);
}

export function removeToken() {
  return removeCookie(`${responsiveStorageNameSpace()}${TOKEN_KEY}`);
}

export function getSingleCaptcha() {
  return getCookie(`${responsiveStorageNameSpace()}${SINGLE_CAPTCHA}`);
}

export function setSingleCaptcha(token) {
  return setCookie(`${responsiveStorageNameSpace()}${SINGLE_CAPTCHA}`, token);
}

export function removeSingleCaptcha() {
  return removeCookie(`${responsiveStorageNameSpace()}${SINGLE_CAPTCHA}`);
}

export function setLoginInfoCookie(form: loginType, remember: boolean) {
  if (remember) {
    Cookies.set(`${responsiveStorageNameSpace()}username`, form.username, { expires: 30 });
    Cookies.set(`${responsiveStorageNameSpace()}password`, form.password, { expires: 30 });
    Cookies.set(`${responsiveStorageNameSpace()}remember`, remember + "", { expires: 30 });
  } else {
    Cookies.remove(`${responsiveStorageNameSpace()}username`);
    Cookies.remove(`${responsiveStorageNameSpace()}password`);
    Cookies.remove(`${responsiveStorageNameSpace()}rememberMe`);
  }
}
