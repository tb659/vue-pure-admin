import type { routeMetaType } from "../types";
import { storeToRefs } from "pinia";
import { getConfig } from "@/config";
import { msg } from "@/utils/message";
import { useRouter } from "vue-router";
import { emitter } from "@/utils/mitt";
import userAvatar from "@/assets/user.jpg";
import { getTopMenu } from "@/router/utils";
import { userApi } from "@/api/system/user";
import { FormInstance } from "element-plus";
import { useGlobal } from "@pureadmin/utils";
import { required } from "@/utils/validator";
import { transformI18n } from "@/plugins/i18n";
import { router, remainingPaths } from "@/router";
import { useAppStoreHook } from "@/store/modules/app";
import { useUserStoreHook } from "@/store/modules/user";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { computed, type CSSProperties, ref, reactive, nextTick } from "vue";

const errorInfo = "当前路由配置不正确，请检查配置";

export function useNav() {
  const pureApp = useAppStoreHook();
  const routers = useRouter().options.routes;
  const { wholeMenus } = storeToRefs(usePermissionStoreHook());
  /** 平台`layout`中所有`el-tooltip`的`effect`配置，默认`light` */
  const tooltipEffect = getConfig()?.TooltipEffect ?? "light";

  const getDivStyle = computed((): CSSProperties => {
    return {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden"
    };
  });

  const getSubTextStyle = computed((): CSSProperties => {
    if (!isCollapse.value) {
      return {
        width: "210px",
        display: "inline-block",
        overflow: "hidden",
        textOverflow: "ellipsis"
      };
    } else {
      return {
        width: ""
      };
    }
  });

  /** 用户名 */
  const username = computed(() => {
    return useUserStoreHook()?.username;
  });

  /** 设置国际化选中后的样式 */
  const getDropdownItemStyle = computed(() => {
    return (locale, t) => {
      return {
        background: locale === t ? useEpThemeStoreHook().epThemeColor : "",
        color: locale === t ? "#f4f4f5" : "#000"
      };
    };
  });

  const getDropdownItemClass = computed(() => {
    return (locale, t) => {
      return locale === t ? "" : "dark:hover:!text-primary";
    };
  });

  const avatarsStyle = computed(() => {
    return username.value ? { marginRight: "10px" } : "";
  });

  const isCollapse = computed(() => {
    return !pureApp.getSidebarStatus;
  });

  const device = computed(() => {
    return pureApp.getDevice;
  });

  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();
  const layout = computed(() => {
    return $storage?.layout?.layout;
  });

  const title = computed(() => {
    return $config.Title;
  });

  const ruleFormRef = ref<FormInstance>();

  const passwordVisible = ref(false);

  const passwordLoading = ref(false);

  const rules = reactive({
    newPassword: [required(), { validator: newPassword, trigger: "blur" }],
    oldPassword: [required(), { validator: oldPassword, trigger: "blur" }]
  });
  interface RuleForm {
    oldPassword: string;
    newPassword: string;
  }
  const ruleForm = reactive<RuleForm>({
    oldPassword: "", // 旧密码
    newPassword: "" // 新密码
  });

  // 存放菜单是否存在showTooltip属性标识
  const hoverMenuMap = new WeakMap();
  // 存储菜单文本dom元素
  const menuTextRef = ref(null);

  function hoverMenu(key) {
    // 如果当前菜单showTooltip属性已存在，退出计算
    if (hoverMenuMap.get(key)) return;

    nextTick(() => {
      // 如果文本内容的整体宽度大于其可视宽度，则文本溢出
      menuTextRef.value?.scrollWidth > menuTextRef.value?.clientWidth
        ? Object.assign(key, {
            showTooltip: true
          })
        : Object.assign(key, {
            showTooltip: false
          });
      hoverMenuMap.set(key, true);
    });
  }

  /** 动态title */
  function changeTitle(meta: routeMetaType) {
    const Title = getConfig().Title;
    if (Title) document.title = `${transformI18n(meta.title)} | ${Title}`;
    else document.title = transformI18n(meta.title);
  }

  /** 退出登录 */
  function logout() {
    useUserStoreHook().logOut();
  }

  function backTopMenu() {
    router.push(getTopMenu()?.path);
  }

  function onPanel() {
    emitter.emit("openPanel");
  }

  function toggleSideBar() {
    pureApp.toggleSideBar();
  }

  function handleResize(menuRef) {
    menuRef?.handleResize();
  }

  function resolvePath(route) {
    if (!route.children) return console.error(errorInfo);
    const httpReg = /^http(s?):\/\//;
    const routeChildPath = route.children[0]?.path;
    if (httpReg.test(routeChildPath)) {
      return route.path + "/" + routeChildPath;
    } else {
      return routeChildPath;
    }
  }

  function menuSelect(indexPath: string, routers): void {
    if (wholeMenus.value.length === 0) return;
    if (isRemaining(indexPath)) return;
    let parentPath = "";
    const parentPathIndex = indexPath.lastIndexOf("/");
    if (parentPathIndex > 0) {
      parentPath = indexPath.slice(0, parentPathIndex);
    }
    /** 找到当前路由的信息 */
    function findCurrentRoute(indexPath: string, routes) {
      if (!routes) return console.error(errorInfo);
      return routes.map(item => {
        if (item.path === indexPath) {
          if (item.redirect) {
            findCurrentRoute(item.redirect, item.children);
          } else {
            /** 切换左侧菜单 通知标签页 */
            emitter.emit("changLayoutRoute", { indexPath, parentPath });
          }
        } else {
          if (item.children) findCurrentRoute(indexPath, item.children);
        }
      });
    }
    findCurrentRoute(indexPath, routers);
  }

  /** 判断路径是否参与菜单 */
  function isRemaining(path: string) {
    return remainingPaths.includes(path);
  }

  // 旧密码
  function newPassword(rule: any, value: string, callback: Function) {
    if (value === "") {
      callback(new Error("请输入新密码"));
    } else {
      callback();
    }
  }

  // 新密码
  function oldPassword(rule: any, value: string, callback: Function) {
    if (value === "") {
      callback(new Error("请输入旧密码"));
    } else {
      callback();
    }
  }

  function resetForm() {
    ruleFormRef.value.resetFields();
  }

  function passwordSubmit() {
    ruleFormRef.value.validate(valid => {
      if (valid) {
        passwordLoading.value = true;
        userApi
          .updatePassword(ruleForm)
          .then(() => {
            passwordLoading.value = false;
            msg.success("修改成功，请重新登录");
            setTimeout(() => {
              logout();
            }, 500);
          })
          .finally(() => {
            passwordLoading.value = false;
          });
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }

  /** 左侧菜单折叠后，当菜单没有图标时只显示第一个文字并加上省略号 */
  function overflowSlice(text, item?: any) {
    const newText = (text?.length > 1 ? text.toString().slice(0, 1) : text) + "...";
    if (item && !(isCollapse.value && item?.parentId === null)) {
      return layout.value === "topMix" && item?.pathList?.length === 2 && isCollapse.value ? newText : text;
    }
    return newText;
  }

  return {
    title,
    device,
    layout,
    logout,
    routers,
    $storage,
    backTopMenu,
    onPanel,
    getDivStyle,
    getSubTextStyle,
    changeTitle,
    toggleSideBar,
    menuSelect,
    handleResize,
    resolvePath,
    isCollapse,
    pureApp,
    username,
    userAvatar,
    avatarsStyle,
    tooltipEffect,
    getDropdownItemStyle,
    getDropdownItemClass,

    rules,
    ruleForm,
    resetForm,
    ruleFormRef,
    passwordSubmit,
    passwordLoading,
    passwordVisible,

    overflowSlice,
    menuTextRef,
    hoverMenu
  };
}
