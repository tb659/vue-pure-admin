import Form from "./src/form";
import { ElForm } from "element-plus";
import { withInstall } from "@pureadmin/utils";

export interface FormExpose {
  setValue: (data: Recordable) => void;
  setProps: (props: Recordable) => void;
  delSchema: (field: string) => void;
  addSchema: (formSchema: FormSchema, index?: number) => void;
  setSchema: (schemaProps: FormSetPropsType[]) => void;
  formModel: Recordable;
  getElFormRef: () => ComponentRef<typeof ElForm>;
}
export const PureForm = withInstall(Form);

export { Form };

export default PureForm;
