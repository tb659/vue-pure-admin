import { workflowApi } from "@/api/system/workflow";
import { useTable } from "@/hooks/web/useTable";
import { STATUS_TYPE } from "@/utils/constants";
import { useRouter } from "vue-router";
import { ref, unref } from "vue";
import { msg } from "@/utils/msg";
import { useData } from "./data";

const { workflowOptions } = useData();

export function useHook() {
  const router = useRouter();

  const { tableRegister, tableState, tableMethods } = useTable<WorkflowData>({
    api: workflowApi,
    pageOrList: "list",
    noPagination: true,
  });

  const { getList, setSearchParams, delItem, getSelections, enableItem, disableItem } = tableMethods;

  const operationList: TableOperation[] = [
    {
      label: "设置",
      type: "primary",
      action: handleEdit,
    },
    {
      label: "开启",
      type: "primary",
      action: ({ id }) => enableItem({ ids: id, info: "确定要开启么", infoKey: "开启成功" }),
      hidden: row => row.status !== STATUS_TYPE.DISABLED_V,
    },
    {
      label: "关闭",
      type: "primary",
      action: ({ id }) => disableItem({ ids: id, info: "确定要关闭么", infoKey: "关闭成功" }),
      hidden: row => row.status !== STATUS_TYPE.ENABLED_V,
    },
  ];

  getList();

  const title = ref("审批设置");
  const visible = ref(false);
  const loading = ref(false);

  function handleAdd() {
    title.value = "添加审批流程";
    tableState.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    const route = router.resolve({
      name: "WorkflowSet",
      query: { title: `${data.name}-审批设置`, id: data.id, type: data.type },
    });
    window.open(route.href, "_blank");
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
      formData.name = workflowOptions.filter(item => item.value === formData.type)[0]?.name;
      console.log(formData);
      loading.value = true;
      const save = formData.id ? "update" : "create";
      const res = await workflowApi[save](formData)
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
