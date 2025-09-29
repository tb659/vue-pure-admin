import type { VNode } from "vue";
import { isFunction } from "@/utils/is";
import { type MessageHandler, type ElMessageBoxOptions, ElMessage, ElMessageBox } from "element-plus";

type messageStyle = "el" | "antd";
type messageTypes = "info" | "success" | "warning" | "error";

interface MessageParams extends ElMessageBoxOptions {
  // ! message 独有
  /** 显示时间，单位为毫秒。设为 `0` 则不会自动关闭，`element-plus` 默认是 `3000` ，平台改成默认 `2000` */
  duration?: number;
  /** `Message` 距离窗口顶部的偏移量，默认 `20` */
  offset?: number;
  /** 合并内容相同的消息，不支持 `VNode` 类型的消息，默认值 `false` */
  grouping?: boolean;
  /** 关闭时的回调函数, 参数为被关闭的 `message` 实例 */
  onClose?: () => void;
  // ! messageBox 独有
  /** 文字是否居中，默认值 `false` */
  center?: boolean;
  // ! message messageBox 共有
  /** 设置组件的根元素，默认 `document.body` */
  appendTo?: string | HTMLElement;
  /** 消息风格，可选 `el` 、`antd` ，默认 `antd` */
  customClass?: messageStyle;
  /** 是否将 `message` 属性作为 `HTML` 片段处理，默认 `false` */
  dangerouslyUseHTMLString?: boolean;
  /** 自定义图标，该属性会覆盖 `type` 的图标 */
  icon?: any;
  /** 是否显示关闭按钮，默认值 `false` */
  showClose?: boolean;
  /** 消息类型，可选 `info` 、`success` 、`warning` 、`error` ，默认 `info` */
  type?: messageTypes;
  // ! 自定义
  infoType?: messageTypes;
  /** 确定时的回调事件 */
  confirmBack?: (result?: any) => void;
  /** 取消时的回调事件 */
  cancelBack?: (error?: any) => void;
}

/** 用法非常简单，参考 src/views/components/message/index.vue 文件 */

class Message {
  /**
   * `Message` 消息提示函数
   */
  info(message: string | VNode | (() => VNode), params?: MessageParams): MessageHandler {
    if (!params) {
      return ElMessage({
        message,
        customClass: "pure-message",
      });
    } else {
      const {
        icon,
        type = "info",
        dangerouslyUseHTMLString = false,
        customClass = "antd",
        duration = 3000,
        showClose = false,
        offset = 20,
        appendTo = document.body,
        grouping = false,
        onClose,
      } = params;

      return ElMessage({
        message,
        type,
        icon,
        dangerouslyUseHTMLString,
        duration,
        showClose,
        offset,
        appendTo,
        grouping,
        // 全局搜 pure-message 即可知道该类的样式位置
        customClass: customClass === "antd" ? "pure-message" : "",
        onClose: () => (isFunction(onClose) ? onClose() : null),
      });
    }
  }

  /**
   * 关闭所有 `Message` 消息提示函数
   */
  closeAll(): void {
    ElMessage.closeAll();
  }

  /**
   * @description: 成功
   * @param {string} message
   * @return {*}
   */
  success(message = "操作成功", params?: MessageParams) {
    this.info(message, { ...(params || {}), type: "success" });
  }

  /**
   * @description: 警告
   * @param {string} message
   * @return {*}
   */
  warning(message: string, params?: MessageParams) {
    this.info(message, { ...(params || {}), type: "warning" });
  }

  /**
   * @description: 失败
   * @param {string} message
   * @return {*}
   */
  error(message: string, params?: MessageParams) {
    this.info(message, { ...(params || {}), type: "error" });
  }

  /**
   * 基础弹框方法，返回 Promise 以支持链式调用
   */
  private box(
    boxType: "alert" | "confirm" | "prompt",
    info: string | VNode | (() => VNode),
    title: string,
    params?: MessageParams,
  ): Promise<any> {
    const {
      infoType = "warning",
      cancelButtonText = "取消",
      confirmButtonText = "确定",
      confirmBack,
      cancelBack,
      ...restParams
    } = params || {};

    return new Promise((resolve, reject) => {
      ElMessageBox[boxType](info || "消息提示", title || "系统提示", {
        type: infoType,
        cancelButtonText,
        cancelButtonClass: `${boxType}-cancel-button-class`,
        confirmButtonText,
        confirmButtonClass: `${boxType}-confirm-button-class`,
        dangerouslyUseHTMLString: true,
        ...restParams,
      })
        .then(async result => {
          if (isFunction(confirmBack)) {
            await confirmBack(result);
          }
          resolve(result);
        })
        .catch(async error => {
          if (isFunction(cancelBack)) {
            await cancelBack(error);
          }
          // 只有当用户点击取消按钮时才 reject，关闭弹窗不 reject
          if (error === "cancel" || error === "close") {
            reject(error);
          } else {
            resolve(error); // 其他情况（如点击确定）仍然 resolve
          }
        });
    });
  }

  /**
   * Alert 弹框，返回 Promise
   */
  alert(info: string | VNode | (() => VNode), title: string, params?: MessageParams): Promise<any> {
    return this.box("alert", info, title, params);
  }

  /**
   * Confirm 确认框，返回 Promise
   */
  confirm(info: string | VNode | (() => VNode), title: string, params?: MessageParams): Promise<any> {
    return this.box("confirm", info, title, params);
  }

  /**
   * Prompt 输入框，返回 Promise
   */
  prompt(info: string | VNode | (() => VNode), title: string, params?: MessageParams): Promise<any> {
    return this.box("prompt", info, title, params);
  }
}

export const msg = new Message();
