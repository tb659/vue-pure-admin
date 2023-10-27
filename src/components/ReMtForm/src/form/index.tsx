import props from "./props";
import { set } from "lodash-es";
import { ElForm } from "element-plus";
import { getSlot } from "@/utils/tsxHelper";
import { componentMap } from "./componentMap";
import { useRenderRadio } from "./components/useRenderRadio";
import { useRenderSelect } from "./components/useRenderSelect";
import { useRenderCheckbox } from "./components/useRenderCheckbox";
import IconifyIconOnline from "@/components/ReIcon/src/iconifyIconOnline";
import { computed, defineComponent, onMounted, ref, unref, watch } from "vue";

import { setTextPlaceholder, setGridProp, setComponentProps, setItemComponentSlots, initModel, setFormItemSlots } from "./helper";
import { findIndex } from "@/utils";
import { isFunction } from "@pureadmin/utils";

export default defineComponent({
  name: "MtForm",
  props,
  emits: ["register", "watch-form"],
  setup(props, { slots, attrs, expose, emit }) {
    /** 表单数据 */
    const formModel = ref({});

    /** element form 实例 */
    const elFormRef = ref<ComponentRef<typeof ElForm>>();

    /** useForm传入的props */
    const outsideProps = ref<PureFormProps>({});

    /** 合并后的props */
    const mergeProps = ref<PureFormProps>({});

    const getProps = computed(() => {
      const propsObj = { ...props };
      Object.assign(propsObj, unref(mergeProps));
      return propsObj;
    });

    /** 合并props */
    function setProps(props: PureFormProps = {}) {
      mergeProps.value = Object.assign(unref(mergeProps), props);
      outsideProps.value = props;
    }

    /** 对表单赋值 */
    function setValue(data: Recordable = {}) {
      formModel.value = Object.assign(unref(formModel), data);
    }

    /** 设置schema */
    function setSchema(schemaProps: FormSetPropsType[]) {
      const { schema } = unref(getProps);
      for (const v of schema) {
        for (const item of schemaProps) {
          if (v.prop === item.prop) {
            set(v, item.path, item.value);
          }
        }
      }
    }

    /** 增加schema */
    function addSchema(formSchema: FormSchema, index?: number) {
      const { schema } = unref(getProps);
      if (index !== void 0) {
        schema.splice(index, 0, formSchema);
        return;
      }
      schema.push(formSchema);
    }

    /** 删除schema */
    function delSchema(prop: string) {
      const { schema } = unref(getProps);

      const index = findIndex(schema, (v: FormSchema) => v.prop === prop);
      if (index > -1) {
        schema.splice(index, 1);
      }
    }

    /** 获取表单实例 */
    function getElFormRef(): ComponentRef<typeof ElForm> {
      return unref(elFormRef) as ComponentRef<typeof ElForm>;
    }

    expose({
      formModel,
      setValue,
      setProps,
      delSchema,
      addSchema,
      setSchema,
      getElFormRef
    });

    /** 监听表单结构化数组，重新生成formModel */
    watch(
      () => unref(getProps).schema,
      (schema = []) => {
        const model = initModel(schema, unref(formModel));
        formModel.value = model;
      },
      { /* immediate: true, */ deep: true }
    );

    /** 监听表单 */
    watch(
      () => JSON.parse(JSON.stringify(unref(formModel))),
      (form, val) => {
        console.log("form表单---", form, val);
        emit("watch-form", form, val);
      },
      {
        deep: true
      }
    );
    onMounted(() => {
      emit("register", unref(elFormRef)?.$parent, unref(elFormRef));
    });

    /** 渲染options */
    const renderOptions = (item: FormSchema) => {
      switch (item.component) {
        case "Select":
          return useRenderSelect(slots).renderSelectOptions(item);
        case "Radio":
        case "RadioButton":
          return useRenderRadio().renderRadioOptions(item);
        case "Checkbox":
        case "CheckboxButton":
          return useRenderCheckbox().renderChcekboxOptions(item);
        default:
          break;
      }
    };

    /** 渲染formItem */
    const renderFormItem = (item: FormSchema) => {
      /** 单独给只有options属性的组件做判断 */
      const notRenderOptions = ["SelectV2", "Cascader", "Transfer"];
      const slotsMap: Recordable = {
        ...setItemComponentSlots(slots, item?.componentProps?.slots, item.prop)
      };
      if (item?.component !== "SelectV2" && item?.component !== "Cascader" && item?.componentProps?.options) {
        slotsMap.default = () => renderOptions(item);
      }

      const formItemSlots: Recordable = setFormItemSlots(slots, item.prop);
      /** 如果有 labelMsg，自动使用插槽渲染 */
      if (item?.labelMsg) {
        formItemSlots.label = () => {
          return (
            <>
              <el-tooltip placement="right" raw-content>
                {{
                  content: () => <span v-html={item.labelMsg}></span>,
                  default: () => (
                    <span class="pt-2 pr-1">
                      <IconifyIconOnline icon="fa:info-circle" />
                    </span>
                  )
                }}
              </el-tooltip>
              <span>{item.label}</span>
            </>
          );
        };
      }
      const { isCol, formWidth } = unref(getProps);
      return (
        <el-form-item
          style={isCol ? { width: "100%" } : {}}
          {...(item.formItemProps || {})}
          prop={item.prop}
          label={item.label || ""}
        >
          {{
            ...formItemSlots,
            default: () => {
              const Com = componentMap[item.component as string] as ReturnType<typeof defineComponent>;

              const { autoSetPlaceholder } = unref(getProps);

              return slots[item.prop] ? (
                getSlot(slots, item.prop, formModel.value)
              ) : (
                <Com
                  vModel={formModel.value[item.prop]}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  style={{ width: formWidth || "100%", ...item.componentProps?.style }}
                  {...(notRenderOptions.includes(item?.component as string) && item?.componentProps?.options
                    ? { options: item?.componentProps?.options || [] }
                    : {})}
                >
                  {{ ...slotsMap }}
                </Com>
              );
            }
          }}
        </el-form-item>
      );
    };

    const renderFormItemWrap = () => {
      const { schema = [], isCol } = unref(getProps);
      /** hidden属性表示隐藏，不做渲染 */
      return schema
        .filter(v => !(isFunction(v.hidden) && v.hidden({ item: v, model: unref(formModel) })))
        .map(item => {
          /** 如果是 Divider 组件，需要自己占用一行 */
          const isDivider = item.component === "Divider";
          const Com = componentMap["Divider"] as ReturnType<typeof defineComponent>;
          return isDivider ? (
            <Com {...{ contentPosition: "left", ...item.componentProps }}>{item?.label}</Com>
          ) : isCol ? (
            /** 如果需要栅格，需要包裹 ElCol */
            <el-col {...setGridProp(item.colProps)}>{renderFormItem(item)}</el-col>
          ) : (
            renderFormItem(item)
          );
        });
    };

    /** 渲染包裹标签，是否使用栅格布局 */
    const renderWrap = () => {
      const { isCol } = unref(getProps);
      const content = isCol ? <el-row gutter={20}>{renderFormItemWrap()}</el-row> : renderFormItemWrap();
      return content;
    };

    /** 过滤传入Form组件的属性 */
    const getFormBindValue = () => {
      /** 避免在标签上出现多余的属性 */
      const delKeys = ["schema", "isCol", "autoSetPlaceholder", "isCustom", "model"];
      const Props = { ...unref(getProps) };
      for (const key in Props) {
        if (delKeys.indexOf(key) !== -1) {
          delete Props[key];
        }
      }
      return Props;
    };

    return () => (
      <el-form
        {...attrs}
        ref={elFormRef}
        {...getFormBindValue()}
        model={props.isCustom ? props.model : formModel}
        class="bg-bg_color w-[99/100]"
      >
        {{
          /** 如果需要自定义，就什么都不渲染，而是提供默认插槽 */
          default: () => {
            const { isCustom } = unref(getProps);
            return isCustom ? getSlot(slots, "default") : renderWrap();
          }
        }}
      </el-form>
    );
  }
});
