import BaseRequest from "@/utils/http";

// 文件
enum API {
  download = "/download", // 下载文件
  upload = "/upload", // 上传文件，文件类型(mime type)，文件大小限制
  shard = "/shard", // 获取已上传文件列表
  cancel = "/shard/cancel/", // 取消上传
  finish = "/shard/finish/", // 上传完成
  reupload = "/shard/reupload/", // 重新上传
  listByIds = "/list_by_ids", // 文件查询
}
class FileAPI extends BaseRequest {
  private static BASE_API = "/api/file";
  getBaseUrl(): string {
    return FileAPI.BASE_API;
  }
  getUrl() {
    return API;
  }
  exportUrl() {
    return FileAPI.BASE_API + "/export";
  }

  /** 文件导出 open */
  exportFileByOpen(data, exportURL) {
    return this.exportOrDownloadFileByOpen(true, data, exportURL);
  }

  /** 文件下载 open */
  downloadFileByOpen(fileName) {
    return this.exportOrDownloadFileByOpen(false, { fileName });
  }

  /** 文件上传 */
  uploadFile(url: string, files: Recordable[] = []) {
    return this.uploadFile(url, files);
  }

  /** 文件下载 content-disposition */
  downloadFileByContentDisposition(fileName) {
    return this.downloadFileByContentDisposition({ fileName });
  }
}
export const fileApi = new FileAPI();
