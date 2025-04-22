import dayjs from "dayjs";
import { reactive } from "vue";
import { ADMIN_USER_ROOT, STATUS_MAP, STATUS_OPTIONS } from "@/utils/constants";

export function useData() {
  const searchSchema = reactive<FormSchema[]>([
    {
      label: "用户名称",
      field: "username",
      component: "Input",
      componentProps: {
        placeholder: "请输入用户名称",
      },
    },
    {
      field: "username",
      component: "Input",
      componentProps: {
        placeholder: "搜索登录账号",
      },
    },
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "所属部门",
      field: "deptId",
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择所属部门",
        options: [],
        // disabled: true
      },
      required: true,
    },
    {
      label: "用户姓名",
      field: "realName",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入用户姓名",
        maxlength: 10,
        showWordLimit: true,
      },
      required: true,
    },
    {
      label: "手机号码",
      labelMsg: "用作登录账号",
      field: "username",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "输入手机号码",
        type: "text",
        reg: /[^a-z^A-Z^0-9]/g,
      },
      required: true,
    },
    {
      label: "登录密码",
      labelMsg: "输入6位英文字母（区分大小写）或数字，不支持特殊符号",
      field: "password",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入登录密码",
        type: "password",
        showPassword: true,
      },
      hidden: ({ model }) => !!model.id,
      required: true,
    },
    {
      label: "超级管理员",
      field: "root",
      component: "Switch",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "",
      },
    },
    {
      label: "工号",
      field: "jobNumber",
      component: "Input",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请输入工号",
      },
    },
    // {
    //   label: "手机号码",
    //   field: "mobile",
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
      field: "roleList",
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
          height: "auto",
        },
      },
      required: true,
      // hidden: ({ model }) => !!model.id
    },
    {
      label: "用户状态",
      field: "status",
      value: 1,
      component: "RadioGroup",
      colProps: { span: 24 },
      componentProps: {
        options: STATUS_OPTIONS,
      },
      required: true,
      // hidden: ({ model }) => !!model.id
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
      width: 70,
      initHidden: true,
    },
    {
      label: "用户名称",
      field: "realName",
      minWidth: 120,
    },
    {
      label: "用户类型",
      field: "root",
      minWidth: 120,
      cellRenderer: ({ row }) => (row.root === ADMIN_USER_ROOT ? <span>超级管理员</span> : <span>普通用户</span>),
    },
    {
      label: "用户角色",
      field: "roleNames",
      minWidth: 120,
    },
    {
      label: "用户状态",
      minWidth: 130,
      cellRenderer: ({ row }) => <el-tag type={STATUS_MAP[row.status].type}>{STATUS_MAP[row.status].label}</el-tag>,
    },
    {
      label: "创建时间",
      minWidth: 180,
      field: "crtDt",
      formatter: row => dayjs.unix(row.crtDt).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return {
    formSchema,
    searchSchema,
    tableColumns,
  };
}
