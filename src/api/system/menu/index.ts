import BaseRequest from "@/utils/http";

class MenuAPI extends BaseRequest {
  private static BASE_API = "/api/sys/resources";
  getBaseUrl(): string {
    return MenuAPI.BASE_API;
  }
  exportUrl() {
    return MenuAPI.BASE_API + "/export";
  }
}
export const menuApi = new MenuAPI();
