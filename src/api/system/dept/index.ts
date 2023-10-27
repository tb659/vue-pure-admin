import BaseRequest from "@/utils/http";

class DeptAPI extends BaseRequest {
  private static BASE_API = "/api/sys/depts";
  getBaseUrl(): string {
    return DeptAPI.BASE_API;
  }
  exportUrl() {
    return DeptAPI.BASE_API + "/export";
  }
}
export const deptApi = new DeptAPI();
