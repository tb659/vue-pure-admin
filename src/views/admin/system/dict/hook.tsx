import { ref, unref } from "vue";
import { msg } from "@/utils/msg";
import { dictApi } from "@/api/system/dict";
import { useTable } from "@/hooks/web/useTable";
import { DICT_EMBED } from "@/utils/constants";
export function useHook() {
  const title = ref("字典");
  const visible = ref(false);
  const loading = ref(false);

  const { tableRegister, tableState, tableMethods } = useTable<DictData>({
    api: dictApi,
    pageOrList: "page",
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
      disabled: ({ embed }) => embed === DICT_EMBED,
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => delItem({ ids: id }),
      disabled: ({ embed }) => embed === DICT_EMBED,
    },
  ];

  const { getList, setSearchParams, delItem, getSelections } = tableMethods;

  // getList();
  // 分页改变查询
  tableState.pageSize = 100;

  function handleAdd() {
    title.value = "添加字典";
    tableState.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改字典";
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
      const res = await dictApi[save](formData)
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

  function handleExport(data) {
    dictApi.exportOrDownloadFileByOpen(true, data, dictApi.exportUrl());
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
    handleExport,
    setSearchParams,
  };
}
