import { storeToRefs } from "pinia";
import { getConfig } from "@/config";
import { msg } from "@/utils/message";
import { useRouter } from "vue-router";
import { emitter } from "@/utils/mitt";
import { routeMetaType } from "../types";
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
import { computed, type CSSProperties, ref, reactive } from "vue";
import { usePermissionStoreHook } from "@/store/modules/permission";

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

  function menuSelect(indexPath: string) {
    if (wholeMenus.value.length === 0 || isRemaining(indexPath)) return;
    emitter.emit("changLayoutRoute", indexPath);
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
    passwordVisible
  };
}
