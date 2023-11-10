import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { ADMIN_ROLE_EMBED, STATUS_MAP, STATUS_OPTIONS, STATUS_TYPE } from "@/utils/common";
import { hasAuth } from "@/router/utils";
import { handleStatusChange } from "@/utils/tableStatusChange";
import { roleApi } from "@/api/system/role";

export function useData() {
  const switchLoadMap = ref({});

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "角色名称",
      prop: "name",
      component: "Input",
      componentProps: {
        placeholder: "请输入角色名称"
      }
    },
    {
      label: "角色编码",
      prop: "code",
      component: "Input",
      componentProps: {
        placeholder: "角色编码"
      }
    },
    {
      label: "角色状态",
      prop: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择角色状态",
        options: STATUS_OPTIONS
      }
    }
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "角色名称",
      prop: "name",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入角色名称"
      },
      required: true
    },
    {
      label: "角色编码",
      prop: "code",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入角色编码"
      },
      required: true
    },
    {
      label: "角色状态",
      prop: "status",
      value: 1,
      component: "Radio",
      colProps: { span: 24 },
      componentProps: {
        options: STATUS_OPTIONS
      }
    },
    {
      label: "角色备注",
      prop: "note",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入角色备注",
        type: "textarea",
        rows: "2"
      }
    },
    {
      label: "角色权限",
      prop: "resourceList",
      colProps: { span: 24 }
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
      width: 70,
      initHidden: true
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色编码",
      prop: "code",
      minWidth: 120
    },
    {
      label: "角色备注",
      prop: "note",
      minWidth: 150
    },
    {
      label: "角色状态",
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
          disabled={!hasAuth(STATUS_MAP[scope.row.status].label) || scope.row.embed === ADMIN_ROLE_EMBED}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime",
      formatter: row => dayjs.unix(row.crtDt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      prop: "operation",
      fixed: "right",
      width: 140
    }
  ];

  function onStatusChange({ row, index }) {
    handleStatusChange({
      row,
      index,
      name: row.name,
      api: roleApi,
      switchLoadMap: switchLoadMap.value
    });
  }

  return {
    formSchema,
    searchSchema,
    tableColumns
  };
}
