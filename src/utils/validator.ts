import { $t, transformI18n } from "@/plugins/i18n";

type Callback = (error?: string | Error | undefined) => void;

interface LengthRange {
  min: number;
  max: number;
  message: string;
}

function required(message?: string) {
  return {
    required: true,
    message: message || transformI18n($t("form.required")),
    trigger: "blur"
  };
}

function lengthRange(val: any, callback: Callback, options: LengthRange) {
  const { min, max, message } = options;
  if (val.length < min || val.length > max) {
    callback(new Error(message));
  } else {
    callback();
  }
}

function notSpace(val: any, callback: Callback, message: string) {
  // 用户名不能有空格
  if (val.indexOf(" ") !== -1) {
    callback(new Error(message));
  } else {
    callback();
  }
}

// 两个字符串是否想等
function isEqual(val1: string, val2: string, callback: Callback, message: string) {
  if (val1 === val2) {
    callback();
  } else {
    callback(new Error(message));
  }
}

export { required, lengthRange, notSpace, isEqual };
