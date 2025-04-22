import { ref, reactive, nextTick } from "vue";

import { userApi } from "@/api/system/user";
import { dictApi } from "@/api/system/dict";
import { deptApi } from "@/api/system/dept";

import { listToTree } from "@/utils/tree";
import { useTable } from "@/hooks/web/useTable";
import { ADMIN_DICT_EDIT_CODE, ADMIN_USER_ROOT } from "@/utils/constants";

export function useHook() {
  const adminEditFlag = ref(false);
  const treeRef = ref(null);
  const deptList = ref<DeptData[]>([]);
  let activeDept = reactive<DeptData>({});

  const { tableRegister, tableState, tableMethods } = useTable<UserData>({
    api: userApi,
    pageOrList: "page",
    afterRequest: afterRequest,
  });

  const { getList, setSearchParams, getSelections } = tableMethods;

  initDept();

  async function afterRequest(list) {
    const role = list.filter(v => v.root === ADMIN_USER_ROOT)[0];
    // 当前列表存在admin判断是否可以操作
    if (role) {
      const res = await dictApi.list<DictData[]>({ code: ADMIN_DICT_EDIT_CODE });
      if (res?.data?.length) {
        adminEditFlag.value = !res.data[0].status;
      }
    }
    return list;
  }

  async function initDept() {
    deptList.value = listToTree((await deptApi.list<DeptData[]>({})).data, { pid: "parentDeptId" }) || [];
    // activeDept = deptList.value[0];
    nextTick(() => {
      treeRef.value.setCurrentKey(activeDept.id);
      getList();
    });
  }

  function nodeClick(node) {
    activeDept = node;
    tableState.params = { deptId: activeDept.id };
    getList();
  }

  return {
    treeRef,
    deptList,
    tableState,
    tableRegister,
    nodeClick,
    setSearchParams,
    getSelections,
  };
}
