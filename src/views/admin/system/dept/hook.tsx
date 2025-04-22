import { ref, unref } from "vue";
import { listToTree } from "@/utils/tree";
import { deptApi } from "@/api/system/dept";
import { useTable } from "@/hooks/web/useTable";

import { useData } from "./data";
const { formSchema } = useData();

export function useHook() {
  const title = ref("部门");
  const visible = ref(false);
  const loading = ref(false);

  const { tableRegister, tableState, tableMethods, elTableRef } = useTable<DeptData>({
    api: deptApi,
    afterRequest: afterRequest,
    pageOrList: "list",
    noPagination: true,
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => tableMethods.delItem({ ids: id }),
    },
  ];

  const { getList, setSearchParams } = tableMethods;

  getList();

  function afterRequest(list) {
    return listToTree(list, { pid: "parentDeptId" });
  }

  function handleAdd() {
    title.value = "添加部门";
    formSchema.filter(v => v.field === "parentDeptId")[0].value = 0;
    tableState.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改部门";
    formSchema.filter(v => v.field === "parentDeptId")[0].value = data.id;
    tableState.currentRow = data;
    visible.value = true;
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    const formData = await write?.submit();
    if (formData) {
      loading.value = true;
      const save = formData.id ? "update" : "create";
      const res = await deptApi[save](formData)
        .catch(() => {})
        .finally(() => {
          loading.value = false;
        });
      if (res) {
        visible.value = false;
        getList();
      }
    }
  }

  return {
    title,
    visible,
    loading,
    elTableRef,
    tableState,
    operationList,
    tableRegister,
    handleAdd,
    handleSubmit,
    setSearchParams,
  };
}
