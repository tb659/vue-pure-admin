import Search from "./src/index.vue";
import { withInstall } from "@pureadmin/utils";

export interface SearchExpose {
  setProps: (props: Recordable) => void;
  setValues: (data: Recordable) => void;
  getSchema: <T = FormSchema[]>() => Promise<T>;
  setSchema: (schemaProps: FormSetProps[]) => void;
  addSchema: (formSchema: FormSchema, index?: number) => void;
  delSchema: (field: string) => void;
  getSearchData: <T = Recordable>() => Promise<T>;
  getElFormExpose: () => any;
}
export const MtSearch = withInstall(Search);

export { Search };

export default MtSearch;
