import Form from "./src";
import { withInstall } from "@pureadmin/utils";

export interface FormExpose {
  formModel: Recordable;
  setProps: (props: Recordable) => void;
  setValues: (data: Recordable) => void;
  getSchema: <T = FormSchema[]>() => Promise<T>;
  setSchema: (schemaProps: FormSetProps[]) => void;
  addSchema: (formSchema: FormSchema, index?: number) => void;
  delSchema: (field: string) => void;
  getComponentExpose: (field: string) => any;
  getFormItemExpose: (field: string) => any;
}
export const MtForm = withInstall(Form);

export { Form };

export default MtForm;
