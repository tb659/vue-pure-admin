import { getToken } from "@/utils/auth";
import { TOKEN_KEY } from "@/utils/constants";

function getError(option, xhr) {
  const msg = `cannot post ${option.action} ${xhr.status}'`;
  const err = new Error(msg);
  err["status"] = xhr.status;
  err["method"] = "post";
  err["url"] = option.action;
  return err;
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.log(e);
    return text;
  }
}

export default function requestFile(option) {
  const xhr = new XMLHttpRequest();
  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e["percent"] = (e.loaded / e.total) * 100;
        e["timestamp"] = Date.now();
      }
      option.onProgress(e);
    };
  }

  const formData = new FormData();

  if (option.data) {
    Object.keys(option.data).forEach(key => {
      formData.append(key, option.data[key]);
    });
  }

  formData.append(option.filename || "file", option.file);

  xhr.onerror = function error(e) {
    option.onError(e);
  };

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(option, xhr), getBody(xhr));
    }

    option.onSuccess(getBody(xhr), xhr);
  };

  xhr.open("post", option.action, true);

  if (option.withCredentials && "withCredentials" in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  if (headers["X-Requested-With"] !== null) {
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  }

  Object.keys(headers).forEach(key => {
    if (headers["hasOwnProperty"](key) && headers[key] !== null) {
      xhr.setRequestHeader(key, headers[key]);
    }
  });

  xhr.setRequestHeader(TOKEN_KEY, getToken());
  xhr.send(formData);

  return {
    abort() {
      xhr.abort();
    },
  };
}
