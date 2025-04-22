/**
 * @description 系统管理-系统日志
 */
import BaseRequest from "@/utils/http";

class SystemLogAPI extends BaseRequest {
  private static BASE_API = "/api/logging";
  getBaseUrl(): string {
    return SystemLogAPI.BASE_API;
  }
  exportUrl() {
    return SystemLogAPI.BASE_API + "/export";
  }
}
export const systemLogApi = new SystemLogAPI();
