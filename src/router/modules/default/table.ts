import { $t } from "@/plugins/i18n";
import { table } from "@/router/enums";

export default {
  path: "/table",
  redirect: "/table/index",
  meta: {
    icon: "ri/table-line",
    title: $t("menus.pureTable"),
    rank: table,
  },
  children: [
    {
      path: "/table/index",
      name: "PureTable",
      component: () => import("@/views/default/table/index.vue"),
      meta: {
        title: $t("menus.pureTableBase"),
      },
    },
    {
      path: "/table/high",
      name: "PureTableHigh",
      component: () => import("@/views/default/table/high.vue"),
      meta: {
        title: $t("menus.pureTableHigh"),
      },
    },
    {
      path: "/table/edit",
      name: "PureTableEdit",
      component: () => import("@/views/default/table/edit.vue"),
      meta: {
        title: $t("menus.pureTableEdit"),
      },
    },
    {
      path: "/table/virtual",
      name: "VxeTable",
      component: () => import("@/views/default/table/virtual.vue"),
      meta: {
        title: $t("menus.pureVxeTable"),
      },
    },
  ],
} satisfies RouteConfigsTable;
