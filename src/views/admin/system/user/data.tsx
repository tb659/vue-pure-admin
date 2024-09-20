import dayjs from "dayjs";
import { reactive, ref } from "vue";
import { hasAuth } from "@/router/utils";
import { ADMIN_USER_ROOT } from "@/config";
import { userApi } from "@/api/system/user";
import { handleStatusChange } from "@/utils/tableStatusChange";
import { STATUS_MAP, STATUS_OPTIONS, STATUS_TYPE } from "@/utils/common";

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
      label: "所属部门",
      prop: "deptId",
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择所属部门",
        options: []
        // disabled: true
      },
      required: true
    },
    {
      label: "用户姓名",
      prop: "realName",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入用户姓名",
        maxlength: 10,
        showWordLimit: true
      },
      required: true
    },
    {
      label: "手机号码",
      labelMsg: "用作登录账号",
      prop: "username",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "输入手机号码",
        type: "text",
        reg: /[^a-z^A-Z^0-9]/g
      },
      required: true
    },
    {
      label: "登录密码",
      labelMsg: "输入6位英文字母（区分大小写）或数字，不支持特殊符号",
      prop: "password",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入登录密码",
        type: "password",
        showPassword: true
      },
      hidden: ({ model }) => !!model.id,
      required: true
    },
    {
      label: "超级管理员",
      prop: "root",
      component: "Switch",
      colProps: { span: 24 },
      componentProps: {
        placeholder: ""
      }
    },
    {
      label: "工号",
      prop: "jobNumber",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入工号"
      }
    },
    // {
    //   label: "手机号码",
    //   prop: "mobile",
    //   component: "Input",
    //   colProps: { span: 24 },
    //   componentProps: {
    //     placeholder: "请输入手机号码",
    //     type: "number"
    //   },
    //   validator: eleValidMobile,
    //   validTrigger: "blur"
    // },
    {
      label: "员工角色",
      prop: "roleList",
      value: [],
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择角色",
        multiple: true,
        options: [],
        clearable: false,
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        style: {
          height: "auto"
        }
      },
      required: true
      // hidden: ({ model }) => !!model.id
    },
    {
      label: "用户状态",
      prop: "status",
      value: 1,
      component: "Radio",
      colProps: { span: 24 },
      componentProps: {
        options: STATUS_OPTIONS
      },
      required: true
      // hidden: ({ model }) => !!model.id
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
      prop: "realName",
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
