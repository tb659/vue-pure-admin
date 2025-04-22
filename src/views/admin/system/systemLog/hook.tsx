import { systemLogApi } from "@/api/system/systemLog";
import { useTable } from "@/hooks/web/useTable";

export function useHook() {
  const { tableRegister, tableState, tableMethods } = useTable<DictData>({
    api: systemLogApi,
    pageOrList: "page",
  });

  const operationList: TableOperation[] = [];

  const { getList, setSearchParams } = tableMethods;
  getList();

  function handleExport(data) {
    systemLogApi.exportOrDownloadFileByOpen(true, data, systemLogApi.exportUrl());
  }

  return {
    tableState,
    operationList,
    tableRegister,
    handleExport,
    setSearchParams,
  };
}
