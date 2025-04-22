import { ref, unref } from "vue";
import { msg } from "@/utils/msg";
import { isNumber } from "@pureadmin/utils";
import { userApi } from "@/api/system/user";
import { dictApi } from "@/api/system/dict";
import { useTable } from "@/hooks/web/useTable";
import { useUserStoreHook } from "@/store/modules/user";
import { ADMIN_DICT_EDIT_CODE, ADMIN_USER_ROOT } from "@/utils/constants";

export function useHook() {
  const title = ref("用户");
  const visible = ref(false);
  const loading = ref(false);
  const adminEditFlag = ref(false);

  const { tableRegister, tableState, tableMethods } = useTable<UserData>({
    api: userApi,
    pageOrList: "page",
    afterRequest: afterRequest,
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
      disabled: ({ root }) => handleBtnDisabled(root),
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => tableMethods.delItem({ ids: id }),
      disabled: ({ root }) => handleBtnDisabled(root),
    },
  ];

  const { getList, setSearchParams } = tableMethods;

  getList();

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
    return v === ADMIN_USER_ROOT ? adminEditFlag.value || useUserStoreHook().userInfo?.root !== ADMIN_USER_ROOT : false;
  }

  function handleAdd() {
    title.value = "添加用户";
    tableState.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改用户";
    tableState.currentRow = data;
    visible.value = true;
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    const formData = await write?.submit();
    if (formData) {
      loading.value = true;
      const save = formData.id ? "update" : "create";
      const res = await userApi[save](formData)
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
  }

  return {
    title,
    visible,
    loading,
    tableState,
    operationList,
    tableRegister,
    handleAdd,
    handleSubmit,
    setSearchParams,
  };
}
