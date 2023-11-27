import type { PureHttpResponse, RequestMethods, PureHttpRequestConfig } from "@/utils/http/types";
import { hideLoading, showLoading } from "@/utils/loading";
import { downloadFileBlob } from "@/utils/file";
import { http } from "./api-base";

export default abstract class BaseRequest {
  abstract getBaseUrl(): string;

  /** 分页查询 */
  page<T, Q = Recordable>(params: Q): Promise<PureResponse<T>> {
    return this.get<T>(``, { params });
  }

  /** 列表查询 */
  list<T, Q = Recordable>(params: Q): Promise<PureResponse<T>> {
    return this.get<T>(`/list`, { params });
  }

  /** 详情查询 */
  detail<T, Q = string | number>(id: Q): Promise<PureResponse<T>> {
    return this.get<T>(`/${id}`, null);
  }

  /** 保存  */
  create<T, VO = Recordable>(data: VO): Promise<PureResponse<T>> {
    return this.post<T>(``, { data });
  }

  /** 修改 */
  update<T, VO = Recordable>(data: VO): Promise<PureResponse<T>> {
    return this.put<T>(``, { data });
  }

  /** 修改 */
  updateById<T, VO = Recordable>(id: VO): Promise<PureResponse<T>> {
    return this.put<T>(`/${id}`, null);
  }

  /** 删除 */
  deleteById<T, Q = string | number>(id: Q): Promise<PureResponse<T>> {
    return this.delete<T>(`/${id}`, null);
  }

  /** 启用 */
  enableById<T, Q = string | number>(id: Q): Promise<PureResponse<T>> {
    return this.put<T>(`/${id}/enable`, null);
  }

  /** 禁用 */
  disableById<T, Q = string | number>(id: Q): Promise<PureResponse<T>> {
    return this.put<T>(`/${id}/disable`, null);
  }

  /** 根据id批量删除 */
  deleteBatch<T, VO = Recordable>(data: VO): Promise<PureResponse<T>> {
    return this.delete<T>(``, { data });
  }

  /** 根据id批量启用 */
  enableBatch<T, VO = Recordable>(data: VO): Promise<PureResponse<T>> {
    return this.put<T>(`/enable`, { data });
  }

  /** 根据id批量禁用 */
  disableBatch<T, VO = Recordable>(data: VO): Promise<PureResponse<T>> {
    return this.put<T>(`/disable`, { data });
  }

  /** 重置密码 */
  resetPassword<T, VO = Recordable>(data: VO): Promise<PureResponse<T>> {
    return this.put<T>(``, { data });
  }

  /** 单独抽离的get工具函数 */
  public get<T>(url: string, params?, config?: PureHttpRequestConfig): Promise<PureResponse<T>> {
    return this.requestNonLoading<T>("get", url, params, config);
  }

  /** 单独抽离的post工具函数 */
  public post<T>(url: string, params?, config?: PureHttpRequestConfig): Promise<PureResponse<T>> {
    return this.requestNonLoading<T>("post", url, params, config);
  }

  /** 单独抽离的put工具函数 */
  public put<T>(url: string, params?, config?: PureHttpRequestConfig): Promise<PureResponse<T>> {
    return this.requestNonLoading<T>("put", url, params, config);
  }

  /** 单独抽离的delete工具函数 */
  public delete<T>(url: string, params?, config?: PureHttpRequestConfig): Promise<PureResponse<T>> {
    return this.requestNonLoading<T>("delete", url, params, config);
  }

  /** http请求无遮挡 */
  public requestNonLoading<T>(
    method: RequestMethods,
    url: string,
    params?,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<PureResponse<T>> {
    return http.request<T>(method, this.getBaseUrl().trim() + url, params, axiosConfig);
  }

  /** http基本请求  */
  public request<T>(method: RequestMethods, url: string, params?, axiosConfig?: PureHttpRequestConfig): Promise<PureResponse<T>> {
    showLoading();
    return http.request<T>(method, this.getBaseUrl().trim() + url, params, axiosConfig).finally(() => {
      hideLoading();
    });
  }

  /** 文件下载 */
  public downloadFileRequest<R>(method: RequestMethods, url: string, params?: R): Promise<void> {
    let response: PureHttpResponse = null;
    return http
      .request<void>(method, this.getBaseUrl().trim() + url, params, {
        responseType: "blob",
        beforeResponseCallback: function (res: PureHttpResponse) {
          response = res;
        }
      })
      .then(result => {
        const contentDisposition = response.headers["content-disposition"];
        downloadFileBlob(result, response.headers["content-type"], contentDisposition);
        return Promise.resolve();
      });
  }
  /** 文件上传 */
  public uploadFileRequest<T>(url: string, files: any[]): Promise<PureResponse<T>> {
    const fileData = new FormData();
    files.forEach(file => {
      fileData.append("file", file);
    });
    return http.request<T>(
      "post",
      this.getBaseUrl().trim() + url,
      { data: fileData },
      {
        headers: { "content-type": "multiple/form-data" }
      }
    );
  }
}
