<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
// 节点图片
import NodeImage from "./NodeImage.vue";
// 节点图片预览
import NodeImgPreview from "./NodeImgPreview.vue";
// 节点图标
import NodeIcon from "./NodeIcon.vue";
// 节点超链接
import NodeHyperlink from "./NodeHyperlink.vue";
// 节点备注
import NodeNote from "./NodeNote.vue";
import NodeNoteContentShow from "./NodeNoteContentShow.vue";
// 节点标签
import NodeTag from "./NodeTag.vue";
// 公式
import FormulaSidebar from "./FormulaSidebar.vue";
// xmind 导入
import Import from "./Import.vue";
// xmind 导出
import Export from "./Export.vue";
import { ElNotification } from "element-plus";
import exampleData from "simple-mind-map/example/exampleData";
import ToolbarNodeBtnList from "./ToolbarNodeBtnList.vue";
import { throttle } from "simple-mind-map/src/utils/index";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { msg } from "@/utils/msg";
import { $t, transformI18n } from "@/plugins/i18n";
import { emitter } from "@/utils/mitt";
import { getData } from "@/api/xmind";
import { hideLoading, showLoading } from "@/utils/loading";

defineOptions({
  name: "Toolbar",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

/**
 * @Desc: 工具栏
 */
let fileHandle = null;
const timer = ref(null);
const isInPainter = ref(false);
const isFullDataFile = ref(false);
const toolbarRef = ref<HTMLElement>();

const list = ref([
  "back",
  "forward",
  "painter",
  "siblingNode",
  "childNode",
  "deleteNode",
  "image",
  "icon",
  "link",
  "note",
  "tag",
  "summary",
  "associativeLine",
  "formula",
]);
const horizontalList = ref<string[]>([]);
const verticalList = ref<string[]>([]);
const showMoreBtn = ref(true);
const popoverShow = ref(false);

const isHandleLocalFile = computed(() => useXmindStoreHook().getIsHandleLocalFile);
const isDark = computed(() => useXmindStoreHook().getIsDark);

// 监听 isHandleLocalFile 变化
watch(
  () => useXmindStoreHook().getIsHandleLocalFile,
  val => {
    if (!val) {
      ElNotification.closeAll();
    }
  },
);

// 计算工具按钮如何显示
const computeToolbarShow = () => {
  const windowWidth = window.innerWidth - 40;
  const all = [...list.value];
  let index = 1;
  const loopCheck = () => {
    if (index > all.length) return done();
    horizontalList.value = all.slice(0, index);
    nextTick(() => {
      const width = toolbarRef.value?.getBoundingClientRect().width || 0;
      if (width < windowWidth) {
        index++;
        loopCheck();
      } else if (index > 0 && width > windowWidth) {
        index--;
        horizontalList.value = all.slice(0, index);
        done();
      }
    });
  };
  const done = () => {
    verticalList.value = all.slice(index);
    showMoreBtn.value = verticalList.value.length > 0;
  };
  loopCheck();
};

const computeToolbarShowThrottle = throttle(computeToolbarShow, 300);

/**
 * @Desc: 监听本地文件读写
 */
const onWriteLocalFile = content => {
  clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    writeLocalFile(content);
  }, 1000);
};

/**
 * @Desc: 打开本地文件
 */
const openLocalFile = async () => {
  try {
    if ("showOpenFilePicker" in window) {
      let [_fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: "",
            accept: {
              "application/json": [".smm"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });
      if (!_fileHandle) {
        return;
      }
      fileHandle = _fileHandle;
      if (_fileHandle.kind === "directory") {
        msg.warning(transformI18n($t("toolbar.selectFileTip")));
        return;
      }
      await readFile();
    }
  } catch (error) {
    console.log("error", error);
    if (error.toString().includes("aborted")) {
      return;
    }
    msg.warning(transformI18n($t("toolbar.notSupportTip")));
  }
};

const onPainterStart = () => {
  isInPainter.value = true;
};

const onPainterEnd = () => {
  isInPainter.value = false;
};

/**
 * @Desc: 读取本地文件
 */
const readFile = async () => {
  let file = await fileHandle.getFile();
  let fileReader = new FileReader();
  fileReader.onload = async () => {
    useXmindStoreHook().setIsHandleLocalFile(true);
    setData(fileReader.result);
    ElNotification.closeAll();
    ElNotification({
      title: transformI18n($t("toolbar.tip")),
      message: `${transformI18n($t("toolbar.editingLocalFileTipFront"))}${file.name}${transformI18n($t("toolbar.editingLocalFileTipEnd"))}`,
      duration: 0,
      showClose: true,
    });
  };
  fileReader.readAsText(file);
};

/**
 * @Desc: 渲染读取的数据
 */
const setData = str => {
  try {
    let data = JSON.parse(str);
    if (typeof data !== "object") {
      throw new Error(transformI18n($t("toolbar.fileContentError")));
    }
    if (data.root) {
      isFullDataFile.value = true;
    } else {
      isFullDataFile.value = false;
      data = {
        ...exampleData,
        root: data,
      };
    }
    emitter.emit("setData", data);
  } catch (error) {
    console.log(error);
    msg.error(transformI18n($t("toolbar.fileOpenFailed")));
  }
};

/**
 * @Desc: 写入本地文件
 */
const writeLocalFile = async content => {
  if (!fileHandle || !isHandleLocalFile.value) {
    return;
  }
  if (!isFullDataFile.value) {
    content = content.root;
  }
  let string = JSON.stringify(content);
  const writable = await fileHandle.createWritable();
  await writable.write(string);
  await writable.close();
};

/**
 * @Desc: 创建本地文件
 */
const createNewLocalFile = async () => {
  await createLocalFile(exampleData);
};

/**
 * @Desc: 另存为
 */
const saveLocalFile = async () => {
  let data = getData();
  await createLocalFile(data);
};

/**
 * @Desc: 创建本地文件
 */
const createLocalFile = async content => {
  try {
    let _fileHandle = await (window as any).showSaveFilePicker({
      types: [
        {
          description: "",
          accept: { "application/json": [".smm"] },
        },
      ],
      suggestedName: transformI18n($t("toolbar.defaultFileName")),
    });
    if (!_fileHandle) {
      return;
    }
    showLoading(transformI18n($t("toolbar.creatingTip")));
    fileHandle = _fileHandle;
    useXmindStoreHook().setIsHandleLocalFile(true);
    isFullDataFile.value = true;
    await writeLocalFile(content);
    await readFile();
    hideLoading();
  } catch (error) {
    console.log(error);
    if (error.toString().includes("aborted")) {
      return;
    }
    msg.warning(transformI18n($t("toolbar.notSupportTip")));
  }
};

const emit = (...args: Parameters<typeof emitter.emit>) => emitter.emit(...args);

onMounted(() => {
  computeToolbarShow();
  window.addEventListener("resize", computeToolbarShowThrottle);
  emitter.on("write_local_file", onWriteLocalFile);
  emitter.on("lang_change", computeToolbarShowThrottle);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", computeToolbarShowThrottle);
  emitter.off("write_local_file", onWriteLocalFile);
  emitter.off("lang_change", computeToolbarShowThrottle);
});
</script>
<template>
  <div class="toolbarContainer" :class="{ isDark: isDark }">
    <div ref="toolbarRef" class="toolbar">
      <!-- 节点操作 -->
      <div class="toolbarBlock">
        <ToolbarNodeBtnList :list="horizontalList" />
        <!-- 更多 -->
        <el-popover
          v-if="showMoreBtn"
          v-model="popoverShow"
          placement="bottom-end"
          width="120"
          trigger="hover"
          style="margin-left: 20px"
        >
          <ToolbarNodeBtnList dir="v" :list="verticalList" @click="popoverShow = false" />
          <template v-slot:reference>
            <div class="toolbarBtn">
              <span class="icon iconfont icongongshi" />
              <span class="text">{{ transformI18n($t("toolbar.more")) }}</span>
            </div>
          </template>
        </el-popover>
      </div>
      <!-- 本地文件 -->
      <div class="toolbarBlock">
        <div class="toolbarBtn" @click="createNewLocalFile">
          <span class="icon iconfont iconxinjian" />
          <span class="text">{{ transformI18n($t("toolbar.newFile")) }}</span>
        </div>
        <div class="toolbarBtn" @click="openLocalFile">
          <span class="icon iconfont icondakai" />
          <span class="text">{{ transformI18n($t("toolbar.openFile")) }}</span>
        </div>
        <div class="toolbarBtn" @click="saveLocalFile">
          <span class="icon iconfont iconlingcunwei" />
          <span class="text">{{ transformI18n($t("toolbar.saveAs")) }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showImport')">
          <span class="icon iconfont icondaoru" />
          <span class="text">{{ transformI18n($t("toolbar.import")) }}</span>
        </div>
        <div class="toolbarBtn" @click="emit('showExport')">
          <span class="icon iconfont iconexport" />
          <span class="text">{{ transformI18n($t("toolbar.export")) }}</span>
        </div>
      </div>
    </div>
    <!-- 节点图片 -->
    <NodeImage />
    <!-- 节点图片预览 -->
    <NodeImgPreview v-if="mindMap" :mindMap="mindMap" />
    <!-- 节点图标 -->
    <NodeIcon />
    <!-- 节点超链接 -->
    <NodeHyperlink />
    <!-- 节点备注 -->
    <NodeNote />
    <NodeNoteContentShow />
    <!-- 节点标签 -->
    <NodeTag />
    <!-- 公式 -->
    <FormulaSidebar v-if="mindMap" :mindMap="mindMap" />
    <!-- xmind 导入 -->
    <Import />
    <!-- xmind 导出 -->
    <Export />
  </div>
</template>

<style lang="scss" scoped>
.toolbarContainer {
  &.isDark {
    .toolbar {
      color: hsl(0deg 0% 100% / 90%);

      .toolbarBlock {
        background-color: #262a2e;
      }

      .toolbarBtn {
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
  }

  .toolbar {
    position: fixed;
    top: 50px;
    left: 50%;
    z-index: 2;
    display: flex;
    width: max-content;
    padding: 0 20px;
    padding-top: 50px;
    font-family: PingFangSC-Regular, "PingFang SC", sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: rgb(26 26 26 / 80%);
    transform: translateX(-50%);

    .toolbarBlock {
      display: flex;
      padding: 10px 20px;
      margin-right: 20px;
      background-color: #fff;
      border: 1px solid rgb(0 0 0 / 6%);
      border-radius: 6px;
      box-shadow: 0 2px 16px 0 rgb(0 0 0 / 6%);

      &:last-of-type {
        margin-right: 0;
      }
    }

    .toolbarBtn {
      display: flex;
      flex-shrink: 0;
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
  }
}
</style>
