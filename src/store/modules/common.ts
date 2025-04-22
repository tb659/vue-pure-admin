import { defineStore } from "pinia";
import {
  type CommonStore,
  type CommonType,
  type GoLastPageType,
  store,
  responsiveStorageNameSpace,
  STATUS_TYPE,
  msg,
  router,
} from "../utils";

// 延迟创建 store，等待配置加载完成
let commonStore: ReturnType<typeof defineStore>;

export const useCommonStore = () => {
  if (!commonStore) {
    commonStore = defineStore(`${responsiveStorageNameSpace()}store_common`, {
      state: (): CommonType => ({
        dictList: [],
        fileSizeLimit: "",
      }),
      actions: {
        /** 登入 */
        init() {
          console.log("初始化");
          // 获取字典
          this.getDict();
        },
        /**
         * @description: 获取字典
         * @return {*}
         */
        async getDict() {
          // 动态引入 dictApi
          const { dictApi } = await import("@/api/system/dict");
          const { data } = await dictApi.list<DictData[]>({ status: STATUS_TYPE.ENABLED_V });
          data?.length &&
            (this.dictList = data.reverse().map(item => ({ ...item, label: item.name, value: item.code, _value: item.value })));
          // 获取字典文件上传大小
          this.getFileSizeLimit();
        },
        /**
         * @description: 获取字典文件上传大小
         * @return {*}
         */
        getFileSizeLimit() {
          const dictItem = this.dictList.filter(dict => dict.value === "file_size_limit")[0];
          dictItem && this.setFileSizeLimit(dictItem.value);
        },
        setFileSizeLimit(size) {
          this.fileSizeLimit = size;
        },
        /**
         * @description 返回上一页
         * @info 询问文本
         * @isConfirm 是否含有询问确认框
         * @closeTab 关闭浏览器页签
         * @reload 刷新上个页签
         */
        goLastPage(data: GoLastPageType = {}) {
          const {
            info = "确认离开当前页面吗，离开页面将不会保留你所做的更改",
            isConfirm = false,
            // reload = false,
            closeTab = false,
          } = data;

          if (isConfirm) {
            msg.confirm(info, "提示", {
              type: "warning",
              confirmBack: () => replacePage(),
              cancelBack: () => msg.info("取消离开页面"),
            });
          } else {
            replacePage();
          }
          function replacePage() {
            // 刷新列表
            // if (reload && closeTab) window.opener.location.reload();
            // 关闭浏览器页签
            if (closeTab) return window.close();

            router.go(-1);
          }
        },
      },
      persist: {
        pick: ["dictList", "fileSizeLimit"],
      },
    });
  }
  return commonStore(store) as unknown as CommonStore;
};

export function useCommonStoreHook() {
  return useCommonStore();
}
