import { userApi } from "@/api/system/user";
import { deptApi } from "@/api/system/dept";
import { roleApi } from "@/api/system/role";
import { ASSOCIATION_DEPT, PROMOTER_DEPT, STATUS_TYPE, WORKFLOW_USER_OPTIONS, WORKFLOW_USER_TYPE } from "@/utils/constants";
import { reactive, ref } from "vue";
import { listToTree } from "@/utils/tree";
import { cloneDeep } from "lodash-es";

/** 用户输入框的值改变触发，远程获取数据 */
function memberRemoteMethod(key) {
  // remoteMethodLoading.value = true;
  userApi.list<UserData[]>({ realName: key, status: STATUS_TYPE.ENABLED_V }).then(res => {
    const data = res.data.map(item => item);
    // remoteMethodLoading.value = false;
    memberOptions.value = data.map(item => ({ label: item.realName, value: item.id, type: "" }));
  });
}

/** 部门输入框的值改变触发，远程获取数据 */
function deptRemoteMethod(key) {
  deptApi.list<DeptData[]>({ name: key, status: STATUS_TYPE.ENABLED_V }).then(res => {
    res.data.forEach(item => ((item.label = item.name), (item.value = item.id), (item.type = "")));
    conditionDeptOptions.value = listToTree(cloneDeep(res.data), { pid: "parentDeptId" }) || [];
    res.data.unshift(PROMOTER_DEPT);
    res.data.unshift(ASSOCIATION_DEPT);
    originDeptOptions.value = res.data;
    deptOptions.value = listToTree(cloneDeep(res.data), { pid: "parentDeptId" }) || [];
  });
}

/** 角色输入框的值改变触发，远程获取数据 */
function roleRemoteMethod(key) {
  roleApi.list<RoleData[]>({ name: key, status: STATUS_TYPE.ENABLED_V }).then(res => {
    const data = res.data.map(item => ({ name: item.name, label: item.name, id: item.id, value: item.id, type: "" }));
    conditionRoleOptions.value = data;
    roleOptions.value = data;
  });
}

/** 远程获取加载状态 */
// const remoteMethodLoading = ref(false);
/** 用户远程获取的数据源 */
const memberOptions = ref([]);
/** 用户初始获取远程数据 */
memberRemoteMethod("");
/** 部门远程获取的数据源 */
const deptOptions = ref([]);
const originDeptOptions = ref([]);
const conditionDeptOptions = ref([]);
/** 部门初始获取远程数据 */
deptRemoteMethod("");
/** 角色远程获取的数据源 */
const roleOptions = ref([]);
const conditionRoleOptions = ref([]);
roleRemoteMethod("");

export function useData() {
  const formSchema = reactive<FormSchema[]>([
    {
      label: "选择审批人",
      field: "userType",
      value: 1,
      component: "RadioGroup",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择审批人",
        options: WORKFLOW_USER_OPTIONS,
      },
      required: true,
      hidden: ({ model }) => !!model.copyState,
    },
    {
      label: "选择成员",
      field: "member",
      component: "Select",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择成员",
        // options: memberOptions.value,
        // remote: true,
        multiple: true,
        filterable: true,
        // loading: remoteMethodLoading,
        // remoteMethod: memberRemoteMethod,
        optionApi: () => memberOptions.value,
      },
      required: true,
      hidden: ({ model }) => model.userType !== WORKFLOW_USER_TYPE.USER_V,
    },
    {
      field: "memberMsg",
      formItemProps: {
        slots: {
          default: () => "当添加多个成员时，其中一名审批人同意或拒绝即可",
        },
      },
      colProps: { span: 24 },
      hidden: ({ model }) => model.userType !== WORKFLOW_USER_TYPE.USER_V,
    },
    {
      label: "选择角色",
      field: "role",
      colProps: { span: 24 },
      componentProps: {
        placeholder: "请选择部门和角色成员",
      },
      required: true,
      hidden: ({ model }) => model.userType !== WORKFLOW_USER_TYPE.ROLE_V,
    },
    {
      field: "roleMsg",
      formItemProps: {
        slots: {
          default: () => "可为角色选择所属部门，当角色包含多个成员时，其中一名审批人同意或拒绝即可",
        },
      },
      colProps: { span: 24 },
      hidden: ({ model }) => model.userType !== WORKFLOW_USER_TYPE.ROLE_V,
    },
    {
      label: "多级负责人审批",
      field: "multiSpprovers",
      colProps: { span: 24 },
      hidden: ({ model }) => model.userType !== WORKFLOW_USER_TYPE.MULTI_SPPROVERS_V,
    },
    {
      field: "multiSpproversMsg",
      formItemProps: {
        slots: {
          default: () => "发起人部门及向上的多级部门负责人审批",
        },
      },
      colProps: { span: 24 },
      hidden: ({ model }) => model.userType !== WORKFLOW_USER_TYPE.MULTI_SPPROVERS_V,
    },
    {
      label: "发起人自己",
      field: "owner",
      colProps: { span: 24 },
      hidden: ({ model }) => model.userType !== WORKFLOW_USER_TYPE.OWNER_V,
    },
    {
      field: "ownerMsg",
      formItemProps: {
        slots: {
          default: () => "发起人自己将作为审批人处理审批单",
        },
      },
      colProps: { span: 24 },
      hidden: ({ model }) => model.userType !== WORKFLOW_USER_TYPE.OWNER_V,
    },
  ]);

  return {
    formSchema,
    memberOptions,
    deptOptions,
    originDeptOptions,
    roleOptions,
    conditionRoleOptions,
    conditionDeptOptions,
  };
}
