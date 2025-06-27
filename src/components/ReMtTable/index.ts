import Table from "./src";
import type { ElTable } from "element-plus";
import { withInstall } from "@pureadmin/utils";

export interface TableExpose {
  elTableRef?: ComponentRef<typeof ElTable>;
  selections?: Recordable[];
  getSelections: () => Promise<Recordable[]>;
  setSelections: (selections: Recordable[]) => void;
  getElTableExpose: () => void;
  setProps: (props: TableProps) => void;
  delColumn: (field: string) => void;
  setColumn: (props: TableSetProps[]) => void;
  addColumn: (tableColumn: TableColumn, index?: number) => void;
  refresh: () => void;
  getList: () => void;
  delItem: (data: Recordable) => void;
  enableItem: (data: Recordable) => void;
  disableItem: (data: Recordable) => void;
  setSearchParams: (data: Recordable) => void;
  resetPasswordItem: (data: Recordable) => void;
}

export const MtTable = withInstall(Table);

export default MtTable;
