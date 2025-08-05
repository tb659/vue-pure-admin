<script setup lang="ts">
/**
 * @Desc: 节点样式设置
 */
import Sidebar from "./Sidebar.vue";
import Color from "./Color.vue";
import { computed, onBeforeMount, onBeforeUnmount, ref, watch, nextTick } from "vue";
import { emitter } from "@/utils/mitt";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { useI18n } from "vue-i18n";
import {
  fontFamilyList,
  fontSizeList,
  borderWidthList,
  borderDasharrayList,
  borderRadiusList,
  lineHeightList,
  shapeList,
  shapeListMap,
} from "../config";

defineOptions({
  name: "NodeStyle",
});

const { locale } = useI18n();
const sidebar = ref(null);
const activeNodes = ref([]);
const style = ref({
  shape: "",
  paddingX: 0,
  paddingY: 0,
  color: "",
  fontFamily: "",
  fontSize: "",
  lineHeight: "",
  textDecoration: "",
  fontWeight: "",
  fontStyle: "",
  borderWidth: "",
  borderColor: "",
  fillColor: "",
  borderDasharray: "",
  borderRadius: "",
  lineColor: "",
  lineDasharray: "",
  lineWidth: "",
  gradientStyle: false,
  startColor: "",
  endColor: "",
});

const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const fontFamilyListData = computed(() => fontFamilyList[locale] || fontFamilyList.zh);
const borderDasharrayListData = computed(() => borderDasharrayList[locale] || borderDasharrayList.zh);
const shapeListData = computed(() => shapeList[locale] || shapeList.zh);
const shapeListMapData = computed(() => shapeListMap[locale] || shapeListMap.zh);

watch(
  () => activeSidebar.value,
  val => {
    if (!sidebar.value) return;
    sidebar.value.show = val === "nodeStyle";
  },
  { immediate: true },
);

/**
 * @Desc: 监听节点激活事件
 */
function onNodeActive(...args) {
  // if (sidebar.value) sidebar.value.show = false
  nextTick(() => {
    activeNodes.value = [...args[0][1]];
    // if (sidebar.value) sidebar.value.show = activeNodes.value.length > 0
    initNodeStyle();
  });
}

/**
 * @Desc: 初始节点样式
 */
function initNodeStyle() {
  if (activeNodes.value.length <= 0) {
    return;
  }
  [
    "shape",
    "paddingX",
    "paddingY",
    "color",
    "fontFamily",
    "fontSize",
    "lineHeight",
    "textDecoration",
    "fontWeight",
    "fontStyle",
    "borderWidth",
    "borderColor",
    "fillColor",
    "borderDasharray",
    "borderRadius",
    "lineColor",
    "lineDasharray",
    "lineWidth",
    "gradientStyle",
    "startColor",
    "endColor",
  ].forEach(item => {
    style.value[item] = activeNodes.value[0].getStyle(item, false);
  });
}

/**
 * @Desc: 修改样式
 */
function update(prop) {
  activeNodes.value.forEach(node => {
    node.setStyle(prop, style.value[prop]);
  });
}

/**
 * @Desc: 切换加粗样式
 */
function toggleFontWeight() {
  if (style.value.fontWeight === "bold") {
    style.value.fontWeight = "normal";
  } else {
    style.value.fontWeight = "bold";
  }
  update("fontWeight");
}

/**
 * @Desc: 切换字体样式
 */
function toggleFontStyle() {
  if (style.value.fontStyle === "italic") {
    style.value.fontStyle = "normal";
  } else {
    style.value.fontStyle = "italic";
  }
  update("fontStyle");
}

/**
 * @Desc: 修改字体颜色
 */
function changeFontColor(color) {
  style.value.color = color;
  update("color");
}

/**
 * @Desc: 修改边框颜色
 */
function changeBorderColor(color) {
  style.value.borderColor = color;
  update("borderColor");
}

/**
 * @Desc: 修改线条颜色
 */
function changeLineColor(color) {
  style.value.lineColor = color;
  update("lineColor");
}

/**
 * @Desc: 修改背景颜色
 */
function changeFillColor(color) {
  style.value.fillColor = color;
  update("fillColor");
}

/**
 * @Desc: 切换渐变开始颜色
 */
function changeStartColor(color) {
  style.value.startColor = color;
  update("startColor");
}
/**
 * @Desc: 切换渐变结束颜色
 */
function changeEndColor(color) {
  style.value.endColor = color;
  update("endColor");
}

onBeforeMount(() => {
  emitter.on("node_active", onNodeActive);
});

onBeforeUnmount(() => {
  emitter.off("node_active", onNodeActive);
});
</script>
<template>
  <Sidebar ref="sidebar" :title="$t('style.title')">
    <div v-if="activeNodes.length > 0" class="styleBox" :class="{ isDark: isDark }">
      <div class="sidebarContent">
        <!-- 文字 -->
        <div class="title noTop">{{ $t("style.text") }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.fontFamily") }}</span>
            <el-select v-model="style.fontFamily" size="small" placeholder="" @change="update('fontFamily')">
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
            <span class="name">{{ $t("style.fontSize") }}</span>
            <el-select v-model="style.fontSize" size="small" style="width: 80px" placeholder="" @change="update('fontSize')">
              <el-option
                v-for="item in fontSizeList"
                :key="item"
                :label="item"
                :value="item"
                :style="{ fontSize: item + 'px' }"
              />
            </el-select>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t("style.lineHeight") }}</span>
            <el-select v-model="style.lineHeight" size="small" style="width: 80px" placeholder="" @change="update('lineHeight')">
              <el-option v-for="item in lineHeightList" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="btnGroup">
            <el-tooltip :content="$t('style.color')" placement="bottom">
              <div>
                <el-popover placement="bottom" trigger="hover">
                  <template #reference>
                    <div v-popover:popover class="styleBtn">
                      A
                      <span class="colorShow" :style="{ backgroundColor: style.color || '#eee' }" />
                    </div>
                  </template>
                  <Color :color="style.color" @change="changeFontColor" />
                </el-popover>
              </div>
            </el-tooltip>
            <el-tooltip :content="$t('style.addFontWeight')" placement="bottom">
              <div
                class="styleBtn"
                :class="{
                  actived: style.fontWeight === 'bold',
                }"
                @click="toggleFontWeight"
              >
                B
              </div>
            </el-tooltip>
            <el-tooltip :content="$t('style.italic')" placement="bottom">
              <div
                class="styleBtn i"
                :class="{
                  actived: style.fontStyle === 'italic',
                }"
                @click="toggleFontStyle"
              >
                I
              </div>
            </el-tooltip>
            <el-tooltip :content="$t('style.textDecoration')" placement="bottom">
              <div>
                <el-popover placement="bottom" trigger="hover">
                  <template #reference>
                    <div
                      class="styleBtn u"
                      :style="{
                        textDecoration: style.textDecoration || 'none',
                      }"
                    >
                      U
                    </div>
                  </template>
                  <el-radio-group v-model="style.textDecoration" size="small" @change="update('textDecoration')">
                    <el-radio-button label="none">{{ $t("style.none") }}</el-radio-button>
                    <el-radio-button label="underline">{{ $t("style.underline") }}</el-radio-button>
                    <el-radio-button label="line-through"> {{ $t("style.lineThrough") }} </el-radio-button>
                    <el-radio-button label="overline">{{ $t("style.overline") }}</el-radio-button>
                  </el-radio-group>
                </el-popover>
              </div>
            </el-tooltip>
          </div>
        </div>
        <!-- 边框 -->
        <div class="title">{{ $t("style.border") }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.color") }}</span>
            <el-popover placement="bottom" trigger="hover" width="auto">
              <template #reference>
                <span class="block" :style="{ width: '80px', backgroundColor: style.borderColor }" />
              </template>
              <Color :color="style.borderColor" @change="changeBorderColor" />
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t("style.style") }}</span>
            <el-select
              v-model="style.borderDasharray"
              size="small"
              style="width: 80px"
              placeholder=""
              @change="update('borderDasharray')"
            >
              <el-option v-for="item in borderDasharrayListData" :key="item.value" :label="item.name" :value="item.value">
                <svg width="120" height="34">
                  <line
                    x1="10"
                    y1="17"
                    x2="110"
                    y2="17"
                    stroke-width="2"
                    :stroke="style.borderDasharray === item.value ? '#409eff' : isDark ? '#fff' : '#000'"
                    :stroke-dasharray="item.value"
                  />
                </svg>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.width") }}</span>
            <el-select
              v-model="style.borderWidth"
              size="small"
              style="width: 80px"
              placeholder=""
              @change="update('borderWidth')"
            >
              <el-option v-for="item in borderWidthList" :key="item" :label="item" :value="item">
                <span v-if="item > 0" class="borderLine" :class="{ isDark: isDark }" :style="{ height: item + 'px' }" />
              </el-option>
            </el-select>
          </div>
          <div v-show="style.shape === 'rectangle'" class="rowItem">
            <span class="name">{{ $t("style.borderRadius") }}</span>
            <el-select
              v-model="style.borderRadius"
              size="small"
              style="width: 80px"
              placeholder=""
              @change="update('borderRadius')"
            >
              <el-option v-for="item in borderRadiusList" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
        <!-- 背景 -->
        <div class="title">{{ $t("style.background") }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.color") }}</span>
            <el-popover placement="bottom" trigger="hover" width="auto">
              <template #reference>
                <span class="block" :style="{ width: '80px', backgroundColor: style.fillColor }" />
              </template>
              <Color :color="style.fillColor" @change="changeFillColor" />
            </el-popover>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.gradientStyle") }}</span>
            <el-checkbox v-model="style.gradientStyle" @change="update('gradientStyle')" />
          </div>
          <div class="rowItem">
            <span class="name">{{ $t("style.startColor") }}</span>
            <el-popover placement="bottom" trigger="hover">
              <template #reference>
                <span class="block" :style="{ backgroundColor: style.startColor }" />
              </template>
              <Color :color="style.startColor" @change="changeStartColor" />
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t("style.endColor") }}</span>
            <el-popover placement="bottom" trigger="hover">
              <template #reference>
                <span class="block" :style="{ backgroundColor: style.endColor }" />
              </template>
              <Color :color="style.endColor" @change="changeEndColor" />
            </el-popover>
          </div>
        </div>
        <!-- 形状 -->
        <div class="title">{{ $t("style.shape") }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.shape") }}</span>
            <el-select v-model="style.shape" size="small" style="width: 120px" placeholder="" @change="update('shape')">
              <el-option v-for="item in shapeListData" :key="item" :label="item.name" :value="item.value">
                <svg width="60" height="26" style="margin-top: 5px">
                  <path
                    :d="shapeListMapData[item.value]"
                    fill="none"
                    :stroke="style.shape === item.value ? '#409eff' : isDark ? '#fff' : '#000'"
                    stroke-width="2"
                  />
                </svg>
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 线条 -->
        <div class="title">{{ $t("style.line") }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.color") }}</span>
            <el-popover placement="bottom" trigger="hover" width="auto">
              <template #reference>
                <span class="block" :style="{ width: '80px', backgroundColor: style.lineColor }" />
              </template>
              <Color :color="style.lineColor" @change="changeLineColor" />
            </el-popover>
          </div>
          <div class="rowItem">
            <span class="name">{{ $t("style.style") }}</span>
            <el-select
              v-model="style.lineDasharray"
              size="small"
              style="width: 80px"
              placeholder="请选择..."
              @change="update('lineDasharray')"
            >
              <el-option v-for="item in borderDasharrayListData" :key="item.value" :label="item.name" :value="item.value">
                <svg width="120" height="34">
                  <line
                    x1="10"
                    y1="17"
                    x2="110"
                    y2="17"
                    stroke-width="2"
                    :stroke="style.lineDasharray === item.value ? '#409eff' : isDark ? '#fff' : '#000'"
                    :stroke-dasharray="item.value"
                  />
                </svg>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.width") }}</span>
            <el-select
              v-model="style.lineWidth"
              size="small"
              style="width: 80px"
              placeholder="请选择..."
              @change="update('lineWidth')"
            >
              <el-option v-for="item in borderWidthList" :key="item" :label="item" :value="item">
                <span v-if="item > 0" class="borderLine" :class="{ isDark: isDark }" :style="{ height: item + 'px' }" />
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 节点内边距 -->
        <div class="title noTop">{{ $t("style.nodePadding") }}</div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.horizontal") }}</span>
            <el-slider v-model="style.paddingX" style="width: 200px" @change="update('paddingX')" />
          </div>
        </div>
        <div class="row">
          <div class="rowItem">
            <span class="name">{{ $t("style.vertical") }}</span>
            <el-slider v-model="style.paddingY" style="width: 200px" @change="update('paddingY')" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="tipBox">
      <div class="tipIcon iconfont icontianjiazijiedian" />
      <div class="tipText">请选择一个节点</div>
    </div>
  </Sidebar>
</template>

<style lang="scss" scoped>
.styleBox {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &.isDark {
    .sidebarContent {
      .title {
        color: #fff;
      }

      .row {
        .rowItem {
          .name {
            color: hsl(0deg 0% 100% / 60%);
          }
        }

        .styleBtn {
          color: hsl(0deg 0% 100% / 60%);
          background-color: #363b3f;
          border-color: hsl(0deg 0% 100% / 10%);
        }
      }
    }
  }

  .tab {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 0 20px;
  }
}

.tipBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #666;

  .tipIcon {
    font-size: 100px;
  }
}

.sidebarContent {
  padding: 20px;
  padding-top: 10px;

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

    .btnGroup {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .rowItem {
      display: flex;
      align-items: center;

      .name {
        margin-right: 10px;
        font-size: 12px;
      }

      .block {
        display: inline-block;
        width: 30px;
        height: 30px;
        cursor: pointer;
        border: 1px solid #dcdfe6;
        border-radius: 4px;

        &.disabled {
          color: #c0c4cc !important;
          cursor: not-allowed !important;
          background-color: #f5f7fa !important;
          border-color: #e4e7ed !important;
        }
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

      &.disabled {
        color: #c0c4cc !important;
        cursor: not-allowed !important;
        background-color: #f5f7fa !important;
        border-color: #e4e7ed !important;
      }

      &.i {
        font-style: italic;
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
</style>
