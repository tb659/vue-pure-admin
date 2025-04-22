import { msg } from "@/utils/msg";
import { listToTree } from "@/utils/tree";
import { userApi } from "@/api/system/user";
import { dictApi } from "@/api/system/dict";
import { isNumber } from "@pureadmin/utils";
import { deptApi } from "@/api/system/dept";
import { setFileStrToObj } from "@/utils/file";
import { useTable } from "@/hooks/web/useTable";
import { ref, unref, reactive, nextTick } from "vue";
import { ElMessageBox } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { ADMIN_DICT_EDIT_CODE, ADMIN_USER_ROOT } from "@/utils/constants";

export function useHook() {
  const title = ref("用户");
  const visible = ref(false);
  const loading = ref(false);
  const adminEditFlag = ref(false);
  const treeRef = ref(null);
  const deptList = ref<DeptData[]>([]);
  const deptId = ref();
  let activeDept = reactive<DeptData>({});

  function beforeRequest(params) {
    if (deptId.value) params.deptId = deptId.value;
    if (!deptId.value) delete params.deptId;
  }

  async function afterRequest(list) {
    const role = list.filter(v => v.root === ADMIN_USER_ROOT)[0];
    // 当前列表存在admin判断是否可以操作
    if (role) {
      const res = await dictApi.list<DictData[]>({ code: ADMIN_DICT_EDIT_CODE });
      if (res?.data?.length) {
        adminEditFlag.value = !res.data[0].status;
      }
    }
    list.forEach(item => {
      item.status = item.status * 1;
    });
    return list;
  }
  const { tableRegister, tableState, tableMethods } = useTable<UserData>({
    api: userApi,
    pageOrList: "page",
    afterRequest: afterRequest,
    beforeRequest: beforeRequest,
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
      disabled: ({ root }) => handleBtnDisabled(root),
    },
    {
      label: "启用",
      type: "primary",
      action: ({ id }) => tableMethods.enableItem({ ids: id }),
      hidden: ({ status }) => Boolean(status),
    },
    {
      label: "停用",
      type: "danger",
      action: ({ id }) => tableMethods.disableItem({ ids: id }),
      hidden: ({ status }) => Boolean(!status),
    },
    // {
    //   label: "删除",
    //   type: "danger",
    //   action: ({ id }) => tableMethods.delItem({ ids: id }),
    //   disabled: ({ root }) => handleBtnDisabled(root)
    // }
  ];

  const { getList, setSearchParams } = tableMethods;

  initDept();

  function handleBtnDisabled(v) {
    if (!isNumber(v)) return;
    return v === ADMIN_USER_ROOT ? adminEditFlag.value || useUserStoreHook().userInfo?.root !== ADMIN_USER_ROOT : false;
  }

  function handleAdd() {
    title.value = "添加用户";
    tableState.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    tableState.currentRow = null;
    /** 根据用户ID查询详情 */
    userApi.detailByParams({ userId: data.id }).then((res: any) => {
      // 处理文件格式 signature-签名
      setFileStrToObj(res.data, ["signature"]);
      title.value = "修改用户";
      tableState.currentRow = res.data;
      visible.value = true;
    });
  }
  function handleExport(data) {
    if (deptId.value) data.deptId = deptId.value;
    if (!deptId.value) delete data.deptId;
    console.log(data);
    userApi.exportOrDownloadFileByOpen(true, data, userApi.exportUrl());
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    const formData = await write?.submit();
    if (formData) {
      console.log("参数", formData);
      ElMessageBox.confirm("确认提交角色权限？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          loading.value = true;
          const save = formData.id ? "update" : "create";
          const res = await userApi[save](formData);
          loading.value = false;
          if (!res) return;
          visible.value = false;
          msg.success();
          getList();
        })
        .catch(() => {});
    }
  }

  async function initDept() {
    deptList.value = listToTree((await deptApi.list<DeptData[]>({})).data, { pid: "parentDeptId" }) || [];
    // const corpsData = await corpsApi.querySelectListByUserName<CorpsData[]>({ corpId: getUser("corpId") });
    // const topLevelPostName = corpsData.data.filter(item => item.id === getUser("corpId"))[0].corpName;
    // // 把机构加在最顶部
    // deptList.value.unshift({ name: "topLevelPostName", id: -1 });
    activeDept = deptList.value[0] || {};
    deptId.value = activeDept.id;
    nextTick(() => {
      treeRef.value.setCurrentKey(activeDept.id);
      getList();
    });
  }

  function nodeClick(node) {
    activeDept = node;
    deptId.value = activeDept.id;
    tableState.params = { deptId: activeDept.id };
    getList();
  }

  return {
    title,
    visible,
    loading,
    treeRef,
    deptList,
    tableState,
    operationList,
    tableRegister,
    nodeClick,
    handleAdd,
    handleSubmit,
    handleExport,
    setSearchParams,
  };
}
