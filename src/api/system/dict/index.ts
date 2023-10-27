import BaseRequest from "@/utils/http";

class DictAPI extends BaseRequest {
  private static BASE_API = "/api/sys/dictionaries";
  getBaseUrl(): string {
    return DictAPI.BASE_API;
  }
  exportUrl() {
    return DictAPI.BASE_API + "/export";
  }
}
export const dictApi = new DictAPI();
