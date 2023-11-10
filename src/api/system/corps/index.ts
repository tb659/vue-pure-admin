import BaseRequest from "@/utils/http";

// ! 机构单位
const API = {
  selectListByUserName: "/selectListByUserName"
};

class CorpsAPI extends BaseRequest {
  private static BASE_API = "/api/sys/corps";
  getBaseUrl() {
    return CorpsAPI.BASE_API;
  }
  exportUrl() {
    return CorpsAPI.BASE_API + "/export";
  }
  // 查询列表
  querySelectListByUserName<T>(params) {
    return this.get<T>(API.selectListByUserName, { params });
  }
}
export const corpsApi = new CorpsAPI();
