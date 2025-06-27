import Form from "./src";
import { withInstall } from "@pureadmin/utils";

export interface FormExpose {
  formModel?: Recordable;
  setProps: (props: Recordable) => void;
  setValues: (data: Recordable) => void;
  getSchema: <T = FormSchema[]>() => Promise<T>;
  setSchema: (schemaProps: FormSetProps[]) => void;
  addSchema: (formSchema: FormSchema, index?: number) => void;
  delSchema: (field: string) => void;
  resetFields: () => void;
  getFormData: <T = Recordable | undefined>() => Promise<T>;
  getFormExpose: () => any;
  getElFormExpose: () => any;
  getFormItemExpose: (field: string) => any;
  getComponentExpose: (field: string) => any;
}
export const MtForm = withInstall(Form);

export { Form };

export default MtForm;
