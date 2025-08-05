<script setup lang="ts">
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";
import { computed, onBeforeMount, onBeforeUnmount, ref } from "vue";

defineOptions({
  name: "ToolbarNodeBtnList",
});

const props = defineProps({
  dir: {
    type: String,
    default: "h", // h（水平排列）、v（垂直排列）
  },
  list: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
const activeNodes = ref([]);
const backEnd = ref(false);
const forwardEnd = ref(false);
const readonly = ref(false);
const isFullDataFile = ref(false);
const isInPainter = ref(false);
const timer = ref(null);

const isDark = computed(() => useXmindStoreHook().getIsDark);

const hasRoot = computed(() => {
  return (
    activeNodes.value.findIndex(node => {
      return node.isRoot;
    }) !== -1
  );
});

const hasGeneralization = computed(() => {
  return (
    activeNodes.value.findIndex(node => {
      return node.isGeneralization;
    }) !== -1
  );
});

// 监听模式切换
function onModeChange(mode) {
  readonly.value = mode === "readonly";
}

// 监听节点激活
function onNodeActive(args) {
  activeNodes.value = [...args[1]];
}

// 监听前进后退
function onBackForward(index: number, len: number) {
  backEnd.value = index <= 0;
  forwardEnd.value = index >= len - 1;
}

// 开始格式刷
function onPainterStart() {
  isInPainter.value = true;
}

// 格式刷结束
function onPainterEnd() {
  isInPainter.value = false;
}

// 显示节点图标侧边栏
function showNodeIcon() {
  emitter.emit("close_node_icon_toolbar");
  useXmindStoreHook().setActiveSidebar("nodeIconSidebar");
}

// 打开公式侧边栏
function showFormula() {
  useXmindStoreHook().setActiveSidebar("formulaSidebar");
}

const emit = (...args) => emitter.emit.apply(emitter, args);

onBeforeMount(() => {
  emitter.on("mode_change", onModeChange);
  emitter.on("node_active", onNodeActive);
  // @ts-ignore
  emitter.on("back_forward", onBackForward);
  emitter.on("painter_start", onPainterStart);
  emitter.on("painter_end", onPainterEnd);
});

onBeforeUnmount(() => {
  emitter.off("mode_change", onModeChange);
  emitter.off("node_active", onNodeActive);
  // @ts-ignore
  emitter.off("back_forward", onBackForward);
  emitter.off("painter_start", onPainterStart);
  emitter.off("painter_end", onPainterEnd);
});
</script>

<template>
  <div class="toolbarNodeBtnList" :class="[dir, { isDark: isDark }]">
    <template v-for="item in list" :key="item">
      <div
        v-if="item === 'back'"
        class="toolbarBtn"
        :class="{ disabled: readonly || backEnd }"
        @click="emit('execCommand', 'BACK')"
      >
        <span class="icon iconfont iconhoutui-shi" />
        <span class="text">{{ $t("toolbar.undo") }}</span>
      </div>
      <div
        v-if="item === 'forward'"
        class="toolbarBtn"
        :class="{ disabled: readonly || forwardEnd }"
        @click="emit('execCommand', 'FORWARD')"
      >
        <span class="icon iconfont iconqianjin1" />
        <span class="text">{{ $t("toolbar.redo") }}</span>
      </div>
      <div
        v-if="item === 'painter'"
        class="toolbarBtn"
        :class="{ disabled: activeNodes.length <= 0 || hasGeneralization, active: isInPainter }"
        @click="emit('startPainter')"
      >
        <span class="icon iconfont iconjiedian" />
        <span class="text">{{ $t("toolbar.painter") }}</span>
      </div>
      <div
        v-if="item === 'siblingNode'"
        class="toolbarBtn"
        :class="{ disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization }"
        @click="emit('execCommand', 'INSERT_NODE')"
      >
        <span class="icon iconfont iconjiedian" />
        <span class="text">{{ $t("toolbar.insertSiblingNode") }}</span>
      </div>
      <div
        v-if="item === 'childNode'"
        class="toolbarBtn"
        :class="{ disabled: activeNodes.length <= 0 || hasGeneralization }"
        @click="emit('execCommand', 'INSERT_CHILD_NODE')"
      >
        <span class="icon iconfont icontianjiazijiedian" />
        <span class="text">{{ $t("toolbar.insertChildNode") }}</span>
      </div>
      <div
        v-if="item === 'deleteNode'"
        class="toolbarBtn"
        :class="{ disabled: activeNodes.length <= 0 }"
        @click="emit('execCommand', 'REMOVE_NODE')"
      >
        <span class="icon iconfont iconshanchu" />
        <span class="text">{{ $t("toolbar.deleteNode") }}</span>
      </div>
      <div
        v-if="item === 'image'"
        class="toolbarBtn"
        :class="{ disabled: activeNodes.length <= 0 }"
        @click="emit('showNodeImage')"
      >
        <span class="icon iconfont iconimage" />
        <span class="text">{{ $t("toolbar.image") }}</span>
      </div>
      <div v-if="item === 'icon'" class="toolbarBtn" :class="{ disabled: activeNodes.length <= 0 }" @click="showNodeIcon">
        <span class="icon iconfont iconxiaolian" />
        <span class="text">{{ $t("toolbar.icon") }}</span>
      </div>
      <div v-if="item === 'link'" class="toolbarBtn" :class="{ disabled: activeNodes.length <= 0 }" @click="emit('showNodeLink')">
        <span class="icon iconfont iconchaolianjie" />
        <span class="text">{{ $t("toolbar.link") }}</span>
      </div>
      <div v-if="item === 'note'" class="toolbarBtn" :class="{ disabled: activeNodes.length <= 0 }" @click="emit('showNodeNote')">
        <span class="icon iconfont iconflow-Mark" />
        <span class="text">{{ $t("toolbar.note") }}</span>
      </div>
      <div v-if="item === 'tag'" class="toolbarBtn" :class="{ disabled: activeNodes.length <= 0 }" @click="emit('showNodeTag')">
        <span class="icon iconfont iconbiaoqian" />
        <span class="text">{{ $t("toolbar.tag") }}</span>
      </div>
      <div
        v-if="item === 'summary'"
        class="toolbarBtn"
        :class="{ disabled: activeNodes.length <= 0 || hasRoot || hasGeneralization }"
        @click="emit('execCommand', 'ADD_GENERALIZATION')"
      >
        <span class="icon iconfont icongaikuozonglan" />
        <span class="text">{{ $t("toolbar.summary") }}</span>
      </div>
      <div
        v-if="item === 'associativeLine'"
        class="toolbarBtn"
        :class="{ disabled: activeNodes.length <= 0 || hasGeneralization }"
        @click="emit('createAssociativeLine')"
      >
        <span class="icon iconfont iconlianjiexian" />
        <span class="text">{{ $t("toolbar.associativeLine") }}</span>
      </div>
      <div
        v-if="item === 'formula'"
        class="toolbarBtn"
        :class="{ disabled: activeNodes.length <= 0 || hasGeneralization }"
        @click="showFormula"
      >
        <span class="icon iconfont icongongshi" />
        <span class="text">{{ $t("toolbar.formula") }}</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.toolbarNodeBtnList {
  display: flex;

  &.isDark {
    .toolbarBtn {
      color: hsl(0deg 0% 100% / 90%);

      .icon {
        background: transparent;
        border-color: transparent;
      }

      &:hover {
        &:not(.disabled) {
          .icon {
            background: hsl(0deg 0% 100% / 5%);
          }
        }
      }

      &.disabled {
        color: #54595f;
      }
    }
  }

  .toolbarBtn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 20px;
    cursor: pointer;

    &:last-of-type {
      margin-right: 0;
    }

    &:hover {
      &:not(.disabled) {
        .icon {
          background: #f5f5f5;
        }
      }
    }

    &.active {
      .icon {
        background: #f5f5f5;
      }
    }

    &.disabled {
      color: #bcbcbc;
      pointer-events: none;
      cursor: not-allowed;
    }

    .icon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 26px;
      padding: 0 5px;
      text-align: center;
      background: #fff;
      border: 1px solid #e9e9e9;
      border-radius: 4px;
    }

    .text {
      margin-top: 3px;
    }
  }

  &.v {
    display: block;
    flex-wrap: wrap;
    width: 120px;

    .toolbarBtn {
      flex-direction: row;
      justify-content: flex-start;
      width: 100%;
      margin-right: 0;
      margin-bottom: 10px;

      &:last-of-type {
        margin-bottom: 0;
      }

      .icon {
        margin-right: 10px;
      }

      .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
