import { ref, unref, nextTick } from "vue";
import type { Search, SearchExpose } from "@/components/ReMtSearch";

export const useSearch = () => {
  // Search实例
  const searchRef = ref<typeof Search & SearchExpose>();

  /**
   * @param ref Search实例
   * @param elRef ElForm实例
   */
  const register = (ref: typeof Search & SearchExpose) => {
    searchRef.value = ref;
  };

  const getSearch = async () => {
    await nextTick();
    const search = unref(searchRef);
    !search && console.error("搜索未注册，请先使用注册方法进行搜索注册！");
    return search;
  };

  // 一些内置的方法
  const methods: SearchExpose = {
    /**
     * @description 设置search组件的props
     * @param field FormItem的field
     */
    setProps: async (props: SearchProps = {}) => {
      const search = await getSearch();
      search?.setProps(props);
      if (props.model) {
        search?.setValues(props.model);
      }
    },

    /**
     * @description 设置form的值
     * @param data 需要设置的数据
     */
    setValues: async (data: Recordable) => {
      const search = await getSearch();
      search?.setValues(data);
    },

    /**
     * @description 获取schema
     */
    getSchema: async <T = FormSchema[]>(): Promise<T> => {
      const form = await getSearch();
      return form?.getSchema();
    },

    /**
     * @description 设置schema
     * @param schemaProps 需要设置的schemaProps
     */
    setSchema: async (schemaProps: FormSetProps[]) => {
      const search = await getSearch();
      search?.setSchema(schemaProps);
    },

    /**
     * @description 新增schema
     * @param formSchema 需要新增数据
     * @param index 在哪里新增
     */
    addSchema: async (formSchema: FormSchema, index?: number) => {
      const search = await getSearch();
      search?.addSchema(formSchema, index);
    },

    /**
     * @description 删除schema
     * @param field 删除哪个数据
     */
    delSchema: async (field: string) => {
      const search = await getSearch();
      search?.delSchema(field);
    },

    /**
     * @description 获取表单数据
     * @returns search表单中的form data
     */
    getSearchData: async <T = Recordable>(): Promise<T> => {
      const search = await getSearch();
      return search?.getSearchData() as T;
    },

    /**
     * @description 获取ElForm组件的实例
     * @returns ElForm instance
     */
    getElFormExpose: async () => {
      const search = await getSearch();
      return search?.getElFormExpose();
    },
  };

  return {
    searchRegister: register,
    searchMethods: methods,
  };
};
