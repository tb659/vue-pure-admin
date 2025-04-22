import Table from "./src";
import type { ElTable } from "element-plus";
import { withInstall } from "@pureadmin/utils";

export interface TableExpose {
  setProps: (props: Recordable) => void;
  setColumn: (columnProps: TableSetProps[]) => void;
  addColumn: (column: TableColumn, index?: number) => void;
  delColumn: (field: string) => void;
  elTableRef: ComponentRef<typeof ElTable>;
  selections: Recordable[];
}

export const MtTable = withInstall(Table);

export default MtTable;
