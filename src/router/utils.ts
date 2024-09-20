import type { menuType } from "@/layout/types";
import type { MenuData } from "@/api/system/menu/types";
import { router } from "./index";
import { isProxy, toRaw } from "vue";
import { msg } from "@/utils/message";
import { MENU_TYPE } from "@/utils/common";
import { useTimeoutFn } from "@vueuse/core";
import { menuApi } from "@/api/system/menu";
import { useUserStoreHook } from "@/store/modules/user";
import { buildHierarchyTree, listToTree } from "@/utils/tree";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { RouterHistory, RouteRecordRaw, RouteComponent, createWebHistory, createWebHashHistory } from "vue-router";
import { isString, cloneDeep, isAllEmpty, storageLocal, isIncludeAllChildren, intersection } from "@pureadmin/utils";
import { getConfig, USER_INFO, PLATFORM_PREFIX, USER_MENU_LIST_KEY, PAGE_BUTTON_PERMISSION_KEY } from "@/config";

const Layout = () => import("@/layout/index.vue");
const IFrame = () => import("@/layout/frameView.vue");
const ParentView = () => import("@/layout/parentView.vue");

// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/**/*.{vue,tsx}");

/** 初始化路由（`new Promise` 写法防止在异步请求中造成无限循环）*/
async function initRouter() {
  // !如果开启缓存 后台禁用某个菜单后，前端登录拿缓存 造成菜单显示和后台不一致
  if (getConfig()?.CachingAsyncRoutes) {
    // 开启动态路由缓存本地localStorage
    const key = PLATFORM_PREFIX + "async-routes";
    let asyncRouteList = storageLocal().getItem(key) as any;
    if (asyncRouteList && asyncRouteList?.length > 0) {
      return new Promise(resolve => {
        asyncRouteList = formatMenuData(asyncRouteList);
        handleAsyncRoutes(asyncRouteList);
        resolve(router);
      });
    } else {
      return await getMenuList(data => storageLocal().setItem(key, data));
    }
  } else {
    return await getMenuList();
  }
}

/** 处理菜单请求 */
async function getMenuList(fn?: Function) {
  return await new Promise(resolve => {
    menuApi.list<MenuData[]>({}).then(({ data }) => {
      data.forEach(item => (item.menuId = item.id));
      data = formatMenuData(data);
      handleAsyncRoutes(data);
      fn && fn(data);
      resolve(router);
    });
  });
}

/** 处理菜单note字段 filterUser:是否过滤用户权限菜单 */
function formatMenuData(menus: MenuData[], filterUser = true) {
  const result = [];
  const list = filterUser ? filterUserAuthMenu(menus) : menus;
  list.forEach(menu => {
    const menuItem = { ...menu } as MenuData;
    try {
      const data = JSON.parse(menu.note);
      const { meta } = data;
      menuItem.note = data.note;
      menuItem.path = data.path;
      menuItem.cname = data.cname;
      menuItem.redirect = data.redirect;
      menuItem.component = data.component || "";
      menuItem.frameType = data.frameType;
      menuItem.meta = {
        ...meta,
        icon: meta.icon || "",
        frameSrc: meta.frameSrc || "",
        showLink: meta.visible,
        rank: Number(menu.code)
      };
      result.push(menuItem);
    } catch (err) {
      console.log(err);
    }
  });
  return result;
}

/** 处理动态路由（后端返回的路由） */
function handleAsyncRoutes(routeList) {
  if (routeList.length === 0) {
    usePermissionStoreHook().handleWholeMenus(routeList);
    msg.warning("暂无权限菜单，请联系管理员");
    useUserStoreHook().logOut();
    router.replace({ path: "/login" });
  } else {
    /** 处理树形数据 */
    routeList = listToTree(routeList);
    /** 处理页面按钮权限 */
    handlePageButtonAuth(routeList);
    // 过滤按钮
    routeList = filterButtenTree(routeList, 1);
    // 过滤禁用菜单
    routeList = filterDisableTree(routeList);
    // 过滤多于字段
    routeList = filterRouteField(routeList);
    /** 规范路由 */
    routeList = addAsyncRoutes(routeList);
    formatFlatteningRoutes(routeList).map((v: RouteRecordRaw) => {
      // 防止重复添加路由
      if (router.options.routes[0].children.findIndex(value => value.path === v.path) !== -1) {
        return;
      } else {
        // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
        router.options.routes[0].children.push(v);
        // 最终路由进行升序
        ascending(router.options.routes[0].children);
        if (!router.hasRoute(v?.name)) router.addRoute(v);
        const flattenRouters: any = router.getRoutes().find(n => n.path === "/");
        router.addRoute(flattenRouters);
      }
    });
    usePermissionStoreHook().handleWholeMenus(routeList);
  }
  addPathMatch();
}

/** 过滤后端传来的动态路由 重新生成规范路由 */
function addAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
  if (!arrRoutes || !arrRoutes.length) return;
  const modulesRoutesKeys = Object.keys(modulesRoutes);
  arrRoutes.forEach((v: RouteRecordRaw) => {
    // 将backstage属性加入meta，标识此路由为后端返回路由
    v.meta.backstage = true;
    // 父级的redirect属性取值：如果子级存在且父级的redirect属性不存在，默认取第一个子级的path；如果子级存在且父级的redirect属性存在，取存在的redirect属性，会覆盖默认值
    if (v?.children?.length && !v.redirect) v.redirect = v.children[0].path;
    // 父级的name属性取值：如果子级存在且父级的name属性不存在，默认取第一个子级的name；如果子级存在且父级的name属性存在，取存在的name属性，会覆盖默认值（注意：测试中发现父级的name不能和子级name重复，如果重复会造成重定向无效（跳转404），所以这里给父级的name起名的时候后面会自动加上`Parent`，避免重复）
    if (v?.children?.length && !v.name) v.name = (v.children[0].name as string) + "Parent";
    if (v.meta?.frameSrc) {
      v.component = IFrame;
    } else if (isString(v.component) && (v.component as String).includes("/layout")) {
      v.component = Layout;
      // delete v.component;
    } else if (isString(v.component) && (v.component as String).includes("/parent-view")) {
      v.component = ParentView;
    } else if (isString(v.component)) {
      // 过滤本地路由
      // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会跟path保持一致）
      const index = v?.component
        ? modulesRoutesKeys.findIndex(ev => ev.includes(v.component as any))
        : modulesRoutesKeys.findIndex(ev => ev.includes(v.path));
      v.component = modulesRoutes[modulesRoutesKeys[index]];
    }
    if (v?.children?.length) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
}

/** 过滤children长度为0的的目录，当目录下没有菜单时，会过滤此目录，目录没有赋予roles权限，当目录下只要有一个菜单有显示权限，那么此目录就会显示 */
function filterChildrenTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter((v: any) => v?.children?.length !== 0);
  newTree.forEach((v: { children }) => v.children && (v.children = filterVisibleTree(v.children)));
  return newTree;
}

/** 过滤用户没有权限的菜单 */
function filterUserAuthMenu(data: RouteComponent[]) {
  const userAuthMenu = storageLocal().getItem(USER_INFO)?.[USER_MENU_LIST_KEY] || [];
  return filter(data);
  function filter(data) {
    const newTree = cloneDeep(data).filter(
      (v: { menuId: number; meta }) => userAuthMenu.filter(m => v.menuId === m.id || !v.meta?.backstage).length > 0
    );
    newTree.forEach(v => v.children?.length && (v.children = filterUserAuthMenu(v.children)));
    return filterChildrenTree(newTree);
  }
}

/** 过滤按钮级别的菜单 fillterBtn = 1 过滤按钮  = 0 过滤非按钮 */
function filterButtenTree(data: RouteComponent[], fillterBtn: 1 | 0) {
  const newTree = cloneDeep(data).filter((v: { type: number }) => (fillterBtn === 1 ? v.type !== 3 : v.type === 3));
  newTree.forEach(v => v.children?.length && (v.children = filterButtenTree(v.children, fillterBtn)));
  return newTree;
}

/** 过滤菜单状态为禁用的菜单 */
function filterDisableTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter((v: any) => v.status !== 0);
  newTree.forEach(v => v.children?.length && (v.children = filterDisableTree(v.children)));
  return newTree;
}

/** 去除多于字段 */
function filterRouteField(data: RouteComponent[]) {
  const newTree = cloneDeep(data).map(v => {
    const item = {
      menuId: v.id,
      path: v.path,
      name: v.cname,
      meta: v.meta,
      redirect: v.redirect,
      component: v.component,
      children: v.children
    };
    !item.children?.length && delete item.children;
    return item;
  });
  newTree.forEach(v => v.children?.length && (v.children = filterRouteField(v.children)));
  return newTree;
}

/** 过滤meta中visible为false的菜单 */
function filterVisibleTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter((v: { meta: { showLink: boolean } }) => v.meta?.showLink !== false);
  newTree.forEach(v => v.children?.length && (v.children = filterVisibleTree(v.children)));
  return newTree;
}

/** 判断两个数组彼此是否存在相同值 */
function isOneOfArray(a: Array<string>, b: Array<string>) {
  return Array.isArray(a) && Array.isArray(b) ? (intersection(a, b).length > 0 ? true : false) : true;
}

/** 页面路由存储按钮auth */
function handlePageButtonAuth(routes: MenuData[]) {
  if (!routes || !routes.length) return;
  routes.forEach(route => {
    if (route.type === MENU_TYPE.M_V && route.children?.length) {
      let auths = [];
      // 禁用按钮过滤
      route.children.forEach(v => v.status === 1 && (auths = auths.concat(v.name || [])));
      route.meta[PAGE_BUTTON_PERMISSION_KEY] = auths;
    }
    if (route.children) {
      handlePageButtonAuth(route.children);
    }
  });
}

function addPathMatch() {
  if (!router.hasRoute("pathMatch")) {
    router.addRoute({
      path: "/:pathMatch(.*)",
      name: "pathMatch",
      redirect: "/error/404"
    });
  }
}

/** 按照路由中meta下的rank等级升序来排序路由 */
function ascending(arr: any[]) {
  arr.forEach((v, index) => {
    // 当rank不存在时，根据顺序自动创建，首页路由永远在第一位
    if (handRank(v)) v.meta.rank = index + 2;
  });
  return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
    return a?.meta.rank - b?.meta.rank;
  });
}

/** 菜单排序 */
function handRank(routeInfo: any) {
  const { name, path, parentId, meta } = routeInfo;
  return isAllEmpty(parentId)
    ? isAllEmpty(meta?.rank) || (meta?.rank === 0 && name !== "Home" && path !== "/")
      ? true
      : false
    : false;
}

/** 通过指定 `key` 获取父级路径集合，默认 `key` 为 `path` */
function getParentPaths(value: string, routes: RouteRecordRaw[], key = "path") {
  // 深度遍历查找
  function dfs(routes: RouteRecordRaw[], value: string, parents: string[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      // 返回父级path
      if (item[key] === value) return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前path入栈
      parents.push(item.path);

      if (dfs(item.children, value, parents).length) return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }

  return dfs(routes, value, []);
}

/** 查找对应 `path` 的路由信息 */
function findRouteByPath(path: string, routes: RouteRecordRaw[]) {
  let res = routes.find((item: { path: string }) => item.path == path);
  if (res) {
    return isProxy(res) ? toRaw(res) : res;
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].children instanceof Array && routes[i].children.length > 0) {
        res = findRouteByPath(path, routes[i].children);
        if (res) {
          return isProxy(res) ? toRaw(res) : res;
        }
      }
    }
    return null;
  }
}

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  let hierarchyList = buildHierarchyTree(routesList);
  for (let i = 0; i < hierarchyList.length; i++) {
    if (hierarchyList[i].children) {
      hierarchyList = hierarchyList.slice(0, i + 1).concat(hierarchyList[i].children, hierarchyList.slice(i + 1));
    }
  }
  return hierarchyList;
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/pure-admin/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === "/") {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: []
      });
    } else {
      newRoutesList[0]?.children.push({ ...v });
    }
  });
  return newRoutesList;
}

/** 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html */
function getHistoryMode(routerHistory): RouterHistory {
  // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  // no param
  if (historyMode.length === 1) {
    if (leftMode === "hash") {
      return createWebHashHistory("");
    } else if (leftMode === "h5") {
      return createWebHistory("");
    }
  } //has param
  else if (historyMode.length === 2) {
    if (leftMode === "hash") {
      return createWebHashHistory(rightMode);
    } else if (leftMode === "h5") {
      return createWebHistory(rightMode);
    }
  }
}

/** 获取当前页面按钮级别的权限 */
function getAuths(): Array<string> {
  return findRouteByPath(router.currentRoute.value.path, usePermissionStoreHook().wholeMenus).meta.auths;
}

/** 是否有按钮级别的权限 */
function hasAuth(value: string | Array<string>): boolean {
  /** 按钮级权限隐藏 */
  const flag = true;
  if (flag) return true;
  /** ------------ */
  if (!value) return false;
  /** 从当前路由的`meta`字段里获取按钮级别的所有自定义`code`值 */
  const metaAuths = getAuths();
  if (!metaAuths) return false;
  const isAuths = isString(value) ? metaAuths.includes(value) : isIncludeAllChildren(value, metaAuths);
  return !!isAuths;
}

/** 获取所有菜单中的第一个菜单（顶级菜单）*/
function getTopMenu(tag = false): menuType {
  const menuList = usePermissionStoreHook().wholeMenus;
  const topMenu = menuList[0]?.children[0];
  tag && useMultiTagsStoreHook().handleTags("push", topMenu);
  return topMenu;
}

/** 处理缓存路由（添加、删除、刷新） */
function handleAliveRoute({ name }: ToRouteType, mode?: string) {
  switch (mode) {
    case "add":
      usePermissionStoreHook().cacheOperate({ mode: "add", name });
      break;
    case "delete":
      usePermissionStoreHook().cacheOperate({ mode: "delete", name });
      break;
    case "refresh":
      usePermissionStoreHook().cacheOperate({ mode: "refresh", name });
      break;
    default:
      usePermissionStoreHook().cacheOperate({ mode: "delete", name });
      useTimeoutFn(() => usePermissionStoreHook().cacheOperate({ mode: "add", name }), 100);
  }
}

export {
  hasAuth,
  getAuths,
  ascending,
  initRouter,
  getTopMenu,
  addPathMatch,
  isOneOfArray,
  getHistoryMode,
  addAsyncRoutes,
  getParentPaths,
  formatMenuData,
  findRouteByPath,
  handleAliveRoute,
  filterVisibleTree,
  filterChildrenTree,
  filterUserAuthMenu,
  formatTwoStageRoutes,
  formatFlatteningRoutes
};
