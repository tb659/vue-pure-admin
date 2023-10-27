import { loginType } from "@/api/system/user/types";
import Cookies from "js-cookie";
import { PROJECT_PREFIX } from "@/utils/common";
import { config } from "@/utils/http/config";

const TokenKey = config.TOKEN_KEY;

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
