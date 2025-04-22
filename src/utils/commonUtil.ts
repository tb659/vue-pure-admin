import debug from "debug";

// 封装日志记录方法
export function log(namespace: string, ...args: any[]) {
  debug(`debug:${namespace || "debug"}`)(...args);
}
