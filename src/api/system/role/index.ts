import BaseRequest from "@/utils/http";

class RoleAPI extends BaseRequest {
  private static BASE_API = "/api/sys/roles";
  getBaseUrl(): string {
    return RoleAPI.BASE_API;
  }
  exportUrl() {
    return RoleAPI.BASE_API + "/export";
  }
}
export const roleApi = new RoleAPI();
