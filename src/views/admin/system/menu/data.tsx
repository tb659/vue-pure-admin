// import dayjs from "dayjs";
import { reactive, ref } from "vue";

import { menuApi } from "@/api/system/menu";

import {
  MENU_LINK_OPTION,
  MENU_TYPE,
  MENU_TYPE_MAP,
  MENU_TYPE_OPTION,
  STATUS_MAP,
  STATUS_OPTIONS,
  STATUS_TYPE,
} from "@/utils/constants";
import { eachTree } from "@/utils/tree";
import { hasAuth } from "@/router/utils";
import { useForm } from "@/hooks/web/useForm";
import { handleStatusChange } from "@/utils/tableStatusChange";
import debug from "debug";

const { formRegister, formMethods } = useForm();

export function useData() {
  const switchLoadMap = ref({});

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "菜单名称",
      field: "name",
      component: "Input",
      componentProps: {
        placeholder: "请输入菜单名称",
      },
    },
    {
      label: "菜单状态",
      field: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择菜单状态",
        options: STATUS_OPTIONS,
      },
    },
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "上级菜单",
      field: "parentId",
      component: "TreeSelect",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择上级菜单",
        props: { label: "name", class: "tree-select-class" },
        checkStrictly: true,
        nodeKey: "id",
        data: [],
      },
      required: true,
    },
    {
      label: "菜单类型",
      field: "type",
      value: MENU_TYPE.F_V,
      component: "RadioGroup",
      colProps: { span: 12 },
      componentProps: {
        options: MENU_TYPE_OPTION,
        onChange: type => {
          debug("debug:menu")(type);
          const label = MENU_TYPE_MAP[type].label;
          formMethods.setSchema([
            { field: "icon", path: "label", value: label + "图标" },
            { field: "name", path: "label", value: label + "名称" },
            { field: "name", path: "componentProps.placeholder", value: `请输入${label}` },
          ]);
        },
      },
    },
    {
      label: "是否外链",
      labelMsg:
        "<p>选择外链则路由地址需要以`http(s)://`开头</p><p>1、外链表示跳转到其它平台。</p><p>2、内嵌表示平台内嵌入链接页面。",
      field: "frameType",
      value: 3,
      component: "RadioGroup",
      colProps: { span: 12 },
      componentProps: {
        options: MENU_LINK_OPTION,
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V,
    },
    {
      label: "菜单图标",
      field: "icon",
      component: "IconSelect",
      colProps: { span: 24 },
      componentProps: {
        style: { width: "100%" },
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V,
    },
    {
      label: "菜单名称",
      field: "name",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入菜单名称",
      },
      required: true,
    },
    {
      label: "显示排序",
      field: "code",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入菜单显示顺序",
      },
      required: true,
    },
    {
      label: "路由地址",
      labelMsg: "访问的路由地址，如：`/system/user`，如外网地址需内链访问则以`http(s)://`开头",
      field: "path",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入访问的路由地址",
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V,
      required: true,
    },
    {
      label: "路由路径",
      labelMsg: "访问的路由路径，如：`/admin/system/user/index`，默认在`views`目录下。值为空则路由路径会跟path保持一致",
      field: "component",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入访问的路由路径",
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V,
    },
    {
      label: "路由名称",
      labelMsg: "访问的路由name，如： `User`,和当前路由的`name`保持一致）",
      field: "cname",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入路由name",
      },
      hidden: ({ model }) => model.type !== MENU_TYPE.M_V,
      required: true,
    },
    {
      label: "路由重写",
      labelMsg: "路由重定向，目录跳转到的页面路径",
      field: "redirect",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入路由重定向路径",
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V,
    },
    {
      label: "菜单状态",
      labelMsg: "选择禁用则路由将不会出现在侧边栏，也不能被访问",
      field: "status",
      value: STATUS_TYPE.ENABLED_V,
      component: "RadioGroup",
      colProps: { span: 12 },
      componentProps: {
        options: STATUS_OPTIONS,
        disabled: true,
      },
    },
    {
      label: "显示缓存",
      labelMsg: "选择缓存则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致",
      field: "keepAlive",
      value: false,
      component: "RadioGroup",
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: "缓存", value: true },
          { label: "不缓存", value: false },
        ],
      },
      hidden: ({ model }) => model.type !== MENU_TYPE.M_V,
    },
    {
      label: "显示状态",
      labelMsg: "选择隐藏则路由将不会出现在侧边栏，但仍然可以访问",
      field: "showLink",
      value: true,
      component: "RadioGroup",
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: "显示", value: true },
          { label: "隐藏", value: false },
        ],
      },
      hidden: ({ model }) => model.type === MENU_TYPE.B_V,
    },
    {
      label: "显示父级",
      labelMsg: "选择显示时当一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面",
      field: "showParent",
      value: false,
      component: "RadioGroup",
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: "显示", value: true },
          { label: "隐藏", value: false },
        ],
      },
      hidden: ({ model }) => model.type !== MENU_TYPE.M_V,
    },
    {
      label: "标 签 页",
      labelMsg: "选择禁止时菜单名称或自定义信息禁止添加到标签页",
      field: "hiddenTag",
      value: false,
      component: "RadioGroup",
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: "允许", value: false },
          { label: "禁止", value: true },
        ],
      },
      hidden: ({ model }) => model.type !== MENU_TYPE.M_V,
    },
    {
      label: "固定标签",
      labelMsg: "选择固定时当前菜单名称固定显示在标签页且不可关闭",
      field: "fixedTag",
      value: false,
      component: "RadioGroup",
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: "固定", value: true },
          { label: "不固定", value: false },
        ],
      },
      hidden: ({ model }) => model.type !== MENU_TYPE.M_V,
    },
    {
      label: "菜单备注",
      field: "note",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入菜单备注",
        type: "textarea",
        rows: 2,
      },
    },
  ]);

  const tableColumns: TableColumn[] = [
    {
      label: "勾选",
      type: "selection",
      width: 55,
      align: "left",
      fixed: "left",
    },
    {
      label: "序号",
      type: "index",
      width: 60,
      initHidden: true,
    },
    {
      label: "菜单名称",
      field: "name",
      minWidth: 180,
      cellRenderer: ({ row }) => {
        return row.icon ? (
          <div className="inline-block">
            <div className="flex">
              <iconify-icon-online class="mx-1 inline translate-y-1" icon={row.icon} /> <span>{row.meta?.title}</span>
            </div>
          </div>
        ) : (
          row.meta?.title
        );
      },
      align: "left",
    },
    {
      label: "菜单排序",
      field: "code",
      width: 100,
    },
    {
      label: "菜单类型",
      field: "type",
      width: 80,
      cellRenderer: ({ row: { type }, $props }) => (
        <el-tag size={$props.size} type={MENU_TYPE_MAP[type].type} effect="plain">
          {MENU_TYPE_MAP[type].label}
        </el-tag>
      ),
    },
    // {
    //   label: "组件路径",
    //   field: "component",
    //   minWidth: 240,
    //   showOverflowTooltip: false
    // },
    {
      label: "路由地址",
      field: "path",
      minWidth: 160,
      showOverflowTooltip: false,
    },
    {
      label: "菜单备注",
      field: "note",
      minWidth: 150,
    },
    {
      label: "菜单状态",
      width: 100,
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
          disabled={
            !hasAuth(STATUS_MAP[scope.row.status].label) || scope.row.path === "/system/menu" || scope.row.path === "/system"
          }
        />
      ),
    },
    // {
    //   label: "创建时间",
    //   width: 180,
    //   field: "crtDt",
    //   formatter: row => dayjs.unix(row.crtDt).format("YYYY-MM-DD HH:mm:ss")
    // },
    {
      label: "操作",
      field: "operation",
      fixed: "right",
      width: 220,
    },
  ];

  function onStatusChange({ row, index }) {
    const ids = [row.id];
    if (row.children?.length && row.status === STATUS_TYPE.DISABLED_V) {
      eachTree(row.children, item => ids.push(item.id));
    }
    const data = {
      row,
      index,
      name: row.meta.title,
      api: menuApi,
      switchLoadMap: switchLoadMap.value,
      ids: { idList: ids },
      isTree: ids.length > 1,
    };
    console.log(row, data);
    handleStatusChange(data);
  }

  return {
    formSchema,
    searchSchema,
    tableColumns,
    formRegister,
    formMethods,
  };
}
