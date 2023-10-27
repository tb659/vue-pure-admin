import { $t } from "@/plugins/i18n";
import { flowchart } from "@/router/enums";

export default {
  path: "/flowChart",
  redirect: "/flowChart/index",
  meta: {
    icon: "setUp",
    title: $t("menus.hsflowChart"),
    rank: flowchart
  },
  children: [
    {
      path: "/flowChart/index",
      name: "FlowChart",
      component: () => import("@/views/default/flow-chart/index.vue"),
      meta: {
        title: $t("menus.hsflowChart")
      }
    }
  ]
} as RouteConfigsTable;
