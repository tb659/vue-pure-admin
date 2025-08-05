<script setup lang="ts">
// 大纲侧边栏编辑
import {
  nodeRichTextToTextWithWrap,
  textToNodeRichTextWithWrap,
  createUid,
  simpleDeepClone,
  htmlEscape,
  handleInputPasteText,
} from "simple-mind-map/src/utils";
import { storeData } from "@/api/xmind";
import { onBeforeMount, onBeforeUnmount, ref, computed, nextTick, watch } from "vue";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { $t, transformI18n } from "@/plugins/i18n";

defineOptions({
  name: "OutlineEdit",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const outlineEditContainer = ref(null);
const outlineEditBox = ref(null);
const tree = ref(null);
const data = ref([]);
const currentData = ref(null);
const defaultProps = ref({
  label: "label",
});
const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const isReadonly = computed(() => useXmindStoreHook().getIsReadonly);
const isOutlineEdit = computed(() => useXmindStoreHook().getIsOutlineEdit);

watch(
  () => isOutlineEdit.value,
  val => {
    if (val) {
      refresh();
      nextTick(() => {
        document.body.appendChild(outlineEditContainer.value);
      });
    }
  },
  { immediate: true },
);

onBeforeMount(() => {
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
});

// 刷新树数据
function refresh() {
  let xMindData = props.mindMap.getData();
  xMindData.root = true; // 标记根节点
  let walk = root => {
    let text = (root.data.richText ? nodeRichTextToTextWithWrap(root.data.text) : root.data.text).replaceAll(/\n/g, "<br>");
    text = htmlEscape(text);
    root.textCache = text; // 保存一份修改前的数据，用于对比是否修改了
    root.label = text;
    root.uid = root.data.uid;
    if (root.children && root.children.length > 0) {
      root.children.forEach(item => {
        walk(item);
      });
    }
  };
  walk(xMindData);
  data.value = [xMindData];
}
// 根节点不允许拖拽
function checkAllowDrag(node) {
  return !node.data.root;
}
// 拖拽结束事件
function onNodeDrop() {
  save();
}
// 当前选中的树节点变化事件
function onCurrentChange(data) {
  currentData.value = data;
}
// 失去焦点更新节点文本
function onBlur(e, node) {
  // 节点数据没有修改
  if (node.data.textCache === e.target.innerHTML) {
    return;
  }
  const richText = node.data.data.richText;
  const text = richText ? e.target.innerHTML : e.target.innerText;
  node.data.data.text = richText ? textToNodeRichTextWithWrap(text) : text;
  if (richText) node.data.data.resetRichText = true;
  node.data.textCache = e.target.innerHTML;
  save();
}
// 节点输入区域按键事件
function onNodeInputKeydown(e, node) {
  const richText = !!node.data.data.richText;
  const uid = createUid();
  const text = transformI18n($t("outline.nodeDefaultText"));
  const data = {
    textCache: text,
    uid,
    label: text,
    data: {
      text: richText ? textToNodeRichTextWithWrap(text) : text,
      uid,
      richText,
    },
    children: [],
  };
  if (richText) {
    data.data["resetRichText"] = true;
  }
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault();
    if (node.data.root) {
      return;
    }
    tree.value.insertAfter(data, node);
  }
  if (e.keyCode === 9) {
    e.preventDefault();
    tree.value.append(data, node);
  }
  save();
  nextTick(() => {
    tree.value.setCurrentKey(uid);
    const el: HTMLElement = document.querySelector(`.customNode[data-id="${uid}"] .nodeEdit`);
    if (el) {
      let selection = window.getSelection();
      let range = document.createRange();
      range.selectNodeContents(el);
      selection.removeAllRanges();
      selection.addRange(range);
      let offsetTop = el.offsetTop;
      window.scrollTo(0, offsetTop);
    }
  });
}
// 删除节点
function onKeyDown(e) {
  if (!isOutlineEdit.value) return;
  if ([46, 8].includes(e.keyCode) && currentData.value) {
    e.stopPropagation();
    tree.value.remove(currentData.value);
    currentData.value = null;
    save();
  }
}
// 拦截粘贴事件
function onPaste(e) {
  handleInputPasteText(e);
}
// 生成唯一的key
function getKey() {
  return Math.random();
}
// 关闭
function onClose() {
  useXmindStoreHook().setIsOutlineEdit(false);
}
// 滚动
function onScrollTo(y) {
  let container = outlineEditBox.value;
  let height = container.offsetHeight;
  let top = container.scrollTop;
  y += 50;
  if (y > top + height) {
    container.scrollTo(0, y - height / 2);
  }
}
// 获取思维导图数据
function getData() {
  let newNode = {};
  let node = data.value[0];
  let walk = (root, newRoot) => {
    newRoot.data = root.data;
    newRoot.children = [];
    (root.children || []).forEach(child => {
      const newChild = {};
      newRoot.children.push(newChild);
      walk(child, newChild);
    });
  };
  walk(node, newNode);
  return simpleDeepClone(newNode);
}
// 保存
function save() {
  storeData(getData());
}
</script>
<template>
  <div v-if="isOutlineEdit" ref="outlineEditContainer" class="outlineEditContainer" :class="{ isDark: isDark }">
    <div class="closeBtn" @click="onClose">
      <span class="icon iconfont iconguanbi" />
    </div>
    <div ref="outlineEditBox" class="outlineEditBox">
      <div class="outlineEdit">
        <el-tree
          ref="tree"
          class="outlineTree"
          node-key="uid"
          draggable
          default-expand-all
          :class="{ isDark: isDark }"
          :data="data"
          :props="defaultProps"
          :highlight-current="true"
          :expand-on-click-node="false"
          :allow-drag="checkAllowDrag"
          @node-drop="onNodeDrop"
          @current-change="onCurrentChange"
        >
          <template #default="{ node, data }">
            <span class="customNode" :data-id="data.uid">
              <span
                :key="getKey()"
                class="nodeEdit"
                :contenteditable="!isReadonly"
                @blur="onBlur($event, node)"
                @keydown.stop="onNodeInputKeydown($event, node)"
                @keyup.stop
                @paste="onPaste($event)"
                v-html="node.label"
              />
            </span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outlineEditContainer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;

  &.isDark {
    background-color: #262a2e;

    .closeBtn {
      .icon {
        color: #fff;
      }
    }
  }

  .closeBtn {
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;

    .icon {
      font-size: 28px;
    }
  }

  .outlineEditBox {
    width: 100%;
    height: 100%;
    padding: 50px 0;
    overflow-y: auto;

    .outlineEdit {
      width: 1000px;
      height: 100%;
      height: max-content;
      margin: 0 auto;

      :deep(.customNode) {
        .nodeEdit {
          max-width: 800px;
        }
      }
    }
  }
}

.customNode {
  width: 100%;
  font-weight: bold;
  color: rgb(0 0 0 / 85%);

  .nodeEdit {
    padding-right: 20px;
    white-space: normal;
    outline: none;
  }
}

.outlineTree {
  &.isDark {
    background-color: #262a2e;

    .customNode {
      color: #fff;
    }

    &.el-tree--highlight-current {
      :deep(.el-tree-node.is-current > .el-tree-node__content) {
        background-color: hsl(0deg 0% 100% / 5%) !important;
      }
    }

    :deep(.el-tree-node__content:hover),
    .el-upload-list__item:hover {
      background-color: hsl(0deg 0% 100% / 2%) !important;
    }

    :deep(.el-tree-node__content) {
      .el-tree-node__expand-icon {
        color: #fff;

        &.is-leaf {
          &::after {
            background-color: #fff;
          }
        }
      }
    }
  }

  :deep(.el-tree-node > .el-tree-node__children) {
    overflow: inherit;
  }

  :deep(.el-tree-node__content) {
    height: auto;
    margin: 5px 0;

    .el-tree-node__expand-icon {
      color: #262a2e;

      &.is-leaf {
        position: relative;
        color: transparent;

        &::after {
          position: absolute;
          top: 50%;
          left: 10px;
          width: 5px;
          height: 5px;
          content: "";
          background-color: #262a2e;
          border-radius: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
