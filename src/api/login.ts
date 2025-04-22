import { stringify } from "qs";

import BaseRequest from "@/utils/http";

enum API {
  getCaptcha = "/captcha", // 验证码
  login = "/login", // 登录
  loginByCode = "/api/sys/users/loginByCode", // 更新密码
  changeToken = "/api/sys/users/change/token", // 更换token
}

class LoginAPI extends BaseRequest {
  private static BASE_API = "";
  getBaseUrl(): string {
    return LoginAPI.BASE_API;
  }

  login<T>(data: Partial<loginType>, beforeRequestCallback) {
    return this.post<T>(`${API.login}?${stringify({ ...data })}`, null, {
      beforeRequestCallback,
    });
  }

  loginByCode<T>(code) {
    return this.get<T>(API.loginByCode + "/" + code);
  }

  getCaptcha<T>(beforeResponseCallback) {
    return this.get<T>(API.getCaptcha, null, {
      beforeResponseCallback,
      responseType: "blob",
    });
  }

  changeToken<T>(data) {
    return this.post<T>(API.changeToken, { data });
  }
}
export const loginApi = new LoginAPI();
