import qs from "qs";
import dayjs from "dayjs";

import { getToken } from "@/utils/auth";
import { TOKEN_KEY } from "@/utils/constants";
import { httpConfig } from "./http/config";

/**
 * @description: get参数编码
 * @param {*} url
 * @param {*} params
 * @return {*}
 */
export const formatUrl = (url, params) => {
  const paramsStr = JSON.stringify(params);
  if (paramsStr === "{}") return url;
  url += "?";
  const keys = Object.keys(params);
  for (const key of keys) {
    if (params[key] !== void 0 && params[key] !== null) {
      url += `${key}=${encodeURIComponent(params[key])}&`;
    }
  }
  return url.substring(0, url.length - 1);
};

/**
 * @description: 文件大小格式化
 * @param {*} limit
 * @return {*}
 */
export function bytesFormat(limit) {
  let size = "";
  if (limit < 1024) {
    // 小于1KB，则转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 1024 * 1024) {
    // 小于1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 1024 * 1024 * 1024) {
    // 小于1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  const sizeStr = size + ""; // 转成字符串
  const index = sizeStr.indexOf("."); // 获取小数点处的索引
  const dou = sizeStr.substr(index + 1, 2); // 获取小数点后两位的值
  if (dou === "00") {
    // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
  }
  return size;
}

/**
 * @description: 获取文件ID
 * @param {*} fileStr
 * @return {*}
 */
export function getFileListId(fileStr) {
  let idStr = "";
  try {
    const fileList = JSON.parse(fileStr);
    idStr = fileList.map(file => file.id).join(",");
  } catch (error) {
    console.log(error);
  }
  return idStr;
}

/**
 * @description: 数据返回的文件数组字符串转化为JSON数组
 * @param {Recordable} data
 * @param {string} keyList
 * @return {*}
 */
export function setFileStrToObj(data: Recordable, keyList: string[]) {
  try {
    keyList.forEach(key => {
      if (data[key]) {
        const file = JSON.parse(data[key]);
        data[key + "ObjList"] = file;
        file.forEach((fileItem, index) => {
          data[`${key}ObjListById${index}`] = fileItem.id;
          data[`${key}ObjListByFileName${index}`] = fileItem.fileName;
          data[`${key}ObjListByOriginName${index}`] = fileItem.originName;
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * @description: 下载或者导出
 * @param {boolean} isExport 是否导出
 * @param {*} data 参数
 * @param {*} exportURL 导出链接
 * @return {*}
 */
export function exportOrDownloadByOpen(isExport: boolean, data, exportURL = "") {
  const params = qs.stringify({ ...data, [TOKEN_KEY]: getToken() });
  window.open(`${isExport ? httpConfig.baseURL + exportURL : httpConfig.downloadUrl}?${params}`);
}

/**
 * @description: blob下载
 * @param {*} data
 * @param {*} contentType
 * @param {*} contentDisposition
 * @return {*}
 */
export function downloadFileBlob(data, contentType, contentDisposition) {
  const blob = new Blob([data], {
    type: contentType,
  });
  const downloadElement = document.createElement("a");
  const href = window.URL.createObjectURL(blob);
  const patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
  const result = patt.exec(contentDisposition);
  const filename = decodeURI(escape(result[1])); // 处理文件名,解决中文乱码问题
  downloadElement.style.display = "none";
  downloadElement.href = href;
  downloadElement.download = filename; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}

/**
 * @description: 导出excel
 * @param {any} res
 * @param {string} type
 * @param {string} fileName
 * @return {*}
 */
export const exportFileByLink = (api, params) => {
  let url = httpConfig.exportUrl + api;
  url = formatUrl(url, params);
  console.log("fetch------url", url);
  fetch(`${url}`, {
    method: "GET",
    headers: new Headers({ [TOKEN_KEY]: String(getToken()) }),
  }).then(res => {
    res.blob().then(blob => {
      // 创建a标签，并处理二级制数据
      const aLink = document.createElement("a");

      // 设置下载文件名称，使用正则取出名称
      const pat = new RegExp("filename=([^;]+\\.[^\\.;]+)");
      // 浏览器问题可能会出现 content-disposition 匹配不到
      const contentDisposition = res.headers["content-disposition"] || res.headers["Content-Disposition"];
      const result = pat.exec(contentDisposition);
      let fileName = result && result[1];
      // 如果Content-Disposition没有暴露，给文件一个默认名字
      if (fileName === null) fileName = dayjs().format("YYYYMMDDHHmmss");
      // 生成下载链接
      const URL = window.URL || window.webkitURL;
      aLink.href = URL.createObjectURL(blob);
      aLink.setAttribute("download", fileName);
      // 下载
      document.body.appendChild(aLink);
      aLink.click();
      // 释放URL对象
      window.URL.revokeObjectURL(aLink.href);
      document.body.removeChild(aLink);
    });
  });
};

/**
 * @Desc: 文件转buffer
 */
export const fileToBuffer = file => {
  return new Promise(r => {
    const reader = new FileReader();
    reader.onload = () => {
      r(reader.result);
    };
    reader.readAsArrayBuffer(file);
  });
};
