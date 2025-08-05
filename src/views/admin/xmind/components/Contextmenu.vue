<script setup lang="ts">
/**
 * @Desc: 右键菜单
 */
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";
import { $t, transformI18n } from "@/plugins/i18n";

defineOptions({
  name: "Contextmenu",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const isShow = ref(false);
const left = ref(0);
const top = ref(0);
const node = ref(null);
const type = ref("");
const isMousedown = ref(false);
const mosuedownX = ref(0);
const mosuedownY = ref(0);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const isZenMode = computed(() => useXmindStoreHook().getLocalConfig.isZenMode);

const expandList = computed(() => {
  return [
    transformI18n($t("contextmenu.level1")),
    transformI18n($t("contextmenu.level2")),
    transformI18n($t("contextmenu.level3")),
    transformI18n($t("contextmenu.level4")),
    transformI18n($t("contextmenu.level5")),
    transformI18n($t("contextmenu.level6")),
  ];
});

const insertNodeBtnDisabled = computed(() => {
  return !node.value || node.value.isRoot || node.value.isGeneralization;
});

const upNodeBtnDisabled = computed(() => {
  if (!node.value || node.value.isRoot || node.value.isGeneralization) {
    return true;
  }
  let isFirst =
    node.value.parent.children.findIndex(item => {
      return item === node.value;
    }) === 0;
  return isFirst;
});
const downNodeBtnDisabled = computed(() => {
  if (!node.value || node.value.isRoot || node.value.isGeneralization) {
    return true;
  }
  let children = node.value.parent.children;
  let isLast =
    children.findIndex(item => {
      return item === node.value;
    }) ===
    children.length - 1;
  return isLast;
});
const isGeneralization = computed(() => {
  return node.value.isGeneralization;
});
const hasHyperlink = computed(() => {
  return !!node.value.getData("hyperlink");
});
const hasNote = computed(() => {
  return !!node.value.getData("note");
});
/**
 * @Desc: 节点右键显示
 */
// mitt只能传一个参数
function show(data) {
  type.value = "node";
  left.value = data.e.clientX + 10;
  top.value = data.e.clientY + 10;
  isShow.value = true;
  node.value = data.node;
}

/**
 * @Desc: 鼠标按下事件
 */
function onMousedown(e) {
  if (e.which !== 3) {
    return;
  }
  mosuedownX.value = e.clientX;
  mosuedownY.value = e.clientY;
  isMousedown.value = true;
}

/**
 * @Desc: 鼠标松开事件
 */
function onMouseup(e) {
  if (!isMousedown.value) {
    return;
  }
  isMousedown.value = false;
  if (Math.abs(mosuedownX.value - e.clientX) > 3 || Math.abs(mosuedownY.value - e.clientY) > 3) {
    hide();
    return;
  }
  show2(e);
}

/**
 * @Desc: 画布右键显示
 */
function show2(e) {
  type.value = "svg";
  left.value = e.clientX + 10;
  top.value = e.clientY + 10;
  isShow.value = true;
}

/**
 * @Desc: 隐藏
 */
function hide() {
  isShow.value = false;
  left.value = 0;
  top.value = 0;
  type.value = "";
}

/**
 * @Desc: 执行命令
 */
function exec(key, disabled = false, ...args) {
  if (disabled) {
    return;
  }
  switch (key) {
    case "COPY_NODE":
      props.mindMap.renderer.copy();
      break;
    case "CUT_NODE":
      props.mindMap.renderer.cut();
      break;
    case "PASTE_NODE":
      props.mindMap.renderer.paste();
      break;
    case "RETURN_CENTER":
      props.mindMap.renderer.setRootNodeCenter();
      break;
    case "TOGGLE_ZEN_MODE":
      useXmindStoreHook().setLocalConfig({
        isZenMode: !isZenMode.value,
      });
      break;
    case "FIT_CANVAS":
      props.mindMap.view.fit();
      break;
    case "REMOVE_HYPERLINK":
      node.value.setHyperlink("", "");
      break;
    case "REMOVE_NOTE":
      node.value.setNote("");
      break;
    default:
      emitter.emit("execCommand", [key, ...args]);
      break;
  }
  hide();
}

onMounted(() => {
  emitter.on("node_contextmenu", show);
  emitter.on("node_click", hide);
  emitter.on("draw_click", hide);
  emitter.on("expand_btn_click", hide);
  emitter.on("svg_mousedown", onMousedown);
  emitter.on("mouseup", onMouseup);
});
onBeforeUnmount(() => {
  emitter.off("node_contextmenu", show);
  emitter.off("node_click", hide);
  emitter.off("draw_click", hide);
  emitter.off("expand_btn_click", hide);
  emitter.off("svg_mousedown", onMousedown);
  emitter.off("mouseup", onMouseup);
});
</script>

<template>
  <div
    v-if="isShow"
    class="contextmenuContainer listBox"
    :style="{ left: left + 'px', top: top + 'px' }"
    :class="{ isDark: isDark }"
  >
    <template v-if="type === 'node'">
      <div class="item" :class="{ disabled: insertNodeBtnDisabled }" @click="exec('INSERT_NODE', insertNodeBtnDisabled)">
        <span class="name">{{ transformI18n($t("contextmenu.insertSiblingNode")) }}</span>
        <span class="desc">Enter</span>
      </div>
      <div class="item" :class="{ disabled: isGeneralization }" @click="exec('INSERT_CHILD_NODE')">
        <span class="name">{{ transformI18n($t("contextmenu.insertChildNode")) }}</span>
        <span class="desc">Tab</span>
      </div>
      <div class="item" :class="{ disabled: insertNodeBtnDisabled }" @click="exec('INSERT_PARENT_NODE')">
        <span class="name">{{ transformI18n($t("contextmenu.insertParentNode")) }}</span>
        <span class="desc">Shift + Tab</span>
      </div>
      <div class="item" :class="{ disabled: insertNodeBtnDisabled }" @click="exec('ADD_GENERALIZATION')">
        <span class="name">{{ transformI18n($t("contextmenu.insertSummary")) }}</span>
        <span class="desc">Ctrl + G</span>
      </div>
      <div class="item" :class="{ disabled: upNodeBtnDisabled }" @click="exec('UP_NODE')">
        <span class="name">{{ transformI18n($t("contextmenu.moveUpNode")) }}</span>
        <span class="desc">Ctrl + ↑</span>
      </div>
      <div class="item" :class="{ disabled: downNodeBtnDisabled }" @click="exec('DOWN_NODE')">
        <span class="name">{{ transformI18n($t("contextmenu.moveDownNode")) }}</span>
        <span class="desc">Ctrl + ↓</span>
      </div>
      <div class="item danger" @click="exec('REMOVE_NODE')">
        <span class="name">{{ transformI18n($t("contextmenu.deleteNode")) }}</span>
        <span class="desc">Delete</span>
      </div>
      <div class="item danger" @click="exec('REMOVE_CURRENT_NODE')">
        <span class="name">{{ transformI18n($t("contextmenu.deleteCurrentNode")) }}</span>
        <span class="desc">Shift + Backspace</span>
      </div>
      <div class="item" :class="{ disabled: isGeneralization }" @click="exec('COPY_NODE')">
        <span class="name">{{ transformI18n($t("contextmenu.copyNode")) }}</span>
        <span class="desc">Ctrl + C</span>
      </div>
      <div class="item" :class="{ disabled: isGeneralization }" @click="exec('CUT_NODE')">
        <span class="name">{{ transformI18n($t("contextmenu.cutNode")) }}</span>
        <span class="desc">Ctrl + X</span>
      </div>
      <div class="item" @click="exec('PASTE_NODE')">
        <span class="name">{{ transformI18n($t("contextmenu.pasteNode")) }}</span>
        <span class="desc">Ctrl + V</span>
      </div>
      <div v-if="hasHyperlink" class="item" @click="exec('REMOVE_HYPERLINK')">
        <span class="name">{{ transformI18n($t("contextmenu.removeHyperlink")) }}</span>
      </div>
      <div v-if="hasNote" class="item" @click="exec('REMOVE_NOTE')">
        <span class="name">{{ transformI18n($t("contextmenu.removeNote")) }}</span>
      </div>
    </template>
    <template v-if="type === 'svg'">
      <div class="item" @click="exec('RETURN_CENTER')">
        <span class="name">{{ transformI18n($t("contextmenu.backCenter")) }}</span>
        <span class="desc">Ctrl + Enter</span>
      </div>
      <div class="item" @click="exec('EXPAND_ALL')">
        <span class="name">{{ transformI18n($t("contextmenu.expandAll")) }}</span>
      </div>
      <div class="item" @click="exec('UNEXPAND_ALL')">
        <span class="name">{{ transformI18n($t("contextmenu.unExpandAll")) }}</span>
      </div>
      <div class="item">
        <span class="name">{{ transformI18n($t("contextmenu.expandTo")) }}</span>
        <div class="subItems listBox" :class="{ isDark: isDark }">
          <div v-for="(item, index) in expandList" :key="item" class="item" @click="exec('UNEXPAND_TO_LEVEL', false, index + 1)">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="item" @click="exec('RESET_LAYOUT')">
        <span class="name">{{ transformI18n($t("contextmenu.arrangeLayout")) }}</span>
        <span class="desc">Ctrl + L</span>
      </div>
      <div class="item" @click="exec('FIT_CANVAS')">
        <span class="name">{{ transformI18n($t("contextmenu.fitCanvas")) }}</span>
        <span class="desc">Ctrl + i</span>
      </div>
      <div class="item" @click="exec('TOGGLE_ZEN_MODE')">
        <span class="name">{{ transformI18n($t("contextmenu.zenMode")) }}</span>
        {{ isZenMode ? "√" : "" }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.listBox {
  width: 260px;
  padding-top: 16px;
  padding-bottom: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 hsl(0deg 0% 69% / 50%);

  &.isDark {
    background: #363b3f;
  }
}

.contextmenuContainer {
  position: fixed;
  font-family: PingFangSC-Regular, "PingFang SC", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;

  &.isDark {
    color: #fff;

    .item {
      &:hover {
        background: hsl(0deg 0% 100% / 5%);
      }
    }
  }

  .item {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 28px;
    padding: 0 16px;
    line-height: 28px;
    cursor: pointer;

    &.danger {
      color: #f56c6c;
    }

    &:hover {
      background: #f5f5f5;

      .subItems {
        visibility: visible;
      }
    }

    &.disabled {
      color: grey;
      pointer-events: none;
      cursor: not-allowed;

      &:hover {
        background: #fff;
      }
    }

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .desc {
      overflow: hidden;
      text-overflow: ellipsis;
      color: #999;
      white-space: nowrap;
    }

    .subItems {
      position: absolute;
      top: 0;
      left: 100%;
      visibility: hidden;
    }
  }
}
</style>
