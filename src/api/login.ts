import { http } from "@/utils/http/api-base";
import QueryString from "qs";
import type { loginType, UserData } from "./system/user/types";
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

  login(data: Partial<loginType>, beforeRequestCallback) {
    return http.request<PureResponse<UserData>>("post", `${API.login}?${QueryString.stringify({ ...data })}`, null, {
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
    return http.request<PureResponse<UserData>>("post", API.changeToken, { data });
  }
}
export const loginApi = new LoginAPI();
