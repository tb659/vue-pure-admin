import { ref, unref } from "vue";
import { msg } from "@/utils/msg";
import { ADMIN_ROLE_EMBED } from "@/utils/constants";
import { corpsApi } from "@/api/system/corps";
import { useTable } from "@/hooks/web/useTable";

export function useHook() {
  const title = ref("机构");
  const visible = ref(false);
  const loading = ref(false);

  const { tableRegister, tableState, tableMethods } = useTable<CorpsData>({
    api: corpsApi,
    pageOrList: "page",
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
      disabled: ({ embed }) => embed === ADMIN_ROLE_EMBED,
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => delItem({ ids: id }),
      disabled: ({ embed }) => embed === ADMIN_ROLE_EMBED,
    },
  ];

  const { getList, setSearchParams, delItem, getSelections } = tableMethods;

  getList();

  function handleAdd() {
    title.value = "添加机构";
    tableState.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改机构";
    tableState.currentRow = data;
    visible.value = true;
  }

  async function handleDel() {
    const sels = await getSelections();
    const ids = sels.map(sel => sel.id);
    console.log(ids);
    delItem({ ids: { idList: ids }, multiple: true });
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    const formData = await write?.submit();
    if (formData) {
      loading.value = true;
      const save = formData.id ? "update" : "create";
      const res = await corpsApi[save](formData)
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
    handleDel,
    handleSubmit,
    setSearchParams,
  };
}
