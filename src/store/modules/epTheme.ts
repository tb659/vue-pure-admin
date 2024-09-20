import { store } from "@/store";
import { defineStore } from "pinia";
import { storageLocal } from "@pureadmin/utils";
import { getConfig, PLATFORM_PREFIX } from "@/config";

export const useEpThemeStore = defineStore({
  id: "pure-epTheme",
  state: () => ({
    epThemeColor: storageLocal().getItem<StorageConfigs>(`${PLATFORM_PREFIX}layout`)?.epThemeColor ?? getConfig().EpThemeColor,
    epTheme: storageLocal().getItem<StorageConfigs>(`${PLATFORM_PREFIX}layout`)?.theme ?? getConfig().Theme
  }),
  getters: {
    getEpThemeColor(state) {
      return state.epThemeColor;
    },
    /** 用于mix导航模式下hamburger-svg的fill属性 */
    fill(state) {
      if (state.epTheme === "light") {
        return "#409eff";
      } else if (state.epTheme === "yellow") {
        return "#d25f00";
      } else {
        return "#fff";
      }
    }
  },
  actions: {
    setEpThemeColor(newColor: string): void {
      const layout = storageLocal().getItem<StorageConfigs>(`${PLATFORM_PREFIX}layout`);
      this.epTheme = layout?.theme;
      this.epThemeColor = newColor;
      if (!layout) return;
      layout.epThemeColor = newColor;
      storageLocal().setItem(`${PLATFORM_PREFIX}layout`, layout);
    }
  }
});

export function useEpThemeStoreHook() {
  return useEpThemeStore(store);
}
