import BaseRequest from "@/utils/http";

/** 工作流 */
enum API {
  def = "/def", // 审批流程
  ins = "/ins", // 审批实例
  insByService = "/ins/service", // 审批实例列表
  insAudit = "/ins/audit", // 审批实例
}
class WorkflowAPI extends BaseRequest {
  private static BASE_API = "/api/workflow";
  getBaseUrl(): string {
    return WorkflowAPI.BASE_API;
  }
  exportUrl() {
    return WorkflowAPI.BASE_API + "/export";
  }
  /** 查询审批流程列表 */
  queryDef<T>(id) {
    return this.get<T>(`${API.def}/${id}`);
  }
  /** 创建/编辑审批流程 */
  createDef(data) {
    return this.post(API.def, { data });
  }
  /** 查询审批实例列表 */
  queryIns<T>(params) {
    return this.get<T>(`${API.ins}`, { params });
  }
  /** 查询审批实例详情-by审批id */
  queryInsDetail<T>(id) {
    return this.get<T>(`${API.ins}/${id}`);
  }
  /** 查询审批实例详情-by业务id */
  queryInsDetailByService<T>(id) {
    return this.get<T>(`${API.insByService}/${id}`);
  }
  /** 审批动作 */
  insAudit(data) {
    return this.post(API.insAudit, { data });
  }
}
export const workflowApi = new WorkflowAPI();
