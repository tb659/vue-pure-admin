import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { IconifyIconOnline } from "@/components/ReIcon";
import {
  MENU_LINK_OPTION,
  MENU_TYPE,
  MENU_TYPE_MAP,
  MENU_TYPE_OPTION,
  STATUS_MAP,
  STATUS_OPTIONS,
  STATUS_TYPE
} from "@/utils/common";
import { hasAuth } from "@/router/utils";
import { handleStatusChange } from "@/utils/tableStatusChange";
import { menuApi } from "@/api/system/menu";

export function useData() {
  const switchLoadMap = ref({});

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "菜单名称",
      prop: "name",
      component: "Input",
      componentProps: {
        placeholder: "请输入菜单名称"
      }
    },
    {
      label: "菜单状态",
      prop: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择菜单状态",
        options: STATUS_OPTIONS
      }
    }
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "上级菜单",
      prop: "parentId",
      component: "TreeSelect",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择上级菜单",
        props: { label: "name", class: "tree-select-class" },
        checkStrictly: true,
        nodeKey: "id",
        data: []
      }
    },
    {
      label: "菜单类型",
      prop: "type",
      value: 1,
      component: "Radio",
      colProps: { span: 12 },
      componentProps: {
        options: MENU_TYPE_OPTION
      }
    },
    {
      label: "是否外链",
      labelMsg:
        "<p>选择外链则路由地址需要以`http(s)://`开头</p><p>1、外链表示跳转到其它平台。</p><p>2、内嵌表示平台内嵌入链接页面。",
      prop: "frameType",
      value: 3,
      component: "Radio",
      colProps: { span: 12 },
      componentProps: {
        options: MENU_LINK_OPTION
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V
    },
    {
      label: "菜单图标",
      prop: "icon",
      component: "IconSelect",
      colProps: { span: 24 },
      componentProps: {
        style: { width: "100%" }
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V
    },
    {
      label: "菜单名称",
      prop: "name",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入菜单名称"
      }
    },
    {
      label: "显示排序",
      prop: "code",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入菜单显示顺序"
      }
    },
    {
      label: "路由地址",
      labelMsg: "访问的路由地址，如：`/system/user`，如外网地址需内链访问则以`http(s)://`开头",
      prop: "path",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入访问的路由地址"
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V
    },
    {
      label: "组件路径",
      labelMsg: "访问的组件路径，如：`/admin/system/user/index`，默认在`views`目录下。值为空则组件路径会跟path保持一致",
      prop: "component",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入访问的组件路径"
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V
    },
    {
      label: "组件名称",
      labelMsg: "访问的组件name，如： `User`,和当前组件的`name`保持一致）",
      prop: "cname",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入组件name"
      },
      hidden: ({ model }) => model.type !== MENU_TYPE.M_V
    },
    {
      label: "重写路由",
      labelMsg: "路由重定向，目录跳转到的页面路径",
      prop: "redirect",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入路由重定向路径"
      },
      hidden: ({ model }) => model.type !== MENU_TYPE.F_V
    },
    {
      label: "显示缓存",
      labelMsg: "选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致",
      prop: "keepAlive",
      value: false,
      component: "Radio",
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: "缓存", value: true },
          { label: "不缓存", value: false }
        ]
      },
      hidden: ({ model }) => model.type !== MENU_TYPE.M_V
    },
    {
      label: "显示状态",
      labelMsg: "选择隐藏则路由将不会出现在侧边栏，但仍然可以访问",
      prop: "visible",
      value: true,
      component: "Radio",
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: "显示", value: true },
          { label: "隐藏", value: false }
        ]
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V
    },
    {
      label: "显示父级",
      labelMsg: "当一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面",
      prop: "showParent",
      value: false,
      component: "Radio",
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: "显示", value: true },
          { label: "隐藏", value: false }
        ]
      },
      hidden: ({ model }) => model.type !== MENU_TYPE.M_V
    },
    {
      label: "菜单状态",
      labelMsg: "选择禁用则路由将不会出现在侧边栏，也不能被访问",
      prop: "status",
      value: 1,
      component: "Radio",
      colProps: { span: 12 },
      componentProps: {
        options: STATUS_OPTIONS
      }
    },
    {
      label: "菜单备注",
      prop: "note",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入菜单备注",
        type: "textarea",
        rows: "2"
      }
    }
  ]);

  const tableColumns: TableColumn[] = [
    {
      label: "勾选",
      type: "selection",
      width: 55,
      align: "left",
      fixed: "left"
    },
    {
      label: "序号",
      type: "index",
      initHidden: true
    },
    {
      label: "菜单名称",
      prop: "name",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        return row.icon ? (
          <>
            <IconifyIconOnline class="w-4 h-4 mx-1 inline translate-y-1" icon={row.icon} /> <span>{row.meta?.title}</span>
          </>
        ) : (
          row.meta?.title
        );
      }
    },
    {
      label: "菜单排序",
      prop: "code",
      minWidth: 120
    },
    {
      label: "菜单类型",
      prop: "type",
      minWidth: 100,
      cellRenderer: ({ row: { type }, $props }) => (
        <el-tag size={$props.size} type={MENU_TYPE_MAP[type].type} effect="plain">
          {MENU_TYPE_MAP[type].label}
        </el-tag>
      )
    },
    {
      label: "组件路径",
      prop: "component",
      minWidth: 150
    },
    {
      label: "路由地址",
      prop: "path",
      minWidth: 150
    },
    {
      label: "菜单备注",
      prop: "note",
      minWidth: 150
    },
    {
      label: "菜单状态",
      minWidth: 130,
      cellRenderer: scope => (
        <el-switch
          size={scope.$props.size || "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={STATUS_TYPE.ENABLED_V}
          inactive-value={STATUS_TYPE.DISABLED_V}
          active-text="已启用"
          inactive-text="已禁用"
          inline-prompt
          onChange={() => onStatusChange(scope as any)}
          disabled={!hasAuth(STATUS_MAP[scope.row.status].label)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime",
      formatter: row => dayjs(row.crtDate + row.crtTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      prop: "operation",
      fixed: "right",
      width: 220
    }
  ];

  function onStatusChange({ row, index }) {
    handleStatusChange({
      row,
      index,
      name: row.meta.title,
      api: menuApi,
      switchLoadMap: switchLoadMap.value
    });
  }

  return {
    formSchema,
    searchSchema,
    tableColumns
  };
}
