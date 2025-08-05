<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch, computed } from "vue";
import Sidebar from "./Sidebar.vue";
import { emitter } from "@/utils/mitt";
import { formulaList } from "../config/constant";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { msg } from "@/utils/msg";
import { $t, transformI18n } from "@/plugins/i18n";
// import 'simple-mind-map/node_modules/katex/dist/katex.min.css'

defineOptions({
  name: "FormulaSidebar",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const sidebar = ref(null);
const formulaText = ref("");
const list = ref([]);
const activeNodes = ref([]);

const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const localConfig = computed(() => useXmindStoreHook().getLocalConfig);

watch(
  () => activeSidebar.value,
  val => {
    if (!sidebar.value) return;
    sidebar.value.show = val === "formulaSidebar";
  },
  { immediate: true },
);
function init() {
  list.value = formulaList.map(item => {
    return {
      overview: window["katex"].renderToString(item, props.mindMap.formula.getKatexConfig()),
      text: item,
    };
  });
}
function handleNodeActive(args) {
  activeNodes.value = [...args[1]];
  if (activeNodes.value.length <= 0 && activeSidebar.value === "formulaSidebar") {
    useXmindStoreHook().setActiveSidebar(null);
  }
}
function confirm() {
  if (!localConfig.value.openNodeRichText) {
    return msg.warning(transformI18n($t("formulaSidebar.tip")));
  }
  let str = formulaText.value.trim();
  if (!str) return;
  props.mindMap.execCommand("INSERT_FORMULA", str);
}

onBeforeMount(() => {
  emitter.on("node_active", handleNodeActive);
});
onBeforeUnmount(() => {
  emitter.off("node_active", handleNodeActive);
});
onMounted(() => init());
</script>
<template>
  <Sidebar ref="sidebar" :title="transformI18n($t('formulaSidebar.title'))">
    <div class="box" :class="{ isDark: isDark }">
      <div class="formulaInputBox">
        <el-input
          v-model="formulaText"
          :rows="4"
          resize="none"
          type="textarea"
          :placeholder="transformI18n($t('formulaSidebar.placeholder'))"
          @keydown.stop
        />
        <el-button size="small" style="width: 100%; margin-top: 20px" @click="confirm">{{
          transformI18n($t("formulaSidebar.confirm"))
        }}</el-button>
      </div>
      <div class="title">{{ transformI18n($t("formulaSidebar.common")) }}</div>
      <div class="formulaList">
        <div v-for="(item, index) in list" :key="index" class="formulaItem">
          <div class="overview" v-html="item.overview" />
          <div class="text" @click="formulaText = item.text">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>
<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: hidden;

  &.isDark {
    .title {
      color: #fff;
    }

    .formulaList {
      .formulaItem {
        .overview,
        .text {
          color: #fff;
        }

        .text {
          background-color: #363b3f;
        }
      }
    }

    :deep(.el-textarea__inner) {
      color: #fff;
      background-color: transparent;
    }
  }

  .title {
    flex-shrink: 0;
    margin: 10px 0;
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .formulaInputBox {
    flex-shrink: 0;
  }

  .formulaList {
    height: 100%;
    overflow-y: auto;

    .formulaItem {
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      border: 1px solid #dcdfe6;
      border-bottom: none;

      &:last-of-type {
        border-bottom: 1px solid #dcdfe6;
      }

      .overview,
      .text {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 50%;
        overflow: hidden;
      }

      .overview {
        padding: 10px 0;
        border-right: none;
      }

      .text {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        white-space: nowrap;
        cursor: pointer;
        background-color: #fafafa;
        border-left: 1px solid #dcdfe6;
      }
    }
  }
}
</style>
