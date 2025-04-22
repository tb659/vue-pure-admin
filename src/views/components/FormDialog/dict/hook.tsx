import { dictApi } from "@/api/system/dict";

import { useTable } from "@/hooks/web/useTable";

export function useHook() {
  const { tableRegister, tableState, tableMethods } = useTable({
    api: dictApi,
    pageOrList: "page",
  });

  const { getList, setSearchParams, getSelections } = tableMethods;

  getList();

  return {
    setSearchParams,

    tableState,
    tableRegister,
    getSelections,
  };
}
