const baseUrl = {
  // dev: "/dev-api",
  dev: "http://47.96.19.146:4000/frame_base",
  test: "http://47.96.19.146:4000/frame_base",
  staging: "http://47.96.19.146:4000/frame_base",
  pro: "http://47.96.19.146:4000/frame_base",
};
const baseURL = baseUrl[import.meta.env.VITE_API_BASEPATH];
const httpConfig: {
  /** api请求基础路径 */
  baseUrl: {
    /** 开发环境接口前缀 */
    dev: string;
    /** 打包测试环境接口前缀 */
    test: string;
    /** 打包预发布环境接口前缀 */
    staging: string;
    /** 打包生产环境接口前缀 */
    pro: string;
  };
  /** 导出 */
  baseURL: string;
  /** 导出 */
  exportUrl: string;
  /** 上传 */
  uploadUrl: string;
  /** 下载 */
  downloadUrl: string;
  /** 请求超时时间 */
  timeout: number;
  /** 接口成功返回状态码 */
  resultCode: number | string;
  /** 是否模拟请求 */
  mockRequest: boolean;
} = {
  baseUrl,
  baseURL: baseURL,
  exportUrl: baseURL,
  uploadUrl: baseURL + "/api/file/upload",
  downloadUrl: baseURL + "/api/file/download",
  timeout: 30000,
  resultCode: "0",
  mockRequest: false,
};
export { httpConfig };
