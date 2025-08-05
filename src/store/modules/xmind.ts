import exampleData from "simple-mind-map/example/exampleData";
import { type xmindType, store, responsiveStorageNameSpace } from "../utils";
import { defineStore } from "pinia";

import { storeLocalConfig } from "@/api/xmind";

export const useXmindStore = defineStore(`${responsiveStorageNameSpace()}store_xmind`, {
  state: (): xmindType => ({
    mindMapData: null, // 思维导图数据
    isHandleLocalFile: false, // 是否操作的是本地文件
    localConfig: {
      // 本地配置
      isZenMode: false, // 是否是禅模式
      openNodeRichText: true, // 是否开启节点富文本
      useLeftKeySelectionRightKeyDrag: false, // 鼠标行为
      isShowScrollbar: false, // 是否显示滚动条
      mousewheelAction: "", // 鼠标滚轮动作
      mousewheelZoomActionReverse: false, // 鼠标滚轮动作反向
    },
    activeSidebar: "", // 当前显示的侧边栏
    isDark: false, // 是否是暗黑模式
    isOutlineEdit: false, // 是否是大纲编辑模式
    isReadonly: true, // 是否只读
  }),
  getters: {
    getMindMapData(state) {
      return state.mindMapData;
    },
    getLocalConfig(state) {
      return state.localConfig;
    },
    getIsDark(state) {
      return state.isDark;
    },
    getActiveSidebar(state) {
      return state.activeSidebar;
    },
    getIsHandleLocalFile(state) {
      return state.isHandleLocalFile;
    },
    getIsReadonly(state) {
      return state.isReadonly;
    },
    getIsOutlineEdit(state) {
      return state.isOutlineEdit;
    },
  },
  actions: {
    /**
     * @Desc: 设置思维导图数据
     */
    setMindMapData(data) {
      this.mindMapData = data;
    },
    /**
     * @Desc: 设置操作本地文件标志位
     */
    setIsHandleLocalFile(data) {
      this.isHandleLocalFile = data;
    },
    /**
     * @Desc: 设置本地配置
     */
    setLocalConfig(data) {
      this.localConfig = {
        ...this.localConfig,
        ...data,
      };
      storeLocalConfig(this.localConfig);
    },
    /**
     * @Desc: 设置当前显示的侧边栏
     */
    setActiveSidebar(data) {
      this.activeSidebar = data;
    },
    /**
     * @Desc: 设置暗黑模式
     */
    setIsDark(data) {
      this.isDark = data;
    },
    /**
     * @Desc: 设置大纲编辑模式
     */
    setIsOutlineEdit(data) {
      this.isOutlineEdit = data;
    },
    // 设置是否只读
    setIsReadonly(data) {
      this.isReadonly = data;
    },
    /**
     * @Desc: 设置初始思维导图数据
     */
    getUserMindMapData() {
      try {
        const { data } = {
          data: {
            data: {
              mindMapData: exampleData,
            },
          },
        };
        this.mindMapData = data.data.mindMapData;
      } catch (error) {
        console.log(error);
      }
    },
  },
  persist: {
    pick: ["mindMapData", "isHandleLocalFile", "localConfig", "activeSidebar", "isDark", "isOutlineEdit", "isReadonly"],
  },
});

export function useXmindStoreHook() {
  return useXmindStore(store);
}
