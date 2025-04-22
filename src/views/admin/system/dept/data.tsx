import dayjs from "dayjs";
import { reactive, ref } from "vue";

import { deptApi } from "@/api/system/dept";

import { eachTree } from "@/utils/tree";
import { hasAuth } from "@/router/utils";
import { handleStatusChange } from "@/utils/tableStatusChange";
import { STATUS_MAP, STATUS_OPTIONS, STATUS_TYPE } from "@/utils/constants";

export function useData() {
  const switchLoadMap = ref({});

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "部门名称",
      field: "name",
      component: "Input",
      componentProps: {
        placeholder: "请输入部门名称",
      },
    },
    {
      label: "部门状态",
      field: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择部门状态",
        options: STATUS_OPTIONS,
      },
    },
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "上级部门",
      field: "parentDeptId",
      component: "TreeSelect",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择上级部门",
        props: { label: "name", class: "tree-select-class" },
        checkStrictly: true,
        nodeKey: "id",
        data: [],
        disabled: true,
      },
      required: true,
    },
    {
      label: "部门名称",
      field: "name",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入部门名称",
        disabled: true,
      },
      required: true,
    },
    {
      label: "部门编码",
      field: "orgCode",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入部门编码",
      },
      required: true,
    },
    // {
    //   label: "部门编码",
    //   field: "code",
    //   component: "Input",
    //   colProps: { span: 24 },
    //   componentProps: {
    //     placeholder: "请输入部门编码"
    //   },
    //   required: true
    // },
    {
      label: "部门状态",
      field: "status",
      value: STATUS_TYPE.ENABLED_V,
      component: "RadioGroup",
      colProps: { span: 24 },
      componentProps: {
        options: STATUS_OPTIONS,
      },
      required: true,
    },
    {
      label: "部门备注",
      field: "note",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入部门备注",
        type: "textarea",
        rows: 2,
      },
    },
  ]);

  const tableColumns: TableColumn[] = [
    // {
    //   label: "勾选",
    //   type: "selection",
    //   width: 55,
    //   align: "left",
    //   fixed: "left"
    // },
    {
      label: "序号",
      type: "index",
      width: 65,
    },
    {
      label: "部门名称",
      field: "name",
      align: "left",
      minWidth: 200,
    },
    // {
    //   label: "部门编码",
    //   field: "code",
    //   width: 180
    // },
    {
      label: "原始部门编码",
      field: "code",
      width: 110,
    },
    {
      label: "部门编码",
      field: "orgCode",
      width: 120,
    },
    {
      label: "部门备注",
      field: "note",
      width: 100,
    },
    // {
    //   label: "部门属性",
    //   field: "embed",
    //   width: 100,
    //   cellRenderer: scope => <div>{BUILT_IN_MAP[scope.row.embed].label}</div>,
    //   hidden: function ({ checklist }) {
    //     return !checklist?.includes(this.label) || false;
    //   }
    // },
    {
      label: "原始部门状态",
      width: 120,
      cellRenderer: ({ row }) => (
        <el-button size={"small"} type={STATUS_MAP[row.orgStatus].type}>
          {STATUS_MAP[row.orgStatus].label}
        </el-button>
      ),
    },
    {
      label: "部门状态",
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
          disabled={!hasAuth(STATUS_MAP[scope.row.status].label)}
        />
      ),
    },
    {
      label: "创建时间",
      width: 180,
      field: "crtDt",
      formatter: row => dayjs.unix(row.crtDt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      label: "操作",
      field: "operation",
      fixed: "right",
      width: 120,
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
      name: row.name,
      api: deptApi,
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
  };
}
