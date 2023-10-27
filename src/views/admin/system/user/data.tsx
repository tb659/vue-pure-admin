import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { ADMIN_USER_ROOT, STATUS_MAP, STATUS_OPTIONS, STATUS_TYPE } from "@/utils/common";
import { hasAuth } from "@/router/utils";
import { handleStatusChange } from "@/utils/tableStatusChange";
import { userApi } from "@/api/system/user";

export function useData() {
  const switchLoadMap = ref({});

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "用户名称",
      prop: "username",
      component: "Input",
      componentProps: {
        placeholder: "请输入用户名称"
      }
    },
    {
      label: "用户状态",
      prop: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择用户状态",
        options: STATUS_OPTIONS
      }
    }
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "用户名称",
      prop: "username",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入用户名称"
      }
    },
    {
      label: "用户密码",
      prop: "password",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入用户密码",
        type: "password"
      },
      hidden: ({ model }) => !!model.id
    },
    {
      label: "用户角色",
      prop: "roleList",
      value: [],
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择用户角色",
        multiple: true,
        options: []
      }
    },
    {
      label: "用户状态",
      prop: "status",
      value: 1,
      component: "Radio",
      colProps: { span: 24 },
      componentProps: {
        options: STATUS_OPTIONS
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
      width: 70,
      initHidden: true
    },
    {
      label: "用户名称",
      prop: "username",
      minWidth: 120
    },
    {
      label: "用户类型",
      prop: "root",
      minWidth: 120,
      cellRenderer: ({ row }) => (row.root === ADMIN_USER_ROOT ? <>超级管理员</> : <>普通用户</>)
    },
    {
      label: "用户角色",
      prop: "roleNames",
      minWidth: 120
    },
    {
      label: "用户状态",
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
          disabled={!hasAuth(STATUS_MAP[scope.row.status].label) || scope.row.root === ADMIN_USER_ROOT}
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
      width: 140
    }
  ];

  function onStatusChange({ row, index }) {
    handleStatusChange({
      row,
      index,
      name: row.username,
      api: userApi,
      switchLoadMap: switchLoadMap.value
    });
  }

  return {
    formSchema,
    searchSchema,
    tableColumns
  };
}
