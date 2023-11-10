import { UserData } from "@/api/system/user/types";
import { useTable } from "@/hooks/web/useTable";
import { userApi } from "@/api/system/user";
import { ref, reactive, nextTick } from "vue";
import { dictApi } from "@/api/system/dict";
import { DictData } from "@/api/system/dict/types";
import { ADMIN_DICT_EDIT_CODE, ADMIN_USER_ROOT } from "@/utils/common";
import { listToTree } from "@/utils/tree";
import { deptApi } from "@/api/system/dept";
import { DeptData } from "@/api/system/dept/types";
import { corpsApi } from "@/api/system/corps";
import { getUser } from "@/store/modules/user";
import { CorpsData } from "@/api/system/corps/types";

export function useHook() {
  const adminEditFlag = ref(false);
  const treeRef = ref(null);
  const deptList = ref<DeptData[]>([]);
  let activeDept = reactive<DeptData>({});

  const { register, tableObject, methods } = useTable<UserData>({
    api: userApi,
    pageOrList: "page",
    afterRequest: afterRequest
  });

  const { getList, setSearchParams, getSelections } = methods;

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
    const corpsData = await corpsApi.querySelectListByUserName<CorpsData[]>({ corpId: getUser("corpId") });
    const topLevelPostName = corpsData.data.filter(item => item.id === getUser("corpId"))[0].corpName;
    // 把机构加在最顶部
    deptList.value.unshift({ name: topLevelPostName, id: -1 });
    activeDept = deptList.value[0];
    nextTick(() => {
      treeRef.value.setCurrentKey(activeDept.id);
      getList();
    });
  }

  function nodeClick(node) {
    activeDept = node;
    tableObject.params = { deptId: activeDept.id };
    getList();
  }

  return {
    treeRef,
    deptList,
    tableObject,
    register,
    nodeClick,
    setSearchParams,
    getSelections
  };
}
