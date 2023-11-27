import type { DeptData } from "@/api/system/dept/types";
import { ref, unref } from "vue";
import { listToTree } from "@/utils/tree";
import { deptApi } from "@/api/system/dept";
import { useTable } from "@/hooks/web/useTable";

export function useHook() {
  const title = ref("部门");
  const visible = ref(false);
  const loading = ref(false);

  const { register, tableObject, methods, elTableRef } = useTable<DeptData>({
    api: deptApi,
    afterRequest: afterRequest,
    pageOrList: "list"
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => methods.delItem({ ids: id })
    }
  ];

  const { getList, setSearchParams } = methods;

  getList();

  function afterRequest(list) {
    return listToTree(list, { pid: "parentDeptId" });
  }

  function handleAdd() {
    title.value = "添加部门";
    tableObject.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改部门";
    tableObject.currentRow = data;
    visible.value = true;
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    await write?.elFormRef?.validate(async isValid => {
      if (isValid) {
        loading.value = true;
        const data = (await write?.getFormData()) as DeptData;
        const save = data.id ? "update" : "create";
        const res = await deptApi[save](data)
          .catch(() => {})
          .finally(() => {
            loading.value = false;
          });
        if (res) {
          visible.value = false;
          getList();
        }
      }
    });
  }

  return {
    title,
    visible,
    loading,
    elTableRef,
    tableObject,
    operationList,
    register,
    handleAdd,
    handleSubmit,
    setSearchParams
  };
}
