import { msg } from "@/utils/message";
import { useEventListener } from "@vueuse/core";
import { copyTextToClipboard } from "@pureadmin/utils";
import type { Directive, DirectiveBinding } from "vue";

interface CopyEl extends HTMLElement {
  copyValue: string;
}

/** 文本复制指令（默认双击复制） */
export const copy: Directive = {
  mounted(el: CopyEl, binding: DirectiveBinding) {
    const { value } = binding;
    if (value) {
      el.copyValue = value;
      const arg = binding.arg ?? "dblclick";
      // Register using addEventListener on mounted, and removeEventListener automatically on unmounted
      useEventListener(el, arg, () => {
        const success = copyTextToClipboard(el.copyValue);
        success ? msg.success("复制成功") : msg.error("复制失败");
      });
    } else {
      throw new Error('[Directive: copy]: need value! Like v-copy="modelValue"');
    }
  },
  updated(el: CopyEl, binding: DirectiveBinding) {
    el.copyValue = binding.value;
  }
};
