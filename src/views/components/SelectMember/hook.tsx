import { ref, reactive, nextTick } from "vue";

import { userApi } from "@/api/system/user";
import { deptApi } from "@/api/system/dept";

import { listToTree } from "@/utils/tree";
import { useTable } from "@/hooks/web/useTable";
import { useSearch } from "@/hooks/web/useSearch";

const { searchRegister, searchMethods } = useSearch();

export function useHook() {
  const treeRef = ref(null);
  const deptList = ref<DeptData[]>([]);
  let activeDept = reactive<DeptData>({});

  const { tableRegister, tableState, tableMethods } = useTable<UserData>({
    api: userApi,
    pageOrList: "page",
  });

  const { getList, setColumn, setSearchParams, getSelections } = tableMethods;
  const { setSchema } = searchMethods;

  initDept();

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
    setColumn,
    setSchema,
    tableRegister,
    searchRegister,
    nodeClick,
    setSearchParams,
    getSelections,
  };
}
