import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { BUILT_IN_MAP, STATUS_MAP, STATUS_OPTIONS, STATUS_TYPE } from "@/utils/common";
import { hasAuth } from "@/router/utils";
import { handleStatusChange } from "@/utils/tableStatusChange";
import { deptApi } from "@/api/system/dept";

export function useData() {
  const switchLoadMap = ref({});

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "部门名称",
      prop: "name",
      component: "Input",
      componentProps: {
        placeholder: "请输入部门名称"
      }
    },
    {
      label: "部门状态",
      prop: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择部门状态",
        options: STATUS_OPTIONS
      }
    }
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "部门名称",
      prop: "name",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入部门名称"
      }
    },
    {
      label: "编辑器",
      prop: "info",
      component: "Editor",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入编辑器"
      }
    },
    {
      label: "部门编码",
      prop: "code",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入部门显示顺序"
      }
    },
    {
      label: "部门状态",
      labelMsg: "选择禁用则路由将不会出现在侧边栏，也不能被访问",
      prop: "status",
      value: 1,
      component: "Radio",
      colProps: { span: 24 },
      componentProps: {
        options: STATUS_OPTIONS
      }
    },
    {
      label: "部门备注",
      prop: "note",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入部门备注",
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
      width: 70
    },
    {
      label: "部门名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "部门编码",
      prop: "code",
      minWidth: 120
    },
    {
      label: "部门备注",
      prop: "note",
      minWidth: 150
    },
    {
      label: "部门属性",
      prop: "embed",
      width: 100,
      cellRenderer: scope => <>{BUILT_IN_MAP[scope.row.embed].label}</>,
      hidden: function ({ checklist }) {
        return !checklist?.includes(this.label) || false;
      }
    },
    {
      label: "部门状态",
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
      name: row.name,
      api: deptApi,
      switchLoadMap: switchLoadMap.value
    });
  }

  return {
    formSchema,
    searchSchema,
    tableColumns
  };
}
