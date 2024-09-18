import { http } from "@/utils/http/api-base";
import type { loginType } from "./system/user/types";
import QueryString from "qs";
enum API {
  login = "/login", // 登录
  getCaptcha = "/captcha", // 验证码
  changeToken = "/api/sys/users/change/token" // 更换token
}

class LoginAPI {
  private static BASE_API = "/";
  getBaseUrl(): string {
    return LoginAPI.BASE_API;
  }

  login<T>(data: Partial<loginType>, beforeRequestCallback) {
    return http.request<T>("post", `${API.login}?${QueryString.stringify({ ...data })}`, null, {
      beforeRequestCallback
    });
  }

  getCaptcha(beforeResponseCallback) {
    return http.request("get", API.getCaptcha, null, {
      beforeResponseCallback,
      responseType: "blob"
    });
  }

  changeToken(data) {
    return http.request("post", API.changeToken, { data });
  }
}
export const loginApi = new LoginAPI();
