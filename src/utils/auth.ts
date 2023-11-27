import type { loginType } from "@/api/system/user/types";
import Cookies from "js-cookie";
import { config } from "@/utils/http/config";
import { PROJECT_PREFIX } from "@/utils/common";

const TokenKey = config.COOKIE_TOKEN_KEY;
const SingleCaptcha = config.COOKIE_SINGLE_CAPTCHA;

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
  return getCookie(TokenKey);
}

export function setToken(token) {
  return setCookie(TokenKey, token);
}

export function removeToken() {
  return removeCookie(TokenKey);
}

export function getSingleCaptcha() {
  return getCookie(SingleCaptcha);
}

export function setSingleCaptcha(token) {
  return setCookie(SingleCaptcha, token);
}

export function removeSingleCaptcha() {
  return removeCookie(SingleCaptcha);
}

export function setLoginInfoCookie(form: loginType, remember: boolean) {
  if (remember) {
    Cookies.set(`${PROJECT_PREFIX}username`, form.username, { expires: 30 });
    Cookies.set(`${PROJECT_PREFIX}password`, form.password, { expires: 30 });
    Cookies.set(`${PROJECT_PREFIX}remember`, remember + "", { expires: 30 });
  } else {
    Cookies.remove(`${PROJECT_PREFIX}username`);
    Cookies.remove(`${PROJECT_PREFIX}password`);
    Cookies.remove(`${PROJECT_PREFIX}rememberMe`);
  }
}
