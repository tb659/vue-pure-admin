import type { ElForm, ElFormItem } from "element-plus";
import type { Form, FormExpose } from "@/components/ReMtForm";

import { ref, unref, nextTick } from "vue";

import { isEmptyVal, isObject } from "@/utils/is";

export const useForm = () => {
  /** From实例 */
  const formRef = ref<typeof Form & FormExpose>();

  /** ElForm实例 */
  const elFormRef = ref<ComponentRef<typeof ElForm>>();

  /**
   * @description 注册表单
   * @param ref Form实例
   * @param elRef ElForm实例
   */
  const register = (ref: typeof Form & FormExpose, elRef: ComponentRef<typeof ElForm>) => {
    formRef.value = ref;
    elFormRef.value = elRef;
  };

  const getForm = async () => {
    await nextTick();
    const form = unref(formRef);
    !form && console.error("表单未注册，请先使用注册方法进行表单注册！");
    return form;
  };

  /** 一些内置的方法 */
  const methods: FormExpose = {
    /**
     * @description 设置form组件的props
     * @param props form组件的props
     */
    setProps: async (props: FormProps = {}) => {
      const form = await getForm();
      form?.setProps(props);
      if (props.model) {
        form?.setValues(props.model);
      }
    },

    /**
     * @description 设置form的值
     * @param data 需要设置的数据
     */
    setValues: async (data: Recordable) => {
      const form = await getForm();
      form?.setValues(data);
    },

    /**
     * @description 获取schema
     */
    getSchema: async <T = FormSchema[]>(): Promise<T> => {
      const form = await getForm();
      return form?.getSchema();
    },

    /**
     * @description 设置schema
     * @param schemaProps 需要设置的schemaProps
     */
    setSchema: async (schemaProps: FormSetProps[]) => {
      const form = await getForm();
      form?.setSchema(schemaProps);
    },

    /**
     * @description 新增schema
     * @param formSchema 需要新增数据
     * @param index 在哪里新增
     */
    addSchema: async (formSchema: FormSchema, index?: number) => {
      const form = await getForm();
      form?.addSchema(formSchema, index);
    },

    /**
     * @description 删除schema
     * @param field 删除哪个数据
     */
    delSchema: async (field: string) => {
      const form = await getForm();
      form?.delSchema(field);
    },

    /**
     * @description 重置表单
     */
    resetFields: async () => {
      const form = await getForm();
      form?.resetFields();
    },

    /**
     * @description 获取表单数据
     * @returns form data
     */
    getFormData: async <T = Recordable>(filterEmptyVal = true): Promise<T> => {
      const form = await getForm();
      const model = form?.formModel as any;
      if (filterEmptyVal) {
        // 使用reduce过滤空值，并返回一个新对象
        return Object.keys(model).reduce((prev, next) => {
          const value = model[next];
          if (!isEmptyVal(value)) {
            if (isObject(value)) {
              if (Object.keys(value).length > 0) {
                prev[next] = value;
              }
            } else {
              prev[next] = value;
            }
          }
          return prev;
        }, {}) as T;
      } else {
        return model as T;
      }
    },

    /**
     * @description 获取formItem组件的实例
     * @param field 表单项唯一标识
     * @returns formItem instance
     */
    getFormItemExpose: async (field: string) => {
      const form = await getForm();
      return form?.getFormItemExpose(field) as ComponentRef<typeof ElFormItem>;
    },

    /**
     * @description 获取表单组件的实例
     * @param field 表单项唯一标识
     * @returns component instance
     */
    getComponentExpose: async (field: string) => {
      const form = await getForm();
      return form?.getComponentExpose(field);
    },

    getFormExpose: async () => {
      await getForm();
      return unref(formRef);
    },

    /**
     * @description 获取ElForm组件的实例
     * @returns ElForm instance
     */
    getElFormExpose: async () => {
      await getForm();
      return unref(elFormRef);
    },
  };

  return {
    formRegister: register,
    formMethods: methods,
  };
};
