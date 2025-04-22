import { defineStore } from "pinia";
import { useMultiTagsStoreHook } from "./multiTags";
import {
  type PermissionStore,
  type CacheType,
  store,
  debounce,
  ascending,
  getKeyList,
  constantMenus,
  filterShowLinkTree,
  filterNoPermissionTree,
  formatFlatteningRoutes,
  responsiveStorageNameSpace,
} from "../utils";

// 延迟创建 store，等待配置加载完成
let permissionStore: ReturnType<typeof defineStore>;

export const usePermissionStore = () => {
  if (!permissionStore) {
    permissionStore = defineStore(`${responsiveStorageNameSpace()}store_permission`, {
      state: () => ({
        // 静态路由生成的菜单
        constantMenus,
        // 整体路由生成的菜单（静态、动态）
        wholeMenus: [],
        // 整体路由（一维数组格式）
        flatteningRoutes: [],
        // 缓存页面keepAlive
        cachePageList: [],
      }),
      actions: {
        /** 组装整体路由生成的菜单 */
        handleWholeMenus(routes: any[]) {
          this.wholeMenus = filterNoPermissionTree(filterShowLinkTree(ascending(this.constantMenus.concat(routes))));
          this.flatteningRoutes = formatFlatteningRoutes(this.constantMenus.concat(routes) as any);
        },
        cacheOperate({ mode, name }: CacheType) {
          const delIndex = this.cachePageList.findIndex(v => v === name);
          switch (mode) {
            case "refresh":
              this.cachePageList = this.cachePageList.filter(v => v !== name);
              break;
            case "add":
              this.cachePageList.push(name);
              break;
            case "delete":
              delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
              break;
          }
          /** 监听缓存页面是否存在于标签页，不存在则删除 */
          debounce(() => {
            let cacheLength = this.cachePageList.length;
            const nameList = getKeyList(useMultiTagsStoreHook().multiTags, "name");
            while (cacheLength > 0) {
              nameList.findIndex(v => v === this.cachePageList[cacheLength - 1]) === -1 &&
                this.cachePageList.splice(this.cachePageList.indexOf(this.cachePageList[cacheLength - 1]), 1);
              cacheLength--;
            }
          })();
        },
        /** 清空缓存页面 */
        clearAllCachePage() {
          this.wholeMenus = [];
          this.cachePageList = [];
        },
      },
      persist: {
        pick: ["constantMenus", "wholeMenus", "flatteningRoutes", "cachePageList"],
      },
    });
  }
  return permissionStore(store) as unknown as PermissionStore;
};

export function usePermissionStoreHook() {
  return usePermissionStore();
}
