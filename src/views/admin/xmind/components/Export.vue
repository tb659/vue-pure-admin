<script setup lang="ts">
/**
 * @Desc: 导出功能
 */
import { onMounted, ref, computed, onBeforeMount } from "vue";
import { ElNotification } from "element-plus";
import { downTypeList } from "../config";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { useI18n } from "vue-i18n";
import { emitter } from "@/utils/mitt";
import { $t, transformI18n } from "@/plugins/i18n";

defineOptions({
  name: "Export",
});

const { locale } = useI18n();
const dialogVisible = ref(false);
const exportType = ref("smm");
const fileName = ref("思维导图");
const widthConfig = ref(true);
const isTransparent = ref(false);
const loading = ref(false);
const loadingText = ref("");
const paddingX = ref(10);
const paddingY = ref(10);

const openNodeRichText = computed(() => useXmindStoreHook().getLocalConfig.openNodeRichText);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const downTypeList2 = computed(() => downTypeList[locale] || downTypeList.zh);

onMounted(() => {
  emitter.on("showExport", handleShowExport);
});

onBeforeMount(() => {
  emitter.off("showExport", handleShowExport);
});

const handleShowExport = () => {
  dialogVisible.value = true;
};

const onPaddingChange = () => {
  emitter.emit("paddingChange", {
    exportPaddingX: Number(paddingX.value),
    exportPaddingY: Number(paddingY.value),
  });
};

/**
 * @Desc: 取消导出
 */
const cancel = () => {
  dialogVisible.value = false;
};

/**
 * @Desc:  确定导出
 */
const confirm = () => {
  // @ts-ignore
  emitter.emit("exportData", [exportType.value, true, fileName.value, widthConfig.value]); // mitt只支持传入一个参数
  if (exportType.value === "svg") {
    const style = `* {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }`;
    // @ts-ignore
    emitter.emit("exportData", exportType.value, true, fileName.value, style);
  } else if (["smm", "json"].includes(exportType.value)) {
    // @ts-ignore
    emitter.emit("exportData", exportType.value, true, fileName.value, widthConfig.value);
  } else if (exportType.value === "png") {
    // @ts-ignore
    emitter.emit("exportData", exportType.value, true, fileName.value, isTransparent.value);
  } else if (exportType.value === "pdf") {
    // @ts-ignore
    emitter.emit("exportData", exportType.value, true, fileName.value, isTransparent.value);
  } else {
    // @ts-ignore
    emitter.emit("exportData", exportType.value, true, fileName.value);
  }
  cancel();
  ElNotification({
    title: transformI18n($t("export.notifyTitle")),
    message: transformI18n($t("export.notifyMessage")),
    type: "warning",
  });
};
</script>

<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      v-loading.fullscreen.lock="loading"
      body-class="nodeExportDialog"
      :title="transformI18n($t('export.title'))"
      width="700px"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="exportContainer" :class="{ isDark: isDark }">
        <div class="nameInputBox">
          <span class="name">{{ transformI18n($t("export.filename")) }}</span>
          <el-input v-model="fileName" style="width: 300px" size="small" @keydown.stop />
          <el-checkbox v-show="['smm', 'json'].includes(exportType)" v-model="widthConfig" style="margin-left: 12px">
            {{ transformI18n($t("export.include")) }}
          </el-checkbox>
        </div>
        <div v-show="['svg', 'png', 'pdf'].includes(exportType)" class="paddingInputBox">
          <span class="name">{{ transformI18n($t("export.paddingX")) }}</span>
          <el-input v-model="paddingX" style="width: 100px" size="small" @change="onPaddingChange" @keydown.stop />
          <span class="name" style="margin-left: 10px">{{ transformI18n($t("export.paddingY")) }}</span>
          <el-input v-model="paddingY" style="width: 100px" size="small" @change="onPaddingChange" @keydown.stop />
          <el-checkbox v-show="['png', 'pdf'].includes(exportType)" v-model="isTransparent" style="margin-left: 12px">{{
            transformI18n($t("export.isTransparent"))
          }}</el-checkbox>
        </div>
        <div class="downloadTypeList">
          <div
            v-for="item in downTypeList2"
            :key="item.type"
            class="downloadTypeItem"
            :class="{ active: exportType === item.type }"
            @click="exportType = item.type"
          >
            <div class="icon iconfont" :class="[item.icon, item.type]" />
            <div class="info">
              <div class="name">{{ item.name }}</div>
              <div class="desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
        <div class="tip">{{ transformI18n($t("export.tips")) }}</div>
        <!-- <div class="tip warning" v-if="openNodeRichText && exportType === 'svg' && domToImage">{{ transformI18n($t('export.svgTips')) }}</div> -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">{{ transformI18n($t("dialog.cancel")) }}</el-button>
          <el-button type="primary" @click="confirm">{{ transformI18n($t("dialog.confirm")) }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.exportContainer {
  &.isDark {
    .downloadTypeList {
      .downloadTypeItem {
        background-color: #363b3f;

        .info {
          .name {
            color: hsl(0deg 0% 100% / 90%);
          }
        }
      }
    }
  }
}

.el-dialog__body {
  &.nodeExportDialog {
    padding: 0 -20px;
    background-color: #f2f4f7 !important;
  }

  .nameInputBox {
    margin-bottom: 20px;

    .name {
      margin-right: 10px;
    }
  }

  .paddingInputBox {
    margin-bottom: 10px;

    .name {
      margin-right: 10px;
    }
  }

  .tip {
    margin-top: 10px;

    &.warning {
      color: #f56c6c;
    }
  }

  .downloadTypeList {
    display: flex;
    flex-wrap: wrap;

    .downloadTypeItem {
      display: flex;
      align-items: center;
      width: 200px;
      height: 88px;
      padding: 22px;
      margin: 10px;
      overflow: hidden;
      cursor: pointer;
      background-color: #fff;
      border: 2px solid transparent;
      border-radius: 11px;
      box-shadow: 0 0 20px 0 rgb(0 0 0 / 2%);

      &.active {
        border-color: #409eff;
      }

      .icon {
        margin-right: 10px;
        font-size: 30px;

        &.png {
          color: #ffc038;
        }

        &.pdf {
          color: #ff6c4d;
        }

        &.md {
          color: #2b2b2b;
        }

        &.json {
          color: #12c87e;
        }

        &.svg {
          color: #4380ff;
        }

        &.smm {
          color: #409eff;
        }
      }

      .info {
        .name {
          margin-bottom: 5px;
          font-size: 15px;
          color: #1a1a1a;
        }

        .desc {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-dialog__body {
  padding: 30px 20px;
  margin: 0 -16px;
  background-color: #f2f4f7 !important;
}
</style>
