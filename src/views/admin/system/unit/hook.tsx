import type { CorpsData } from "@/api/system/corps/types";
import { ref, unref } from "vue";
import { msg } from "@/utils/message";
import { corpsApi } from "@/api/system/corps";
import { useTable } from "@/hooks/web/useTable";
import { ADMIN_ROLE_EMBED } from "@/utils/common";

export function useHook() {
  const title = ref("机构");
  const visible = ref(false);
  const loading = ref(false);

  const { register, tableObject, methods } = useTable<CorpsData>({
    api: corpsApi,
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
        const data = (await write?.getFormData()) as CorpsData;
        const keys = write.treeRef.getCheckedKeys().concat(write.treeRef.getHalfCheckedKeys());
        const list = write.getList().filter(v => keys.filter(k => v.id === k).length > 0);
        data.resourceList = list.map(v => ({ id: v.id, permissions: v.type }));
        const save = data.id ? "update" : "create";
        const res = await corpsApi[save](data)
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
    tableObject,
    operationList,
    register,
    handleAdd,
    handleDel,
    handleSubmit,
    setSearchParams
  };
}
