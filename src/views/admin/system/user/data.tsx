import dayjs from "dayjs";
import { ref, reactive } from "vue";
import {
  ADMIN_USER_ROOT,
  //  MEMBER_USER_ROOT,
  STATUS_MAP,
  STATUS_OPTIONS,
  STATUS_TYPE,
  _USER_OPTIONS,
  USER_MAP,
  NATION_TYPE,
} from "@/utils/constants";
import { listToTree } from "@/utils/tree";
import { deptApi } from "@/api/system/dept";
import { roleApi } from "@/api/system/role";
// import { hasAuth } from "@/router/utils";
// import { userApi } from "@/api/system/user";
// import { handleStatusChange } from "@/utils/tableStatusChange";
// !------------------------------- 获取部门 ------------------------------------
const deptTreeOptions = ref<any[]>([]);
const deptOptions = ref<any[]>([]);
/** 获取部门数据 */
async function getDeptData() {
  const res: any = await deptApi.list({ status: STATUS_TYPE.ENABLED_V });
  res.data.forEach(item => {
    item["isDept"] = true;
    item["label"] = item.name;
    item["value"] = item.id;
  });
  deptOptions.value = res.data;
  deptTreeOptions.value = listToTree(res.data, { pid: "parentDeptId" }) || [];
  console.log("部门数据", deptOptions.value);
}
getDeptData();
// !------------------------------- 获取角色 ------------------------------------
const roleOptions = ref<any[]>([]);
/** 获取角色数据 */
async function getRoleData() {
  const res = await roleApi.list<any[]>({});
  roleOptions.value = res.data.map(v => ({ label: v.name, value: v.id }));
}
getRoleData();
export function useData() {
  // const switchLoadMap = ref({});

  const searchSchema = reactive<FormSchema[]>([
    {
      label: "用户名称",
      field: "realName",
      component: "Input",
      componentProps: {
        placeholder: "请输入用户名称",
      },
    },
    {
      label: "用户帐号",
      field: "username",
      component: "Input",
      componentProps: {
        placeholder: "请输入用户名称",
      },
    },
    {
      label: "用户状态",
      field: "status",
      component: "Select",
      componentProps: {
        placeholder: "请选择用户状态",
        options: STATUS_OPTIONS,
      },
    },
  ]);

  const formSchema = reactive<FormSchema[]>([
    {
      label: "用户姓名",
      field: "realName",
      component: "Input",
      colProps: { span: 8 },
      componentProps: {
        placeholder: "请输入用户姓名",
        maxlength: 10,
        showWordLimit: true,
      },
      required: true,
    },
    {
      label: "手机号码",
      field: "phone",
      component: "Input",
      colProps: { span: 8 },
      componentProps: {
        placeholder: "请输入手机号码",
        type: "number",
        maxlength: 11,
        minlength: 11,
      },
      required: true,
    },
    {
      label: "民族",
      field: "nationality",
      component: "Select",
      colProps: { span: 8 },
      componentProps: {
        placeholder: "请选择民族",
        options: NATION_TYPE,
        filterable: true,
      },
      required: true,
    },
    {
      label: "所属部门",
      field: "deptId",
      component: "TreeSelect",
      colProps: { span: 8 },
      componentProps: {
        placeholder: "请选择所属部门",
        props: { label: "name", class: "tree-select-class" },
        nodeKey: "id",
        checkStrictly: true,
        data: deptTreeOptions.value,
      },
      required: true,
    },
    {
      label: "部门编码",
      field: "deptCode",
      component: "Input",
      colProps: { span: 8 },
      componentProps: {
        placeholder: "自动带出",
        disabled: true,
      },
    },
    {
      label: "用户标识",
      field: "userType",
      component: "Select",
      colProps: { span: 8 },
      componentProps: {
        placeholder: "请选择用户标识",
        options: _USER_OPTIONS,
      },
      required: true,
    },
    {
      label: "用户权限",
      field: "roleList",
      value: [],
      component: "Select",
      colProps: { span: 8 },
      componentProps: {
        placeholder: "请选择",
        options: roleOptions.value,
        clearable: false,
        filterable: true,
        multiple: true,
      },
      required: true,
    },
    {
      label: "用户状态",
      field: "status",
      value: STATUS_TYPE.ENABLED_V,
      component: "RadioGroup",
      colProps: { span: 8 },
      componentProps: {
        options: STATUS_OPTIONS,
      },
      required: true,
      // hidden: ({ model }) => !!model.id
    },
    // {
    //   label: "超级管理员",
    //   field: "root",
    //   component: "Switch",
    //   colProps: { span: 8 },
    //   componentProps: {
    //     placeholder: "",
    //     activeValue: ADMIN_USER_ROOT,
    //     inactiveValue: MEMBER_USER_ROOT
    //   }
    // },
    {
      label: "用户签名",
      field: "signature",
      component: "MtUpload",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "支持上传1个签名",
        // listType: "text", // list-多个 text-单个
        multiple: false, // 是否可上传多个
        limit: 1,
      },
      required: true,
    },
    // {
    //   label: "工号",
    //   field: "jobNumber",
    //   component: "Input",
    //   colProps: { span: 12 },
    //   componentProps: {
    //     placeholder: "请输入工号"
    //   },
    //   hidden: () => {
    //     return true;
    //   }
    // },
    // {
    //   label: "用户账号",
    //   // labelMsg: "用作登录账号",
    //   field: "username",
    //   component: "Input",
    //   colProps: { span: 12 },
    //   componentProps: {
    //     placeholder: "用户账号",
    //     type: "text"
    //     // reg: /[^a-z^A-Z^0-9]/g
    //   },
    //   required: true,
    //   hidden: () => {
    //     return true;
    //   }
    // },
    // {
    //   label: "登录密码",
    //   labelMsg: "输入6位英文字母（区分大小写）或数字，不支持特殊符号",
    //   field: "password",
    //   component: "Input",
    //   colProps: { span: 12 },
    //   componentProps: {
    //     placeholder: "请输入登录密码",
    //     type: "password",
    //     showPassword: true
    //   },
    //   hidden: ({ model }) => !!model.id,
    //   required: true
    // }
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
      width: 70,
      initHidden: true,
    },
    {
      label: "工号",
      field: "jobNumber",
      minWidth: 120,
      cellRenderer: ({ row }) => <span>{row.jobNumber || "--"}</span>,
    },
    {
      label: "用户账号",
      field: "username",
      minWidth: 120,
      cellRenderer: ({ row }) => <span>{row.username || "--"}</span>,
    },
    {
      label: "用户名称",
      field: "realName",
      width: 120,
      cellRenderer: ({ row }) => <span>{row.realName || "--"}</span>,
    },
    {
      label: "手机号码",
      field: "phone",
      minWidth: 120,
      cellRenderer: ({ row }) => <span>{row.phone || "--"}</span>,
    },
    {
      label: "用户标识",
      field: "userType",
      minWidth: 120,
      cellRenderer: ({ row }) => <span>{USER_MAP[row.userType].label}</span>,
    },
    {
      label: "角色权限",
      field: "roleNames",
      minWidth: 120,
      cellRenderer: ({ row }) => <span>{row.roleNames || "--"}</span>,
    },
    {
      label: "是否为超级管理员",
      field: "root",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-button size={"small"} type={row.root === ADMIN_USER_ROOT ? "success" : "danger"}>
          {row.root === ADMIN_USER_ROOT ? "是" : "否"}
        </el-button>
      ),
    },
    {
      label: "用户状态",
      field: "status",
      width: 80,
      cellRenderer: ({ row }) => (
        <el-button size={"small"} type={STATUS_MAP[row.status].type}>
          {STATUS_MAP[row.status].label}
        </el-button>
      ),
    },
    // {
    //   label: "用户状态",
    //   minWidth: 130,
    //   cellRenderer: scope => (
    //     <el-switch
    //       size={scope.$props.size || "default"}
    //       loading={switchLoadMap.value[scope.index]?.loading}
    //       v-model={scope.row.status}
    //       active-value={STATUS_TYPE.ENABLED_V}
    //       inactive-value={STATUS_TYPE.DISABLED_V}
    //       active-text="已启用"
    //       inactive-text="已禁用"
    //       inline-prompt
    //       onChange={() => onStatusChange(scope as any)}
    //       disabled={!hasAuth(STATUS_MAP[scope.row.status].label) || scope.row.root === ADMIN_USER_ROOT}
    //     />
    //   )
    // },
    {
      label: "创建时间",
      width: 180,
      formatter: row => dayjs.unix(row.crtDt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      label: "操作",
      field: "operation",
      fixed: "right",
      width: 120,
    },
  ];
  // function onStatusChange({ row, index }) {
  //   const ids = [row.id];
  //   const data = {
  //     row,
  //     index,
  //     name: row.username,
  //     api: userApi,
  //     switchLoadMap: switchLoadMap.value,
  //     ids: { idList: ids }
  //   };
  //   console.log(row, data);
  //   handleStatusChange(data);
  // }

  return {
    formSchema,
    searchSchema,
    tableColumns,
    deptOptions,
  };
}
