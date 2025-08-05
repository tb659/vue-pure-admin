<script setup lang="ts">
/**
 * @Desc: 节点备注内容显示
 */
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "NodeNoteContentShow",
});

const noteContentViewer = ref(null);
const editor = ref(null);
const show = ref(false);
const left = ref(0);
const top = ref(0);
const node = ref(null);

onBeforeMount(() => {
  emitter.on("showNoteContent", onShowNoteContent);
  emitter.on("hideNoteContent", hideNoteContent);
  emitter.on("node_active", hideNoteContent);
  emitter.on("scale", onScale);
  emitter.on("svg_mousedown", hideNoteContent);

  document.body.addEventListener("click", hideNoteContent);
});
onBeforeUnmount(() => {
  emitter.off("showNoteContent", onShowNoteContent);
  emitter.off("hideNoteContent", hideNoteContent);
  emitter.off("node_active", hideNoteContent);
  emitter.off("scale", onScale);
  emitter.off("svg_mousedown", hideNoteContent);

  document.body.removeEventListener("click", hideNoteContent);
});
onMounted(() => initEditor());
/**
 * @Desc: 显示备注浮层
 */
function onShowNoteContent([content, left, top, node]) {
  node.value = node;
  // mitt只支持传入一个参数
  editor.value.setMarkdown(content);
  updateNoteContentPosition(left, top);
  show.value = true;
}
// 更新位置
function updateNoteContentPosition(_left, _top) {
  left.value = _left;
  top.value = _top;
}
// 画布缩放事件
function onScale() {
  if (!node.value || !show.value) return;
  const { left, top } = node.value.getNoteContentPosition();
  updateNoteContentPosition(left, top);
}
/**
 * @Desc: 隐藏备注浮层
 */
function hideNoteContent() {
  show.value = false;
}
/**
 * @Desc: 初始化编辑器
 */
function initEditor() {
  if (!editor.value) {
    editor.value = new Viewer({
      el: noteContentViewer.value,
    });
  }
}
</script>
<template>
  <div
    ref="noteContentViewer"
    class="noteContentViewer"
    :style="{
      left: left + 'px',
      top: top + 'px',
      visibility: show ? 'visible' : 'hidden',
    }"
    @click.stop
  />
</template>

<style lang="scss" scoped>
.noteContentViewer {
  position: fixed;
  max-height: 300px;
  padding: 10px;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 5px;

  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  &::-webkit-scrollbar-thumb {
    cursor: pointer;
    background-color: rgb(0 0 0 / 30%);
    border-radius: 7px;
  }

  &::-webkit-scrollbar-track {
    display: none;
    background: transparent;
    box-shadow: none;
  }
}
</style>
