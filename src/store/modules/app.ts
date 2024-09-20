import type { appType } from "./types";
import { store } from "@/store";
import { defineStore } from "pinia";
import { getConfig, PLATFORM_PREFIX } from "@/config";
import { deviceDetection, storageLocal } from "@pureadmin/utils";

export const useAppStore = defineStore({
  id: "pure-app",
  state: (): appType => ({
    sidebar: {
      opened: storageLocal().getItem<StorageConfigs>(`${PLATFORM_PREFIX}layout`)?.sidebarStatus ?? getConfig().SidebarStatus,
      withoutAnimation: false,
      isClickCollapse: false
    },
    // 这里的layout用于监听容器拖拉后恢复对应的导航模式
    layout: (storageLocal().getItem<StorageConfigs>(`${PLATFORM_PREFIX}layout`)?.layout ?? getConfig().Layout) as Layout,
    device: deviceDetection() ? "mobile" : "desktop",
    // 作用于 src/views/components/draggable/index.vue 页面，当离开页面并不会销毁 new Swap()，sortablejs 官网也没有提供任何销毁的 api
    sortSwap: false,
    contentFullScreen:
      storageLocal().getItem<StorageConfigs>(`${PLATFORM_PREFIX}layout`)?.contentFullScreen ?? getConfig().ContentFullScreen,
    // 左侧混合模式固定子菜单
    leftMixNavFixed:
      storageLocal().getItem<StorageConfigs>(`${PLATFORM_PREFIX}layout`)?.leftMixNavFixed ?? getConfig().LeftMixNavFixed
  }),
  getters: {
    getSidebarStatus(state) {
      return state.sidebar.opened;
    },
    getDevice(state) {
      return state.device;
    }
  },
  actions: {
    setSortSwap(val) {
      this.sortSwap = val;
    },
    setLayout(layout) {
      this.layout = layout;
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleSideBar(opened?: boolean, resize?: string) {
      this.TOGGLE_SIDEBAR(opened, resize);
    },
    toggleContentFullScreen(flag?: boolean) {
      this.SET_LOCAL_LAYOUT("contentFullScreen", flag);
    },
    toggleLeftMixSubMenuFixed(fixed?: boolean) {
      this.SET_LOCAL_LAYOUT("leftMixNavFixed", fixed);
    },
    TOGGLE_SIDEBAR(opened?: boolean, resize?: string) {
      const layout = storageLocal().getItem<StorageConfigs>(`${PLATFORM_PREFIX}layout`);
      if (opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = true;
        layout.sidebarStatus = true;
      } else if (!opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = false;
        layout.sidebarStatus = false;
      } else if (!opened && !resize) {
        this.sidebar.withoutAnimation = false;
        this.sidebar.opened = !this.sidebar.opened;
        this.sidebar.isClickCollapse = !this.sidebar.opened;
        layout.sidebarStatus = this.sidebar.opened;
      }
      storageLocal().setItem(`${PLATFORM_PREFIX}layout`, layout);
    },
    SET_LOCAL_LAYOUT(key: string, data: any) {
      const layout = storageLocal().getItem<StorageConfigs>(`${PLATFORM_PREFIX}layout`);
      layout[key] = data;
      this[key] = data;
      storageLocal().setItem(`${PLATFORM_PREFIX}layout`, layout);
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
