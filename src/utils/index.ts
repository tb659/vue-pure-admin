import { cloneDeep } from "@pureadmin/utils";
import { isArray, isObject } from "./is";
import { msg } from "./message";

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

/**
 * @description: 处理查询参数
 * @param {*} formModel
 * @return {*}
 */
export function getQueryParams(formModel) {
  const sqp = {};
  const param = Object.assign(sqp, formModel);
  return filterObj(param);
}
/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == "object")) {
    return;
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] == undefined || obj[key] === "")) {
      delete obj[key];
    }
  }
  return obj;
}
/**
 * 类型转换
 * @param source
 * @param target
 * @returns
 */
export function convertType(source: any, target?: string): any {
  if (source === undefined || source === null) {
    return source;
  }
  switch (target) {
    case "String":
      return source.toString();
    case "Number":
      return Number(source);
    default:
      return source.toString();
  }
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
export function findIndex<T = Recordable>(ary: Array<T>, fn: Fn): number {
  if (ary.findIndex) {
    return ary.findIndex(fn);
  }
  let index = -1;
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary);
    if (ret) {
      index = i;
      return ret;
    }
  });
  return index;
}

/**
 * @description: 复制功能
 * @param {*} text 要复制的内容
 */
export function textCopy(text) {
  const _input = document.createElement("input");
  _input.value = text;
  document.body.appendChild(_input);
  _input.select();
  document.execCommand("Copy");
  _input.remove();
  msg.success("复制成功");
}

/**
 * @description: 清除对象为空的键
 * @param {*} o
 * @return {*} obj
 */
export function deleteObjKeyByEmpty(o: Recordable): Recordable {
  const obj = cloneDeep(o);
  for (const key in obj) {
    if (isObject(obj[key])) {
      obj[key] = deleteObjKeyByEmpty(obj[key]);
    } else if (isArray(obj[key])) {
      obj[key].forEach(item => {
        if (isObject(item)) {
          for (const key in item) {
            item[key] = deleteObjKeyByEmpty(item[key]);
          }
        }
      });
      obj[key] = deleteObjKeyByEmpty(obj[key]);
    } else {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
  }
  return obj;
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
};

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
};

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return "";
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase();
  });
};
