import DOMPurify from "dompurify";
import type { Directive, DirectiveBinding } from "vue";

export const safeHtml: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | Node>) {
    el.innerHTML = DOMPurify.sanitize(binding.value);
  },
  updated(el, binding) {
    el.innerHTML = DOMPurify.sanitize(binding.value);
  },
};
