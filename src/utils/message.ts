import { type VNode } from "vue";
import { isFunction } from "@pureadmin/utils";
import { type MessageHandler, ElMessage, ElMessageBox } from "element-plus";

type messageStyle = "el" | "antd";
type messageTypes = "info" | "success" | "warning" | "error";

interface MessageParams {
  /** 消息类型，可选 `info` 、`success` 、`warning` 、`error` ，默认 `info` */
  type?: messageTypes;
  infoType?: messageTypes;
  /** 自定义图标，该属性会覆盖 `type` 的图标 */
  icon?: any;
  /** 是否将 `message` 属性作为 `HTML` 片段处理，默认 `false` */
  dangerouslyUseHTMLString?: boolean;
  /** 消息风格，可选 `el` 、`antd` ，默认 `antd` */
  customClass?: messageStyle;
  /** 显示时间，单位为毫秒。设为 `0` 则不会自动关闭，`element-plus` 默认是 `3000` ，平台改成默认 `2000` */
  duration?: number;
  /** 是否显示关闭按钮，默认值 `false` */
  showClose?: boolean;
  /** 文字是否居中，默认值 `false` */
  center?: boolean;
  /** `Message` 距离窗口顶部的偏移量，默认 `20` */
  offset?: number;
  /** 设置组件的根元素，默认 `document.body` */
  appendTo?: string | HTMLElement;
  /** 合并内容相同的消息，不支持 `VNode` 类型的消息，默认值 `false` */
  grouping?: boolean;
  /** 关闭时的回调函数, 参数为被关闭的 `message` 实例 */
  onClose?: Function | null;
  /** 确定的文本 */
  confirmText?: string;
  /** 取消的文本 */
  cancelText?: string;
  /** 回调事件 */
  callback?: Function | null;
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
        customClass: "pure-message"
      });
    } else {
      const {
        icon,
        type = "info",
        dangerouslyUseHTMLString = false,
        customClass = "antd",
        duration = 2000,
        showClose = false,
        center = false,
        offset = 20,
        appendTo = document.body,
        grouping = false,
        onClose
      } = params;

      return ElMessage({
        message,
        type,
        icon,
        dangerouslyUseHTMLString,
        duration,
        showClose,
        center,
        offset,
        appendTo,
        grouping,
        // 全局搜 pure-message 即可知道该类的样式位置
        customClass: customClass === "antd" ? "pure-message" : "",
        onClose: () => (isFunction(onClose) ? onClose() : null)
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

  box(boxType: string, info: string, title: string, params?: MessageParams) {
    const { infoType = "warning", cancelText = "取消", confirmText = "确定", callback = () => {} } = params;

    return ElMessageBox[boxType](info || "消息提示", title || "系统提示", {
      type: infoType,
      cancelButtonText: cancelText,
      cancelButtonClass: `${boxType}-cancel-button-class`,
      confirmButtonText: confirmText,
      confirmButtonClass: `${boxType}-confirm-button-class`,
      dangerouslyUseHTMLString: true
    })
      .then(async () => {
        await callback();
      })
      .catch(() => {});
  }

  alert(info: string, title: string, params?: MessageParams) {
    this.box("alert", info, title, params);
  }

  confirm(info: string, title: string, params?: MessageParams) {
    this.box("confirm", info, title, params);
  }

  prompt(info: string, title: string, params?: MessageParams) {
    this.box("prompt", info, title, params);
  }
}

export const msg = new Message();
