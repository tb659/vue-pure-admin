import BaseRequest from "@/utils/http";

class DeptAPI extends BaseRequest {
  private static BASE_API = "/api/sys/depts";
  getBaseUrl(): string {
    return DeptAPI.BASE_API;
  }
  exportUrl() {
    return DeptAPI.BASE_API + "/export";
  }
  /** 部门查询第一到第五事业部 */
  queryFiveDept(params) {
    return this.get("/queryFiveDept", { params });
  }
}
export const deptApi = new DeptAPI();
