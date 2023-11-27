import type { UserData } from "@/api/system/user/types";
import type { DictData } from "@/api/system/dict/types";
import type { DeptData } from "@/api/system/dept/types";
import type { CorpsData } from "@/api/system/corps/types";
import { msg } from "@/utils/message";
import { listToTree } from "@/utils/tree";
import { userApi } from "@/api/system/user";
import { dictApi } from "@/api/system/dict";
import { isNumber } from "@pureadmin/utils";
import { deptApi } from "@/api/system/dept";
import { corpsApi } from "@/api/system/corps";
import { getUser } from "@/store/modules/user";
import { useTable } from "@/hooks/web/useTable";
import { ref, unref, reactive, nextTick } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { ADMIN_DICT_EDIT_CODE, ADMIN_USER_ROOT } from "@/utils/common";

export function useHook() {
  const title = ref("用户");
  const visible = ref(false);
  const loading = ref(false);
  const adminEditFlag = ref(false);
  const treeRef = ref(null);
  const deptList = ref<DeptData[]>([]);
  let activeDept = reactive<DeptData>({});

  const { register, tableObject, methods } = useTable<UserData>({
    api: userApi,
    pageOrList: "page",
    afterRequest: afterRequest
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
      disabled: ({ root }) => handleBtnDisabled(root)
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => methods.delItem({ ids: id }),
      disabled: ({ root }) => handleBtnDisabled(root)
    }
  ];

  const { getList, setSearchParams } = methods;

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

  function handleBtnDisabled(v) {
    if (!isNumber(v)) return;
    return v === ADMIN_USER_ROOT ? adminEditFlag.value || useUserStoreHook().userInfo.root !== ADMIN_USER_ROOT : false;
  }

  function handleAdd() {
    title.value = "添加用户";
    tableObject.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改用户";
    tableObject.currentRow = data;
    visible.value = true;
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    await write?.elFormRef?.validate(async isValid => {
      if (isValid) {
        loading.value = true;
        const data = (await write?.getFormData()) as UserData;
        const save = data.id ? "update" : "create";
        const res = await userApi[save](data)
          .catch(() => {})
          .finally(() => {
            loading.value = false;
          });
        if (res) {
          visible.value = false;
          msg.success();
          getList();
        }
      }
    });
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
    title,
    visible,
    loading,
    treeRef,
    deptList,
    tableObject,
    operationList,
    register,
    nodeClick,
    handleAdd,
    handleSubmit,
    setSearchParams
  };
}
