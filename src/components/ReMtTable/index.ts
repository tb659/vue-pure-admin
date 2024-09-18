import Table from "./src/index";
import { ElTable } from "element-plus";
import { withInstall } from "@/utils";

export interface TableExpose {
  setProps: (props: Recordable) => void;
  setColumn: (columnProps: TableSetPropsType[]) => void;
  selections: Recordable[];
  elTableRef: ComponentRef<typeof ElTable>;
}

export const MtTable = withInstall(Table);

export default MtTable;
