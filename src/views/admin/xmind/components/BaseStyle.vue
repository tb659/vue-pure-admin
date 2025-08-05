<script setup lang="ts">
/**
 * @Desc: 基础样式
 */
import Sidebar from "./Sidebar.vue";
import Color from "./Color.vue";
import {
  lineWidthList,
  lineStyleList,
  backgroundRepeatList,
  backgroundPositionList,
  backgroundSizeList,
  fontFamilyList,
  fontSizeList,
  rootLineKeepSameInCurveList,
  lineStyleMap,
} from "../config";
import NodeImageUpload from "./NodeImageUpload.vue";
import { storeConfig } from "@/api/xmind";
import {
  supportLineStyleLayoutsMap,
  supportLineRadiusLayouts,
  supportNodeUseLineStyleLayouts,
  supportRootLineKeepSameInCurveLayouts,
} from "../config/constant";
import { onBeforeUnmount, onBeforeMount, ref, computed, watch } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "BaseStyle",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
  data: {
    type: [Object, null],
  },
});

const { locale } = useI18n();
const sidebar = ref(null);
const activeTab = ref("color");
const marginActiveTab = ref("second");
const style = ref({
  backgroundColor: "",
  lineColor: "",
  lineWidth: "",
  lineStyle: "",
  showLineMarker: "",
  rootLineKeepSameInCurve: "",
  lineRadius: 0,
  generalizationLineWidth: "",
  generalizationLineColor: "",
  associativeLineColor: "",
  associativeLineWidth: 0,
  associativeLineActiveWidth: 0,
  associativeLineActiveColor: "",
  associativeLineTextFontSize: 0,
  associativeLineTextColor: "",
  associativeLineTextFontFamily: "",
  paddingX: 0,
  paddingY: 0,
  imgMaxWidth: 0,
  imgMaxHeight: 0,
  iconSize: 0,
  backgroundImage: "",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "",
  backgroundSize: "",
  marginX: 0,
  marginY: 0,
  nodeUseLineStyle: false,
});

const config = ref({
  enableFreeDrag: false,
  mousewheelAction: "zoom",
  mousewheelZoomActionReverse: null,
  createNewNodeBehavior: "default",
});

const watermarkConfig = ref({
  show: false,
  onlyExport: false,
  text: "",
  lineSpacing: 100,
  textSpacing: 100,
  angle: 30,
  textStyle: {
    color: "",
    opacity: 0,
    fontSize: 1,
  },
});
const updateWatermarkTimer = ref(null);
const enableNodeRichText = ref(true);
const localConfigs = ref({
  isShowScrollbar: false,
});
const currentLayout = ref("");

const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const localConfig = computed(() => useXmindStoreHook().getLocalConfig);
const lineStyleListData = computed(() => lineStyleList[locale] || lineStyleList.zh);
const backgroundRepeatListData = computed(() => backgroundRepeatList[locale] || backgroundRepeatList.zh);
const backgroundPositionListData = computed(() => backgroundPositionList[locale] || backgroundPositionList.zh);
const backgroundSizeListData = computed(() => backgroundSizeList[locale] || backgroundSizeList.zh);
const fontFamilyListData = computed(() => fontFamilyList[locale] || fontFamilyList.zh);
const lineStyleMapData = computed(() => lineStyleMap[locale] || lineStyleMap.zh);
const showNodeUseLineStyle = computed(() => supportNodeUseLineStyleLayouts.includes(currentLayout.value));
const showLineRadius = computed(
  () => style.value.lineStyle === "straight" && supportLineRadiusLayouts.includes(currentLayout.value),
);
const showRootLineKeepSameInCurveLayouts = computed(() => supportRootLineKeepSameInCurveLayouts.includes(currentLayout.value));
const lineStyleListShow = computed(() => {
  const res = [];
  lineStyleListData.value.forEach(item => {
    const list = supportLineStyleLayoutsMap[item.value];
    if (list) {
      if (list.includes(currentLayout.value)) {
        res.push(item);
      }
    } else {
      res.push(item);
    }
  });
  return res;
});
watch(
  () => activeSidebar.value,
  val => {
    if (val === "baseStyle") {
      sidebar.value.show = true;
      initStyle();
      initConfig();
      initWatermark();
      currentLayout.value = props.mindMap.getLayout();
    } else {
      sidebar.value.show = false;
    }
  },
);
watch(
  () => lineStyleListShow.value,
  () => {
    const has = lineStyleListShow.value.find(item => {
      return item.value === style.value.lineStyle;
    });
    if (!has) {
      style.value.lineStyle = lineStyleListShow.value[0].value;
    }
  },
  { deep: true },
);

onBeforeMount(() => {
  initLoacalConfig();
  emitter.on("setData", onSetData);
});
onBeforeUnmount(() => {
  emitter.off("setData", onSetData);
});
function onSetData() {
  if (activeSidebar.value !== "baseStyle") return;
  setTimeout(() => {
    initStyle();
  }, 0);
}
/**
 * @Desc: 初始样式
 */
function initStyle() {
  [
    "backgroundColor",
    "lineWidth",
    "lineStyle",
    "showLineMarker",
    "rootLineKeepSameInCurve",
    "lineRadius",
    "lineColor",
    "generalizationLineWidth",
    "generalizationLineColor",
    "associativeLineColor",
    "associativeLineWidth",
    "associativeLineActiveWidth",
    "associativeLineActiveColor",
    "associativeLineTextFontSize",
    "associativeLineTextColor",
    "associativeLineTextFontFamily",
    "paddingX",
    "paddingY",
    "imgMaxWidth",
    "imgMaxHeight",
    "iconSize",
    "backgroundImage",
    "backgroundRepeat",
    "backgroundPosition",
    "backgroundSize",
    "nodeUseLineStyle",
  ].forEach(key => {
    style.value[key] = props.mindMap.getThemeConfig(key);
    if (key === "backgroundImage" && style.value[key] === "none") {
      style.value[key] = "";
    }
  });
  initMarginStyle();
}

// 初始化其他配置
function initConfig() {
  ["enableFreeDrag", "mousewheelAction"].forEach(key => {
    config.value[key] = props.mindMap.getConfig(key);
  });
}

// 初始化本地配置
function initLoacalConfig() {
  enableNodeRichText.value = localConfig.value.openNodeRichText;
  config.value.mousewheelAction = localConfig.value.mousewheelAction;
  config.value.mousewheelZoomActionReverse = localConfig.value.mousewheelZoomActionReverse;
  ["isShowScrollbar"].forEach(key => {
    localConfigs.value[key] = localConfig.value[key];
  });
}

// 初始化水印配置
function initWatermark() {
  let config = props.mindMap.getConfig("watermarkConfig");
  ["text", "lineSpacing", "textSpacing", "angle", "onlyExport"].forEach(key => {
    watermarkConfig.value[key] = config[key];
  });
  watermarkConfig.value.show = !!config.text;
  watermarkConfig.value.textStyle = { ...config.textStyle };
}

/**
 * @Desc: margin初始值
 */
function initMarginStyle() {
  ["marginX", "marginY"].forEach(key => {
    style.value[key] = props.mindMap.getThemeConfig()[marginActiveTab.value][key];
  });
}

/**
 * @Desc: 更新配置
 */
function update(key, value) {
  if (key === "backgroundImage" && value === "none") {
    style.value[key] = "";
  } else {
    style.value[key] = value;
  }
  // props.data.theme.config[key] = value;
  const mindMapData = { ...props.data };
  mindMapData.theme.config[key] = value;
  emitter.emit("setMindMapData", mindMapData);
  emitter.emit("showLoading");
  props.mindMap.setThemeConfig(props.data.theme.config);
  storeConfig({
    theme: {
      template: props.mindMap.getTheme(),
      config: props.data.theme.config,
    },
  });
}

// 更新其他配置
function updateOtherConfig(key, value) {
  props.mindMap.updateConfig({
    [key]: value,
  });
  // props.data.config = props.data.config || {};
  // props.data.config[key] = value;
  const mindMapData = { ...props.data };
  mindMapData.config = props.data.config || {};
  mindMapData.config[key] = value;
  emitter.emit("setMindMapData", mindMapData);
  storeConfig({
    config: props.data.config,
  });
}

// 更新水印配置
function updateWatermarkConfig() {
  clearTimeout(updateWatermarkTimer.value);
  updateWatermarkTimer.value = setTimeout(() => {
    let { show, ...config } = watermarkConfig.value;
    props.mindMap.watermark.updateWatermark({
      ...config,
    });
    // props.data.config = props.data.config || {};
    // props.data.config.watermarkConfig = props.mindMap.getConfig("watermarkConfig");
    const mindMapData = { ...props.data };
    mindMapData.config = props.data.config || {};
    mindMapData.config.watermarkConfig = props.mindMap.getConfig("watermarkConfig");
    emitter.emit("setMindMapData", mindMapData);
    storeConfig({
      config: props.data.config,
    });
  }, 300);
}

/**
 * @Desc: 设置margin
 */
function updateMargin(type, value) {
  style.value[type] = value;
  // if (!props.data.theme.config[marginActiveTab.value]) {
  //   props.data.theme.config[marginActiveTab.value] = {};
  // }
  // props.data.theme.config[marginActiveTab.value][type] = value;
  const mindMapData = { ...props.data };
  if (!mindMapData.theme.config[marginActiveTab.value]) {
    mindMapData.theme.config[marginActiveTab.value] = {};
  }
  mindMapData.theme.config[marginActiveTab.value][type] = value;
  emitter.emit("setMindMapData", mindMapData);
  props.mindMap.setThemeConfig(props.data.theme.config);
  storeConfig({
    theme: {
      template: props.mindMap.getTheme(),
      config: props.data.theme.config,
    },
  });
}

// 切换显示水印与否
function watermarkShowChange(value) {
  if (value) {
    let text = watermarkConfig.value.text || transformI18n(transformI18n($t("baseStyle.watermarkDefaultText")));
    watermarkConfig.value.text = text;
  } else {
    watermarkConfig.value.text = "";
  }
  updateWatermarkConfig();
}

// 切换是否开启节点富文本编辑
function enableNodeRichTextChange(e) {
  props.mindMap.renderer.textEdit.hideEditTextBox();
  useXmindStoreHook().setLocalConfig({
    openNodeRichText: e,
  });
}

// 本地配置
function updateLocalConfig(key, value) {
  useXmindStoreHook().setLocalConfig({
    [key]: value,
  });
}
</script>
<template>
  <Sidebar ref="sidebar" :title="transformI18n($t('baseStyle.title'))">
    <div v-if="data" class="sidebarContent" :class="{ isDark: isDark }">
      <!-- 背景 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.background")) }}</div>
      <div class="row">
        <el-tabs v-model="activeTab" class="tab">
          <el-tab-pane :label="transformI18n($t('baseStyle.color'))" name="color">
            <Color
              :color="style.backgroundColor"
              @change="
                color => {
                  update('backgroundColor', color);
                }
              "
            />
          </el-tab-pane>
          <el-tab-pane :label="transformI18n($t('baseStyle.image'))" name="image">
            <NodeImageUpload
              class="imgUpload"
              :value="style.backgroundImage"
              @changeImg="
                img => {
                  update('backgroundImage', img);
                }
              "
            />
            <!-- 图片重复方式 -->
            <div class="rowItem">
              <span class="name">{{ transformI18n($t("baseStyle.imageRepeat")) }}</span>
              <el-select
                v-model="style.backgroundRepeat"
                size="small"
                style="width: 120px"
                placeholder=""
                @change="
                  value => {
                    update('backgroundRepeat', value);
                  }
                "
              >
                <el-option v-for="item in backgroundRepeatListData" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
            </div>
            <!-- 图片位置 -->
            <div class="rowItem">
              <span class="name">{{ transformI18n($t("baseStyle.imagePosition")) }}</span>
              <el-select
                v-model="style.backgroundPosition"
                size="small"
                style="width: 120px"
                placeholder=""
                @change="
                  value => {
                    update('backgroundPosition', value);
                  }
                "
              >
                <el-option v-for="item in backgroundPositionListData" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
            </div>
            <!-- 图片大小 -->
            <div class="rowItem">
              <span class="name">{{ transformI18n($t("baseStyle.imageSize")) }}</span>
              <el-select
                v-model="style.backgroundSize"
                size="small"
                style="width: 120px"
                placeholder=""
                @change="
                  value => {
                    update('backgroundSize', value);
                  }
                "
              >
                <el-option v-for="item in backgroundSizeListData" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 连线 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.line")) }}</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.color")) }}</span>
          <el-popover placement="bottom" trigger="hover" width="auto">
            <template #reference>
              <span v-popover:popover class="block" :style="{ backgroundColor: style.lineColor }" />
            </template>
            <Color
              :color="style.lineColor"
              @change="
                color => {
                  update('lineColor', color);
                }
              "
            />
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.width")) }}</span>
          <el-select
            v-model="style.lineWidth"
            size="small"
            style="width: 80px"
            placeholder=""
            @change="
              value => {
                update('lineWidth', value);
              }
            "
          >
            <el-option v-for="item in lineWidthList" :key="item" :label="item" :value="item">
              <span v-if="item > 0" class="borderLine" :class="{ isDark: isDark }" :style="{ height: item + 'px' }" />
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div v-if="lineStyleListShow.length > 1" class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.style")) }}</span>
          <el-select
            v-model="style.lineStyle"
            size="small"
            style="width: 80px"
            placeholder=""
            @change="
              value => {
                update('lineStyle', value);
              }
            "
          >
            <el-option
              v-for="item in lineStyleListShow"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :class="{
                lineStyleOption: true,
                isDark: isDark,
                isSelected: style.lineStyle === item.value,
              }"
            >
              {{ lineStyleMapData[item.value] }}
            </el-option>
          </el-select>
        </div>
        <div v-if="showLineRadius" class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.lineRadius")) }}</span>
          <el-select
            v-model="style.lineRadius"
            size="small"
            style="width: 80px"
            placeholder=""
            @change="
              value => {
                update('lineRadius', value);
              }
            "
          >
            <el-option v-for="item in [0, 2, 5, 7, 10, 12, 15]" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div v-if="style.lineStyle === 'curve' && showRootLineKeepSameInCurveLayouts" class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.rootStyle")) }}</span>
          <el-select
            v-model="style.rootLineKeepSameInCurve"
            size="small"
            style="width: 80px"
            placeholder=""
            @change="
              value => {
                update('rootLineKeepSameInCurve', value);
              }
            "
          >
            <el-option v-for="item in rootLineKeepSameInCurveList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="style.showLineMarker"
            @change="
              value => {
                update('showLineMarker', value);
              }
            "
            >{{ transformI18n($t("baseStyle.showArrow")) }}</el-checkbox
          >
        </div>
      </div>
      <!-- 概要连线 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.lineOfOutline")) }}</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.color")) }}</span>
          <el-popover placement="bottom" trigger="hover" width="auto">
            <template #reference>
              <span v-popover:popover2 class="block" :style="{ backgroundColor: style.generalizationLineColor }" />
            </template>
            <Color
              :color="style.generalizationLineColor"
              @change="
                color => {
                  update('generalizationLineColor', color);
                }
              "
            />
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.width")) }}</span>
          <el-select
            v-model="style.generalizationLineWidth"
            size="small"
            style="width: 80px"
            placeholder=""
            @change="
              value => {
                update('generalizationLineWidth', value);
              }
            "
          >
            <el-option v-for="item in lineWidthList" :key="item" :label="item" :value="item">
              <span v-if="item > 0" class="borderLine" :class="{ isDark: isDark }" :style="{ height: item + 'px' }" />
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 关联线 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.associativeLine")) }}</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.associativeLineColor")) }}</span>
          <el-popover ref="popover4" placement="bottom" trigger="hover" width="auto">
            <template #reference>
              <span v-popover:popover4 class="block" :style="{ backgroundColor: style.associativeLineColor }" />
            </template>
            <Color
              :color="style.associativeLineColor"
              @change="
                color => {
                  update('associativeLineColor', color);
                }
              "
            />
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.associativeLineWidth")) }}</span>
          <el-select
            v-model="style.associativeLineWidth"
            size="small"
            style="width: 80px"
            placeholder=""
            @change="
              value => {
                update('associativeLineWidth', value);
              }
            "
          >
            <el-option v-for="item in lineWidthList" :key="item" :label="item" :value="item">
              <span v-if="item > 0" class="borderLine" :class="{ isDark: isDark }" :style="{ height: item + 'px' }" />
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.associativeLineActiveColor")) }}</span>
          <el-popover ref="popover5" placement="bottom" trigger="hover" width="auto">
            <template #reference>
              <span v-popover:popover5 class="block" :style="{ backgroundColor: style.associativeLineActiveColor }" />
            </template>
            <Color
              :color="style.associativeLineActiveColor"
              @change="
                color => {
                  update('associativeLineActiveColor', color);
                }
              "
            />
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.associativeLineActiveWidth")) }}</span>
          <el-select
            v-model="style.associativeLineActiveWidth"
            size="small"
            style="width: 80px"
            placeholder=""
            @change="
              value => {
                update('associativeLineActiveWidth', value);
              }
            "
          >
            <el-option v-for="item in lineWidthList" :key="item" :label="item" :value="item">
              <span v-if="item > 0" class="borderLine" :class="{ isDark: isDark }" :style="{ height: item + 'px' }" />
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 关联线文字 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.associativeLineText")) }}</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.fontFamily")) }}</span>
          <el-select
            v-model="style.associativeLineTextFontFamily"
            size="small"
            placeholder=""
            @change="update('associativeLineTextFontFamily', $event)"
          >
            <el-option
              v-for="item in fontFamilyListData"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :style="{ fontFamily: item.value }"
            />
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.color")) }}</span>
          <el-popover ref="popover6" placement="bottom" trigger="hover">
            <template #reference>
              <span v-popover:popover6 class="block" :style="{ backgroundColor: style.associativeLineTextColor }" />
            </template>
            <Color
              :color="style.associativeLineTextColor"
              @change="
                color => {
                  update('associativeLineTextColor', color);
                }
              "
            />
          </el-popover>
        </div>
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.fontSize")) }}</span>
          <el-select
            v-model="style.associativeLineTextFontSize"
            size="small"
            style="width: 80px"
            placeholder=""
            @change="update('associativeLineTextFontSize', $event)"
          >
            <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item" :style="{ fontSize: item + 'px' }" />
          </el-select>
        </div>
      </div>
      <!-- 节点边框风格 -->
      <template v-if="showNodeUseLineStyle">
        <div class="title noTop">{{ transformI18n($t("baseStyle.nodeBorderType")) }}</div>
        <div class="row">
          <div class="rowItem">
            <el-checkbox
              v-model="style.nodeUseLineStyle"
              @change="
                value => {
                  update('nodeUseLineStyle', value);
                }
              "
              >{{ transformI18n($t("baseStyle.nodeUseLineStyle")) }}</el-checkbox
            >
          </div>
        </div>
      </template>
      <!-- 内边距 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.nodePadding")) }}</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.horizontal")) }}</span>
          <el-slider
            v-model="style.paddingX"
            style="width: 200px"
            @change="
              value => {
                update('paddingX', value);
              }
            "
          />
        </div>
      </div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.vertical")) }}</span>
          <el-slider
            v-model="style.paddingY"
            style="width: 200px"
            @change="
              value => {
                update('paddingY', value);
              }
            "
          />
        </div>
      </div>
      <!-- 图片 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.image")) }}</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.maximumWidth")) }}</span>
          <el-slider
            v-model="style.imgMaxWidth"
            style="width: 140px"
            :min="10"
            :max="300"
            @change="
              value => {
                update('imgMaxWidth', value);
              }
            "
          />
        </div>
      </div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.maximumHeight")) }}</span>
          <el-slider
            v-model="style.imgMaxHeight"
            style="width: 140px"
            :min="10"
            :max="300"
            @change="
              value => {
                update('imgMaxHeight', value);
              }
            "
          />
        </div>
      </div>
      <!-- 图标 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.icon")) }}</div>
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.size")) }}</span>
          <el-slider
            v-model="style.iconSize"
            style="width: 200px"
            :min="12"
            :max="50"
            @change="
              value => {
                update('iconSize', value);
              }
            "
          />
        </div>
      </div>
      <!-- 二级节点外边距 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.nodeMargin")) }}</div>
      <div class="row column">
        <el-tabs v-model="marginActiveTab" class="tab" @tab-click="initMarginStyle">
          <el-tab-pane :label="transformI18n($t('baseStyle.level2Node'))" name="second" />
          <el-tab-pane :label="transformI18n($t('baseStyle.belowLevel2Node'))" name="node" />
        </el-tabs>
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.horizontal")) }}</span>
          <el-slider
            v-model="style.marginX"
            :max="200"
            style="width: 200px"
            @change="
              value => {
                updateMargin('marginX', value);
              }
            "
          />
        </div>
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.vertical")) }}</span>
          <el-slider
            v-model="style.marginY"
            :max="200"
            style="width: 200px"
            @change="
              value => {
                updateMargin('marginY', value);
              }
            "
          />
        </div>
      </div>
      <!-- 水印 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.watermark")) }}</div>
      <div class="row">
        <!-- 是否显示水印 -->
        <div class="rowItem">
          <el-checkbox v-model="watermarkConfig.show" @change="watermarkShowChange">{{
            transformI18n($t("baseStyle.showWatermark"))
          }}</el-checkbox>
        </div>
      </div>
      <template v-if="watermarkConfig.show">
        <!-- 是否仅在导出时显示 -->
        <div class="row">
          <div class="rowItem">
            <el-checkbox v-model="watermarkConfig.onlyExport" @change="updateWatermarkConfig">{{
              transformI18n($t("baseStyle.onlyExport"))
            }}</el-checkbox>
          </div>
        </div>
        <!-- 水印文字 -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ transformI18n($t("baseStyle.watermarkText")) }}</span>
            <el-input v-model="watermarkConfig.text" size="small" @change="updateWatermarkConfig" @keydown.stop />
          </div>
        </div>
        <!-- 水印文字颜色 -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ transformI18n($t("baseStyle.watermarkTextColor")) }}</span>
            <span v-popover:popover3 class="block" :style="{ backgroundColor: watermarkConfig.textStyle.color }" />
            <el-popover ref="popover3" placement="bottom" trigger="click">
              <Color
                :color="watermarkConfig.textStyle.color"
                @change="
                  value => {
                    watermarkConfig.textStyle.color = value;
                    updateWatermarkConfig();
                  }
                "
              />
            </el-popover>
          </div>
        </div>
        <!-- 水印文字透明度 -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ transformI18n($t("baseStyle.watermarkTextOpacity")) }}</span>
            <el-slider
              v-model="watermarkConfig.textStyle.opacity"
              style="width: 170px"
              :min="0"
              :max="1"
              :step="0.1"
              @change="updateWatermarkConfig"
            />
          </div>
        </div>
        <!-- 水印文字字号 -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ transformI18n($t("baseStyle.watermarkTextFontSize")) }}</span>
            <el-input-number
              v-model="watermarkConfig.textStyle.fontSize"
              size="small"
              :min="0"
              :max="50"
              :step="1"
              @change="updateWatermarkConfig"
              @keydown.stop
            />
          </div>
        </div>
        <!-- 旋转角度 -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ transformI18n($t("baseStyle.watermarkAngle")) }}</span>
            <el-input-number
              v-model="watermarkConfig.angle"
              size="small"
              :min="0"
              :max="90"
              :step="10"
              @change="updateWatermarkConfig"
              @keydown.stop
            />
          </div>
        </div>
        <!-- 水印行间距 -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ transformI18n($t("baseStyle.watermarkLineSpacing")) }}</span>
            <el-input-number
              v-model="watermarkConfig.lineSpacing"
              size="small"
              :step="10"
              @change="updateWatermarkConfig"
              @keydown.stop
            />
          </div>
        </div>
        <!-- 水印文字间距 -->
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ transformI18n($t("baseStyle.watermarkTextSpacing")) }}</span>
            <el-input-number
              v-model="watermarkConfig.textSpacing"
              size="small"
              :step="10"
              @change="updateWatermarkConfig"
              @keydown.stop
            />
          </div>
        </div>
      </template>
      <!-- 其他配置 -->
      <div class="title noTop">{{ transformI18n($t("baseStyle.otherConfig")) }}</div>
      <!-- 配置开启自由拖拽 -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox
            v-model="config.enableFreeDrag"
            @change="
              value => {
                updateOtherConfig('enableFreeDrag', value);
              }
            "
            >{{ transformI18n($t("baseStyle.enableFreeDrag")) }}</el-checkbox
          >
        </div>
      </div>
      <!-- 配置是否启用富文本编辑 -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox v-model="enableNodeRichText" @change="enableNodeRichTextChange">{{
            transformI18n($t("baseStyle.isEnableNodeRichText"))
          }}</el-checkbox>
        </div>
      </div>
      <!-- 配置鼠标滚轮行为 -->
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.mousewheelAction")) }}</span>
          <el-select
            v-model="config.mousewheelAction"
            size="small"
            style="width: 120px"
            placeholder=""
            @change="
              value => {
                updateOtherConfig('mousewheelAction', value);
              }
            "
          >
            <el-option :label="transformI18n($t('baseStyle.zoomView'))" value="zoom" />
            <el-option :label="transformI18n($t('baseStyle.moveViewUpDown'))" value="move" />
          </el-select>
        </div>
      </div>
      <!-- 配置鼠标缩放行为 -->
      <div v-if="config.mousewheelAction === 'zoom'" class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.mousewheelZoomActionReverse")) }}</span>
          <el-select
            v-model="config.mousewheelZoomActionReverse"
            size="small"
            style="width: 120px"
            placeholder=""
            @change="
              value => {
                updateOtherConfig('mousewheelZoomActionReverse', value);
              }
            "
          >
            <el-option :label="transformI18n($t('baseStyle.mousewheelZoomActionReverse1'))" :value="false" />
            <el-option :label="transformI18n($t('baseStyle.mousewheelZoomActionReverse2'))" :value="true" />
          </el-select>
        </div>
      </div>
      <!-- 配置创建新节点时的行为 -->
      <div class="row">
        <div class="rowItem">
          <span class="name">{{ transformI18n($t("baseStyle.createNewNodeBehavior")) }}</span>
          <el-select
            v-model="config.createNewNodeBehavior"
            size="small"
            style="width: 120px"
            placeholder=""
            @change="
              value => {
                updateOtherConfig('createNewNodeBehavior', value);
              }
            "
          >
            <el-option :label="transformI18n($t('baseStyle.default'))" value="default" />
            <el-option :label="transformI18n($t('baseStyle.notActive'))" value="notActive" />
            <el-option :label="transformI18n($t('baseStyle.activeOnly'))" value="activeOnly" />
          </el-select>
        </div>
      </div>
      <!-- 是否显示滚动条 -->
      <div class="row">
        <div class="rowItem">
          <el-checkbox v-model="localConfigs.isShowScrollbar" @change="updateLocalConfig('isShowScrollbar', $event)">{{
            transformI18n($t("baseStyle.isShowScrollbar"))
          }}</el-checkbox>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<style lang="scss" scoped>
.sidebarContent {
  padding: 20px;
  padding-top: 10px;

  &.isDark {
    .title {
      color: #fff;
    }

    .row {
      .rowItem {
        .name {
          color: hsl(0deg 0% 100% / 60%);
        }
      }
    }
  }

  .title {
    margin-top: 20px;
    margin-bottom: 10px;
    font-family: PingFangSC-Medium, "PingFang SC", sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: rgb(26 26 26 / 90%);

    &.noTop {
      margin-top: 0;
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    &.column {
      flex-direction: column;
    }

    .tab {
      width: 100%;
    }

    .imgUpload {
      margin-bottom: 5px;
    }

    .btnGroup {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .rowItem {
      display: flex;
      align-items: center;
      margin-bottom: 5px;

      .name {
        margin-right: 10px;
        font-size: 12px;
        white-space: nowrap;
      }

      .block {
        display: inline-block;
        width: 30px;
        height: 30px;
        cursor: pointer;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
      }
    }

    .styleBtn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 30px;
      font-weight: bold;
      cursor: pointer;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 4px;

      &.actived {
        background-color: #eee;
      }

      .colorShow {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 2px;
      }
    }
  }
}

.borderLine {
  display: inline-block;
  width: 100%;
  background-color: #000;

  &.isDark {
    background-color: #fff;
  }
}
</style>
<style lang="scss">
.el-select-dropdown__item.selected {
  .borderLine {
    background-color: #409eff;
  }
}

.lineStyleOption {
  &.isDark {
    svg {
      path {
        stroke: #fff;
      }
    }
  }

  &.isSelected {
    svg {
      path {
        stroke: #409eff;
      }
    }
  }

  svg {
    margin-top: 4px;

    path {
      stroke: #000;
    }
  }
}
</style>
