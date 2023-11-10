import BaseRequest from "@/utils/http";

// ! 岗位管理
const API = {
  users: "/users" // 添加成员
};
class PositionAPI extends BaseRequest {
  private static BASE_API = "/api/sys/position";
  getBaseUrl() {
    return PositionAPI.BASE_API;
  }
  exportUrl() {
    return PositionAPI.BASE_API + "/export";
  }
  deletePost(id) {
    return this.delete(`/${id}`, id);
  }
  // 添加成员
  addMember(data) {
    return this.post(API.users, { data });
  }
  // 移除成员
  deleteMember(data) {
    return this.delete(API.users, { data });
  }
}
export const positionApi = new PositionAPI();
