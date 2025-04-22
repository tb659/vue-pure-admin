import dayjs from "dayjs";
import { msg } from "./msg";
import { isArray, isObject } from "./is";
import { cloneDeep } from "@pureadmin/utils";

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
/**
 * @description 根据证件号获取出生日期及年龄
 * @param {string} idNo 证件号
 * @returns {Object} birthDate出生年月 age年龄
 */
export const getBirthDateAndAge = (idNo: string) => {
  // 身份证号码规则：前6位为地址码，接下来的8位为出生日期码，最后一位为验证码
  const birthDateString = idNo.substring(6, 14);
  const birthDate = new Date(
    parseInt(birthDateString.substring(0, 4), 10), // 年
    parseInt(birthDateString.substring(4, 6), 10) - 1, // 月（月份从0开始计数）
    parseInt(birthDateString.substring(6, 8), 10), // 日
  );

  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  let ageString = age.toString();

  // 如果今年过了出生月份，则年龄实际年数加一
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    ageString = (age - 1).toString();
  }

  return {
    birthDate: dayjs(birthDate).format("YYYY-MM-DD"),
    age: ageString,
  };
};

/**
 * @description: 数组对象去重
 * @param {*} data
 * @param {*} key
 * @return {*}
 */
export function uniqueArray(arr: Recordable[], key = "id"): Recordable[] {
  const found = {};
  return arr.filter(item => {
    const k = item[key];
    if (found[k]) {
      // 如果已存在，则不添加
      return false;
    } else {
      // 添加到已找到对象，并返回true以保留当前项
      found[k] = true;
      return true;
    }
  });
}

/**
 * @description: 人民币转大写
 * @param {number} money
 * @return {*}
 */
export function toRmb(money: number): string {
  const fraction = ["角", "分", "厘", "毫"];
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"],
  ];
  const head = money < 0 ? "欠" : "";
  money = Math.abs(money);
  let s = "";
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(money * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, "");
  }
  s = s || "整";
  money = Math.floor(money);
  for (let i = 0; i < unit[0].length && money > 0; i++) {
    let p = "";
    for (let j = 0; j < unit[1].length && money > 0; j++) {
      p = digit[money % 10] + unit[1][j] + p;
      money = Math.floor(money / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, "元")
      .replace(/(零.)+/g, "零")
      .replace(/^整$/, "零元整")
  );
}
