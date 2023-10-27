import { DictData } from "@/api/system/dict/types";
import { useTable } from "@/hooks/web/useTable";
import { dictApi } from "@/api/system/dict";
import { ref, unref } from "vue";
import { useData } from "./data";
import { msg } from "@/utils/message";
import { ADMIN_ROLE_EMBED } from "@/utils/common";

const { searchSchema, formSchema, tableColumns } = useData();

export function useHook() {
  const title = ref("字典");
  const visible = ref(false);
  const loading = ref(false);

  const { register, tableObject, methods } = useTable<DictData>({
    api: dictApi,
    pageOrList: "page"
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
      disabled: ({ embed }) => embed === ADMIN_ROLE_EMBED
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => delItem({ ids: id }),
      disabled: ({ embed }) => embed === ADMIN_ROLE_EMBED
    }
  ];

  const { getList, setSearchParams, delItem, getSelections } = methods;

  getList();

  function handleAdd() {
    title.value = "添加字典";
    tableObject.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改字典";
    tableObject.currentRow = data;
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
    await write?.elFormRef?.validate(async isValid => {
      if (isValid) {
        loading.value = true;
        const data = (await write?.getFormData()) as DictData;
        const save = data.id ? "update" : "create";
        const res = await dictApi[save](data)
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

  return {
    title,
    visible,
    loading,
    formSchema,
    tableObject,
    searchSchema,
    tableColumns,
    operationList,
    register,
    handleAdd,
    handleDel,
    handleSubmit,
    setSearchParams
  };
}
