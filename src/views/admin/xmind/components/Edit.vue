<script setup lang="ts">
/**
 * @description: xmind 主入口
 * @return {*}
 */

// xmind 实例
import MindMap from "simple-mind-map";
// 迷你地图
import MiniMap from "simple-mind-map/src/plugins/MiniMap.js";
// 水印
import Watermark from "simple-mind-map/src/plugins/Watermark.js";
// 键盘导航
import KeyboardNavigation from "simple-mind-map/src/plugins/KeyboardNavigation.js";
// 导出 pdf
import ExportPDF from "simple-mind-map/src/plugins/ExportPDF.js";
// 导出 xmind
import ExportXMind from "simple-mind-map/src/plugins/ExportXMind.js";
// 导出
import Export from "simple-mind-map/src/plugins/Export.js";
// 拖动
import Drag from "simple-mind-map/src/plugins/Drag.js";
// 选择
import Select from "simple-mind-map/src/plugins/Select.js";
// 富文本
import RichText from "simple-mind-map/src/plugins/RichText.js";
// 关联线
import AssociativeLine from "simple-mind-map/src/plugins/AssociativeLine.js";
// 触摸事件
import TouchEvent from "simple-mind-map/src/plugins/TouchEvent.js";
// 节点图片调整
import NodeImgAdjust from "simple-mind-map/src/plugins/NodeImgAdjust.js";
// 搜索
import SearchPlugin from "simple-mind-map/src/plugins/Search.js";
// 绘制
import Painter from "simple-mind-map/src/plugins/Painter.js";
// 滚动条
import ScrollbarPlugin from "simple-mind-map/src/plugins/Scrollbar.js";
// 公式
import Formula from "simple-mind-map/src/plugins/Formula.js";
// import Cooperate from "simple-mind-map/src/plugins/Cooperate.js";

// 工具栏
import Toolbar from "./Toolbar.vue";
// 导航器工具栏
import NavigatorToolbar from "./NavigatorToolbar.vue";
import NodeIconSidebar from "./NodeIconSidebar.vue";
import NodeIconToolbar from "./NodeIconToolbar.vue";
// 侧边栏触发器
import SidebarTrigger from "./SidebarTrigger.vue";
// 节点样式设置
import NodeStyle from "./NodeStyle.vue";
// 基础样式
import BaseStyle from "./BaseStyle.vue";
// 主题
import Theme from "./Theme.vue";
// 结构
import Structure from "./Structure.vue";
// 大纲
import OutlineSidebar from "./OutlineSidebar.vue";
// 大纲编辑
import OutlineEdit from "./OutlineEdit.vue";
// 快捷键
import ShortcutKey from "./ShortcutKey.vue";
// 字数及节点数量统计
import Count from "./Count.vue";
// 右键
import Contextmenu from "./Contextmenu.vue";
// 是否显示滚动条
import Scrollbar from "./Scrollbar.vue";
// 富文本编辑工具栏
import RichTextToolbar from "./RichTextToolbar.vue";
// import Color from './Color.vue'
// import CustomNodeContent from "./CustomNodeContent.vue";

import { computed, onMounted, ref, toRaw, watch, onBeforeUnmount, unref } from "vue";
import { ElNotification } from "element-plus";
import { getData, removeData, storeData, storeConfig } from "@/api/xmind";
import icon from "../config/icon";
import customThemeList from "../customThemes";
import { showLoading, hideLoading } from "@/utils/loading";
import exampleData from "simple-mind-map/example/exampleData";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter, Events } from "@/utils/mitt";
import { $t, transformI18n } from "@/plugins/i18n";
import { msg } from "@/utils/msg";
import { useRoute } from "vue-router";
import axios from "axios";
import { formatXmindData, addFullTextToChildren, updateRequestData, xmindRequestData } from "@/utils/xmindData";
// @ts-ignore
import { handleClipboardText } from "@/utils/handleClipboardText";

defineOptions({
  name: "Edit",
});

// 注册插件
MindMap.usePlugin(MiniMap) // 迷你地图
  .usePlugin(Watermark) // 水印
  .usePlugin(Drag) // 拖动
  .usePlugin(KeyboardNavigation) // 键盘导航
  .usePlugin(ExportPDF) // 导出 pdf
  .usePlugin(ExportXMind) // 导出 xmind
  .usePlugin(Export) // 导出
  .usePlugin(Select) // 选择
  .usePlugin(AssociativeLine) // 关联线
  .usePlugin(NodeImgAdjust) // 节点图片调整
  .usePlugin(TouchEvent) // 触摸事件
  .usePlugin(SearchPlugin) // 搜索
  .usePlugin(Painter) // 绘制
  .usePlugin(ScrollbarPlugin) // 滚动条
  .usePlugin(Formula); // 公式
// .usePlugin(Cooperate)// 协同插件

// 注册自定义主题
customThemeList.forEach(item => {
  MindMap.defineTheme(item.value, item.theme);
});

const { VITE_PUBLIC_PATH } = import.meta.env;
const localXmindData = ref(useXmindStoreHook().getMindMapData);
const timer = ref(null);
const route = useRoute();
const enableShowLoading = ref(true);
const mindMapData = ref({});
const mindMap = ref(null);
const mindMapContainer = ref(null);
const prevImg = ref("");
const storeConfigTimer = ref(null);

const isZenMode = computed(() => useXmindStoreHook().getLocalConfig.isZenMode);
const openNodeRichText = computed(() => useXmindStoreHook().getLocalConfig.openNodeRichText);
const isShowScrollbar = computed(() => useXmindStoreHook().getLocalConfig.isShowScrollbar);
const useLeftKeySelectionRightKeyDrag = computed(() => useXmindStoreHook().getLocalConfig.useLeftKeySelectionRightKeyDrag);

watch(
  () => openNodeRichText.value,
  () => {
    if (openNodeRichText.value) {
      addRichTextPlugin();
    } else {
      removeRichTextPlugin();
    }
  },
);
watch(
  () => isShowScrollbar.value,
  () => {
    if (isShowScrollbar.value) {
      addScrollbarPlugin();
    } else {
      removeScrollbarPlugin();
    }
  },
);

function handleStartTextEdit() {
  mindMap.value.renderer.startTextEdit();
}

function handleEndTextEdit() {
  mindMap.value.renderer.endTextEdit();
}

function handleCreateLineFromActiveNode() {
  mindMap.value.associativeLine.createLineFromActiveNode();
}

function handleStartPainter() {
  mindMap.value.painter.startPainter();
}

function handleResize() {
  mindMap.value.resize();
}

// 显示loading
function handleShowLoading() {
  enableShowLoading.value = true;
  showLoading();
}
// 渲染结束后关闭loading
function handleHideLoading() {
  if (enableShowLoading.value) {
    enableShowLoading.value = false;
    hideLoading();
  }
}
// 渲染结束后关闭loading
function handleSetMindMapData(data) {
  mindMapData.value = data;
}
/**
 * @Desc: 获取思维导图数据，实际应该调接口获取
 */
function getDataValue() {
  const data = getData();
  mindMapData.value = data;
  return data;
}

// 通过toRaw方法拿到mindMap的原始数据
// 解决vue3的mindMap变量被proxy代理了，mindMap变成Proxy里面有些动态的属性就不兼容了
// 需要通过toRaw的形式，拿到mindMap的原始引用
function getMindMap() {
  return toRaw(mindMap.value);
}

/**
 * @Desc: 存储数据当数据有变时
 */
function bindSaveEvent() {
  emitter.on("data_change", data => {
    storeData(data);
  });
  emitter.on("view_data_change", data => {
    clearTimeout(storeConfigTimer.value);
    storeConfigTimer.value = setTimeout(() => {
      storeConfig({
        view: data,
      });
    }, 300);
  });
}

/**
 * @Desc: 手动保存
 */
function manualSave() {
  // let data = mindMap.value.command.getCopyData()
  // storeData(data)
  // let viewData = mindMap.value.view.getTransformData()
  // storeConfig({
  //   view: viewData,
  // })
  let data = mindMap.value.getData(true);
  storeConfig(data);
}

/**
 * @Desc: 初始化
 */
function init() {
  let hasFileURLData = hasFileURL();
  let { root, layout, theme, view, config } = getDataValue();
  // 如果url中存在要打开的文件，那么思维导图数据、主题、布局都使用默认的
  if (hasFileURLData) {
    root = {
      data: {
        text: transformI18n($t("edit.root")),
      },
      children: [],
    };
    layout = exampleData.layout;
    theme = exampleData.theme;
    view = null;
  }
  mindMap.value = new MindMap({
    el: mindMapContainer.value,
    data: root,
    fit: false,
    layout: layout,
    theme: theme.template,
    themeConfig: theme.config,
    viewData: view,
    nodeTextEditZIndex: 1000,
    nodeNoteTooltipZIndex: 1000,
    customNoteContentShow: {
      show: (content, left, top, node) => {
        emitter.emit("showNoteContent", [content, left, top, node]);
      },
      hide: () => {
        // emitter.emit('hideNoteContent')
      },
    },
    ...(config || {}),
    iconList: [...icon],
    useLeftKeySelectionRightKeyDrag: useLeftKeySelectionRightKeyDrag.value,
    customInnerElsAppendTo: null,
    enableAutoEnterTextEditWhenKeydown: true,
    customHandleClipboardText: handleClipboardText,
    defaultNodeImage: import("@/assets/svg/imgLoadError.svg"),
    initRootNodePosition: ["center", "center"],
    handleIsSplitByWrapOnPasteCreateNewNode: () => {
      return msg.confirm(transformI18n($t("edit.splitByWrap")), transformI18n($t("edit.tip")), {
        confirmButtonText: transformI18n($t("edit.yes")),
        cancelButtonText: transformI18n($t("edit.no")),
        type: "warning",
      });
    },
    errorHandler: (code, err) => {
      console.error(err);
      switch (code) {
        case "export_error":
          msg.error("导出失败");
          break;
        default:
          break;
      }
    },
    // isUseCustomNodeContent: true,
    // 示例1：组件里用到了router、store、i18n等实例化vue组件时需要用到的东西
    // customCreateNodeContent: (node) => {
    //   let el = document.createElement('div')
    //   let Comp = Vue.extend(Color)
    //   let comp = new Comp({
    //     router,
    //     store,
    //     i18n
    //   })
    //   comp.$mount(el)
    //   return comp.$el
    // },
    // 示例2：组件里没有用到示例1的东西
    // customCreateNodeContent: (node) => {
    //   let el = document.createElement('div')
    //   let Comp = Vue.extend(CustomNodeContent)
    //   let comp = new Comp({
    //     propsData: {
    //       html: node.nodeData.data.text
    //     }
    //   })
    //   comp.$mount(el)
    //   return comp.$el
    // }
  });
  openNodeRichText.value && addRichTextPlugin();
  isShowScrollbar.value && addScrollbarPlugin();
  mindMap.value.keyCommand.addShortcut("Control+s", () => {
    manualSave();
  });
  // 转发事件
  [
    "node_active",
    "data_change",
    "view_data_change",
    "back_forward",
    "node_contextmenu",
    "node_click",
    "draw_click",
    "expand_btn_click",
    "svg_mousedown",
    "mouseup",
    "mode_change",
    "node_tree_render_end",
    "rich_text_selection_change",
    "transforming-dom-to-images",
    "generalization_node_contextmenu",
    "painter_start",
    "painter_end",
    "scrollbar_change",
    "scale",
  ].forEach(event => {
    getMindMap().on(event, (...args) => {
      if (["node_contextmenu", "node_active", "rich_text_selection_change"].includes(event)) {
        emitter.emit(event as keyof Events, args);
      } else {
        // @ts-ignore
        emitter.emit(event as keyof Events, ...args);
      }
    });
  });
  bindSaveEvent();
  testDynamicCreateNodes();
  // 解析url中的文件
  if (hasFileURL) {
    emitter.emit("handle_file_url");
  }
  // 协同测试
  cooperateTest();
  (window as any).mindMap = mindMap.value;
  // 销毁
  // setTimeout(() => {
  //   console.log('销毁')
  //   mindMap.value.destroy()
  // }, 10000)
  // 测试
  // setTimeout(() => {
  //   console.log(mindMap.value.renderer.root.getRect())
  //   console.log(mindMap.value.renderer.root.getRectInSvg())
  // }, 5000);
}

// url中是否存在要打开的文件
function hasFileURL() {
  const fileURL = route.query.fileURL;
  if (!fileURL) return false;
  return typeof fileURL === "string" ? /\.(smm|json|xmind|md|xlsx)$/.test(fileURL) : false;
}

/**
 * @Desc: 动态设置思维导图数据
 */
function setData(data) {
  // handleShowLoading();
  // mindMap.value.setData(data)
  if (data.root) {
    getMindMap().setFullData(data);
  } else {
    getMindMap().setData({
      ...data,
      view: data.view,
    });
  }
  mindMap.value.view.reset();
  manualSave();
}

/**
 * @Desc: 重新渲染
 */
function reRender() {
  getMindMap().reRender();
}

/**
 * @Desc: 执行命令
 */
function execCommand(args) {
  getMindMap().execCommand(...(Array.isArray(args) ? args : [args]));
}

/**
 * @Desc: 导出
 */
async function exportData(args) {
  try {
    showLoading();
    await mindMap.value.export(...args);
    hideLoading();
  } catch (error) {
    hideLoading();
    console.log(error);
  }
}

/**
 * @Desc: 修改导出内边距
 */
function onPaddingChange(data) {
  mindMap.value.updateConfig(data);
}

/**
 * @Desc: 显示新特性提示
 */
function showNewFeatureInfo() {
  let showed = localStorage.getItem("SIMPLE_MIND_MAP_NEW_FEATURE_TIP_1");
  if (!showed) {
    ElNotification.info({
      title: transformI18n($t("edit.newFeatureNoticeTitle")),
      message: transformI18n($t("edit.newFeatureNoticeMessage")),
      duration: 0,
      onClose: () => {
        localStorage.setItem("SIMPLE_MIND_MAP_NEW_FEATURE_TIP_1", "true");
      },
    });
  }
}

/**
 * @Desc: 加载节点富文本编辑插件
 */
function addRichTextPlugin() {
  if (!mindMap.value) return;
  mindMap.value.addPlugin(RichText);
}

/**
 * @Desc: 移除节点富文本编辑插件
 */
function removeRichTextPlugin() {
  mindMap.value.removePlugin(RichText);
}
// 加载滚动条插件
function addScrollbarPlugin() {
  if (!mindMap.value) return;
  mindMap.value.addPlugin(ScrollbarPlugin);
}
// 移除滚动条插件
function removeScrollbarPlugin() {
  mindMap.value.removePlugin(ScrollbarPlugin);
}
// 测试动态插入节点
function testDynamicCreateNodes() {
  getRequestData();
  // return
  setTimeout(() => {
    // 动态给指定节点添加子节点
    // mindMap.value.execCommand(
    //   'INSERT_CHILD_NODE',
    //   false,
    //   mindMap.value.renderer.root,
    //   {
    //     text: '自定义内容'
    //   },
    //   [
    //     {
    //       data: {
    //         text: '自定义子节点'
    //       }
    //     }
    //   ]
    // )
    // 动态给指定节点添加同级节点
    // mindMap.value.execCommand(
    //   'INSERT_NODE',
    //   false,
    //   null,
    //   {
    //     text: '自定义内容'
    //   },
    //   [
    //     {
    //       data: {
    //         text: '自定义同级节点'
    //       },
    //       children: [
    //         {
    //           data: {
    //             text: '自定义同级节点2'
    //           },
    //           children: []
    //         }
    //       ]
    //     }
    //   ]
    // )
    // 动态插入多个子节点
    // mindMap.value.execCommand('INSERT_MULTI_CHILD_NODE', null, [
    //   {
    //     data: {
    //       text: '自定义节点1'
    //     },
    //     children: [
    //       {
    //         data: {
    //           text: '自定义节点1-1'
    //         },
    //         children: []
    //       }
    //     ]
    //   },
    //   {
    //     data: {
    //       text: '自定义节点2'
    //     },
    //     children: [
    //       {
    //         data: {
    //           text: '自定义节点2-1'
    //         },
    //         children: []
    //       }
    //     ]
    //   }
    // ])
    // 动态插入多个同级节点
    // mindMap.value.execCommand('INSERT_MULTI_NODE', null, [
    //   {
    //     data: {
    //       text: '自定义节点1'
    //     },
    //     children: [
    //       {
    //         data: {
    //           text: '自定义节点1-1'
    //         },
    //         children: []
    //       }
    //     ]
    //   },
    //   {
    //     data: {
    //       text: '自定义节点2'
    //     },
    //     children: [
    //       {
    //         data: {
    //           text: '自定义节点2-1'
    //         },
    //         children: []
    //       }
    //     ]
    //   }
    // ])
    // 动态删除指定节点
    // mindMap.value.execCommand('REMOVE_NODE', mindMap.value.renderer.root.children[0])
  }, 5000);
}

// 协同测试
function cooperateTest() {
  if (mindMap.value.cooperate && route.query.userName) {
    mindMap.value.cooperate.setProvider(null, {
      roomName: "demo-room",
      signalingList: ["ws://192.168.3.125:4444"],
    });
    mindMap.value.cooperate.setUserInfo({
      id: Math.random(),
      name: route.query.userName,
      color: ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#909399"][Math.floor(Math.random() * 5)],
      avatar:
        Math.random() > 0.5
          ? "https://img0.baidu.com/it/u=4270674549,2416627993&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1696006800&t=4d32871d14a7224a4591d0c3c7a97311"
          : "",
    });
  }
}

/**
 * 获取后台实时数据
 */
async function getRequestData() {
  const res = xmindRequestData;

  if (!localXmindData.value?.root?.data) {
    axios.get(`${VITE_PUBLIC_PATH}xmind.json`).then(data => {
      localXmindData.value = data.data.root;
      addFullTextToChildren(localXmindData.value);
      formatXmindData(localXmindData.value, res.data);
      getMindMap().updateData(localXmindData.value);
      storeData(localXmindData.value);
    });
  } else {
    updateRequestData(getMindMap(), res.data);
    storeData(localXmindData.value);
  }

  // console.log("后台数据------", res.data);
  // console.log("xmind--原始数据------", unref(localXmindData.value));
  // console.log("xmind--展示数据------", getMindMap().getData());

  // 延迟一秒后继续调用接口查询
  // await new Promise(resolve => (timer.value = setTimeout(resolve, 3000)));
  // getRequestData();
}

onMounted(async () => {
  // removeData();
  useXmindStoreHook().setActiveSidebar(null);
  showLoading(transformI18n($t("other.loading")));
  // showNewFeatureInfo();
  // getDataValue();
  init();

  emitter.on("execCommand", execCommand);
  emitter.on("paddingChange", onPaddingChange);
  emitter.on("exportData", exportData);
  emitter.on("setData", setData);
  emitter.on("startTextEdit", handleStartTextEdit);
  emitter.on("endTextEdit", handleEndTextEdit);
  emitter.on("createAssociativeLine", handleCreateLineFromActiveNode);
  emitter.on("startPainter", handleStartPainter);
  emitter.on("node_tree_render_end", handleHideLoading);
  emitter.on("showLoading", handleShowLoading);
  emitter.on("setMindMapData", handleSetMindMapData);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  emitter.off("execCommand", execCommand);
  emitter.off("paddingChange", onPaddingChange);
  emitter.off("exportData", exportData);
  emitter.off("setData", setData);
  emitter.off("startTextEdit", handleStartTextEdit);
  emitter.off("endTextEdit", handleEndTextEdit);
  emitter.off("createAssociativeLine", handleCreateLineFromActiveNode);
  emitter.off("startPainter", handleStartPainter);
  emitter.off("node_tree_render_end", handleHideLoading);
  emitter.off("setMindMapData", handleSetMindMapData);
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("resize", handleResize);
  clearTimeout(timer.value);
});
</script>
<template>
  <div class="editContainer">
    <div ref="mindMapContainer" class="mindMapContainer" />
    <!-- 工具栏 -->
    <Toolbar v-if="!isZenMode" :mindMap="mindMap" />
    <!-- 导航器工具栏 -->
    <NavigatorToolbar v-if="!isZenMode" :mindMap="mindMap" />
    <!-- 节点图标 -->
    <NodeIconSidebar v-if="mindMap" :mindMap="mindMap" />
    <NodeIconToolbar v-if="mindMap" :mindMap="mindMap" />
    <!-- 侧边栏触发器 -->
    <SidebarTrigger v-if="!isZenMode" />
    <!-- 节点样式设置 -->
    <NodeStyle v-if="!isZenMode" />
    <!-- 基础样式 -->
    <BaseStyle :data="mindMapData" :mindMap="mindMap" />
    <!-- 主题 -->
    <Theme v-if="mindMap" :mindMap="mindMap" />
    <!-- 结构 -->
    <Structure :mindMap="mindMap" />
    <!-- 大纲 -->
    <OutlineSidebar :mindMap="mindMap" />
    <!-- 大纲编辑 -->
    <OutlineEdit v-if="mindMap" :mindMap="mindMap" />
    <!-- 快捷键 -->
    <ShortcutKey />
    <!-- 字数及节点数量统计 -->
    <Count v-if="!isZenMode" :mindMap="mindMap" />
    <!-- 右键 -->
    <Contextmenu v-if="mindMap" :mindMap="mindMap" />
    <!-- 是否显示滚动条 -->
    <Scrollbar v-if="isShowScrollbar && mindMap" :mindMap="mindMap" />
    <!-- 富文本编辑工具栏 -->
    <RichTextToolbar v-if="mindMap" :mindMap="mindMap" />
  </div>
</template>

<style lang="scss" scoped>
.editContainer {
  position: fixed;
  inset: 0;

  .mindMapContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
}
</style>
