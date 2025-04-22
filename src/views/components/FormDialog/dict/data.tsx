import { reactive } from "vue";
import { useSearch } from "@/hooks/web/useSearch";

export function useData() {
  const { searchRegister, searchMethods } = useSearch();

  const searchSchema = reactive<FormSchema[]>([
    {
      field: "name",
      component: "Input",
      componentProps: {
        placeholder: "请输入名称",
      },
    },
    {
      field: "code",
      component: "Input",
      componentProps: {
        placeholder: "请输入字典编码",
      },
    },
  ]);

  const tableColumns: TableColumn[] = [
    {
      label: "勾选",
      type: "selection",
      width: 55,
      align: "left",
      fixed: "left",
    },
    {
      label: "字典名称",
      field: "name",
    },
    {
      label: "字典编码",
      field: "code",
    },
  ];

  return {
    searchSchema,
    searchMethods,
    searchRegister,

    tableColumns,
  };
}
