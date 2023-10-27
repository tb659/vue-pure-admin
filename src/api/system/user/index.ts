import BaseRequest from "@/utils/http";

// 用户
enum API {
  updatePassword = "/password" // 更新密码
}

class UserAPI extends BaseRequest {
  private static BASE_API = "/api/sys/users";
  getBaseUrl(): string {
    return UserAPI.BASE_API;
  }
  exportUrl() {
    return UserAPI.BASE_API + "/export";
  }
  updatePassword(data) {
    return this.put(API.updatePassword, { data });
  }
}
export const userApi = new UserAPI();
