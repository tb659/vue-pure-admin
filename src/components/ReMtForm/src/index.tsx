// import "./index.scss";
import type { ElForm } from "element-plus";
import { get, set } from "lodash-es";
import { computed, defineComponent, onMounted, ref, nextTick, unref, watch, Fragment } from "vue";

import { useRenderRadio } from "./components/useRenderRadio";
import { useRenderSelect } from "./components/useRenderSelect";
import { useRenderCheckbox } from "./components/useRenderCheckbox";

import props from "./props";
import { findIndex } from "@/utils";
import { isFunction } from "@/utils/is";
import { getSlot } from "@/utils/tsxHelper";
import { componentMap } from "./componentMap";
import {
  setTextPlaceholder,
  setGridProp,
  setComponentProps,
  setItemComponentSlots,
  initModel,
  ComponentNameEnum,
  setDisabledDate,
} from "./helper";

import InfoCircle from "~icons/fa/info-circle";
import { required } from "@/utils/validator";

const { renderSelectOptions } = useRenderSelect();
const { renderRadioOptions } = useRenderRadio();
const { renderCheckboxOptions } = useRenderCheckbox();

export default defineComponent({
  name: "MtForm",
  props,
  emits: ["register", "watch-form"],
  setup(props, { slots, attrs, expose, emit }) {
    // 表单数据
    const formModel = ref<Recordable>(props.model);

    // rulescopy 应对添加调整表单必填
    const { rules, ...attrsData } = attrs;
    const rulesCopy = ref(rules);

    /** element form 实例 */
    const elFormRef = ref<ComponentRef<typeof ElForm>>();

    // 存储表单实例
    const formComponents = ref({});

    // 存储form-item实例
    const formItemComponents = ref({});

    /** 合并后的props */
    const mergeProps = ref<FormProps>({});

    const getProps = computed(() => {
      const propsObj = { ...props };
      Object.assign(propsObj, unref(mergeProps));
      return propsObj;
    });

    /** 合并props */
    function setProps(props: FormProps = {}) {
      mergeProps.value = Object.assign(unref(mergeProps), props);
    }

    /** 对表单赋值 */
    function setValues(data: Recordable = {}) {
      formModel.value = Object.assign(unref(formModel), data);
    }

    /** 获取schema */
    function getSchema() {
      const { schema } = unref(getProps);
      return schema;
    }

    /** 设置schema */
    function setSchema(schemaProps: FormSetProps[]) {
      const { schema } = unref(getProps);
      for (const v of schema) {
        for (const item of schemaProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value);
            if (item.path === "required") {
              // 如果必填被调整更新
              item.value ? (rulesCopy.value[item.field] = v["requiredCopy"]) : delete rulesCopy.value[item.field];
              setTimeout(() => {
                nextTick(() => elFormRef.value.clearValidate());
              }, 1);
            }
          }
        }
      }
    }

    /** 增加schema */
    function addSchema(formSchema: FormSchema, index?: number) {
      // 如果必填需要处理更新rules
      if (formSchema.required) {
        rulesCopy.value[formSchema.field] = [formSchema["requiredCopy"] || required()];
        setTimeout(() => {
          nextTick(() => elFormRef.value.clearValidate());
        }, 1);
      }
      const { schema } = unref(getProps);
      if (index !== void 0) {
        schema.splice(index, 0, formSchema);
        return;
      }
      schema.push(formSchema);
    }

    /** 删除schema */
    function delSchema(field: string) {
      const { schema } = unref(getProps);

      const index = findIndex(schema, (v: FormSchema) => v.field === field);
      if (index > -1) {
        schema.splice(index, 1);
      }
    }

    async function getOptions(fn: Function, item: FormSchema) {
      const options = await fn(item.field);
      setSchema([
        {
          field: item.field,
          path:
            item.component === ComponentNameEnum.TREE_SELECT || item.component === ComponentNameEnum.TRANSFER
              ? "componentProps.data"
              : "componentProps.options",
          value: options || [],
        },
      ]);
    }

    /**
     * @description: 获取表单组件实例
     * @param filed 表单字段
     */
    function getComponentExpose(filed: string) {
      return unref(formComponents)[filed];
    }

    /**
     * @description: 获取formItem实例
     * @param filed 表单字段
     */
    function getFormItemExpose(filed: string) {
      return unref(formItemComponents)[filed];
    }

    function setComponentRefMap(ref: any, filed: string) {
      formComponents.value[filed] = ref;
    }

    function setFormItemRefMap(ref: any, filed: string) {
      formItemComponents.value[filed] = ref;
    }

    /** 监听表单结构化数组，重新生成formModel */
    watch(
      () => unref(getProps).schema,
      (schema = []) => {
        formModel.value = initModel(schema, unref(formModel));
      },
      { immediate: true, deep: true },
    );

    /** 监听表单 */
    watch(
      () => JSON.parse(JSON.stringify(unref(formModel))),
      (form, val) => {
        // 先清除必填提示
        elFormRef?.value?.clearValidate();
        if (JSON.stringify(form) !== JSON.stringify(val)) {
          console.log(`${unref(getProps).searchForm ? "search表单------" : "form表单------"}`, form, val);
          emit("watch-form", form, val);
        }
      },
      { deep: true },
    );

    expose({
      formModel,
      setProps,
      setValues,
      getSchema,
      setSchema,
      addSchema,
      delSchema,
      getComponentExpose,
      getFormItemExpose,
    });

    // 注册
    onMounted(() => {
      emit("register", unref(elFormRef)?.$parent, unref(elFormRef));
    });

    /** 渲染formItem */
    const renderFormItem = (item: FormSchema) => {
      // 如果有optionApi，优先使用optionApi且初始化数据查询一次 已弃用，可使用useSearch更方便
      if (item.componentProps?.optionApi && !item.componentProps?.optionsInitQuery) {
        // console.log("内部自动调用接口，不影响其它渲染", item.field);
        getOptions(item.componentProps.optionApi, item);
      }

      const formItemSlots: Recordable = {
        default: () => {
          if (slots[item.field]) {
            return getSlot(slots, item.field, { formModel: formModel.value });
          } else if (item?.formItemProps?.slots?.default) {
            return item?.formItemProps?.slots?.default({ formModel: formModel.value });
          } else {
            const Com = (componentMap[item.component as string] as ReturnType<typeof defineComponent>) || <div></div>;

            const { autoSetPlaceholder, formWidth } = unref(getProps);

            const componentSlots = (item?.componentProps as any)?.slots || {};
            const slotsMap: Recordable = {
              ...setItemComponentSlots(componentSlots),
            };
            // 如果是select组件，并且没有自定义模板，自动渲染options
            if (item.component === ComponentNameEnum.SELECT) {
              slotsMap.default = !componentSlots.default
                ? () => renderSelectOptions(item)
                : () => {
                    return componentSlots.default(unref((item?.componentProps as SelectComponentProps)?.options));
                  };
            }

            // 虚拟列表
            if (item.component === ComponentNameEnum.SELECT_V2 && componentSlots.default) {
              slotsMap.default = ({ item }) => {
                return componentSlots.default(item);
              };
            }

            // 单选框组和按钮样式
            if (item.component === ComponentNameEnum.RADIO_GROUP || item.component === ComponentNameEnum.RADIO_BUTTON) {
              slotsMap.default = !componentSlots.default
                ? () => renderRadioOptions(item)
                : () => {
                    return componentSlots.default(unref((item?.componentProps as CheckboxGroupComponentProps)?.options));
                  };
            }

            // 多选框组和按钮样式
            if (item.component === ComponentNameEnum.CHECKBOX_GROUP || item.component === ComponentNameEnum.CHECKBOX_BUTTON) {
              slotsMap.default = !componentSlots.default
                ? () => renderCheckboxOptions(item)
                : () => {
                    return componentSlots.default(unref((item?.componentProps as RadioGroupComponentProps)?.options));
                  };
            }

            const Comp = () => {
              // 如果field是多层路径，需要转换成对象
              const itemVal = computed({
                get: () => {
                  return get(formModel.value, item.field);
                },
                set: val => {
                  set(formModel.value, item.field, val);
                },
              });

              return (
                <Com
                  vModel={itemVal.value}
                  ref={(el: any) => setComponentRefMap(el, item.field)}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setDisabledDate(item, unref(formModel))}
                  {...setComponentProps(item)}
                  style={{ width: formWidth || "100%", ...item.componentProps?.style }}
                  onEmitValue={val => setValues({ [item.field]: val })}
                >
                  {{ ...slotsMap }}
                </Com>
              );
              // <Com
              //   vModel={formModel.value[item.field]}
              //   {...(autoSetPlaceholder && setTextPlaceholder(item))}
              //   {...setComponentProps(item)}
              //   style={{ width: formWidth || "100%", ...item.componentProps?.style }}
              //   {...(notRenderOptions.includes(item?.component as string) && item?.componentProps?.options
              //     ? { options: item?.componentProps?.options || [] }
              //     : {})}
              //   onEmitValue={val => setValues({ [item.field]: val })}
              // >
              //   {{ ...slotsMap }}
              // </Com>
            };

            return <Fragment>{Comp()}</Fragment>;
          }
        },
      };

      if (item?.labelMsg) {
        /** 如果有 labelMsg，自动使用插槽渲染 */
        formItemSlots.label = () => {
          return (
            <Fragment>
              <el-tooltip placement="right" raw-content>
                {{
                  content: () => <span v-html={item.labelMsg}></span>,
                  default: () => (
                    <div class="h-full flex items-center pr-1">
                      <iconify-icon-offline icon={InfoCircle} />
                    </div>
                  ),
                }}
              </el-tooltip>
              <span>{item.label}</span>
            </Fragment>
          );
        };
      } else {
        /** 渲染 普通 label */
        if (item?.formItemProps?.slots?.label) {
          formItemSlots.label = (...args: any[]) => {
            return (item?.formItemProps?.slots as any)?.label(...args);
          };
        }
      }
      if (item?.formItemProps?.slots?.error) {
        formItemSlots.error = (...args: any[]) => {
          return (item?.formItemProps?.slots as any)?.error(...args);
        };
      }
      const { isCol } = unref(getProps);
      return (
        <el-form-item
          prop={item.field}
          class={item.label ? "" : "no-label  "}
          label={item.label || ""}
          ref={(el: any) => setFormItemRefMap(el, item.field)}
          style={isCol ? { width: "100%" } : {}}
          {...(item.formItemProps || {})}
        >
          {formItemSlots}
        </el-form-item>
      );
    };

    const renderFormItemWrap = () => {
      const { schema = [], isCol } = unref(getProps);
      /** hidden属性表示隐藏，不做渲染 */
      return schema
        .filter(v => !(isFunction(v.hidden) && v.hidden({ schema: v, model: unref(formModel) })))
        .map(item => {
          /** 如果是 Divider 组件，需要自己占用一行 */
          const isDivider = item.component === "Divider";
          const Com = componentMap["Divider"] as ReturnType<typeof defineComponent>;
          return isDivider ? (
            <Com {...{ contentPosition: "left", ...item.componentProps }}>{item?.label}</Com>
          ) : isCol ? (
            /** 如果需要栅格，需要包裹 ElCol */
            <el-col {...setGridProp(item.colProps)} {...item.colItemProps}>
              {renderFormItem(item)}
            </el-col>
          ) : (
            renderFormItem(item)
          );
        });
    };

    /** 渲染包裹标签，是否使用栅格布局 */
    const renderWrap = () => {
      const { isCol } = unref(getProps);
      return isCol ? <el-row gutter={20}>{renderFormItemWrap()}</el-row> : renderFormItemWrap();
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
      return Props as FormProps;
    };

    return () => (
      <el-form
        {...attrsData}
        {...rulesCopy}
        ref={elFormRef}
        {...getFormBindValue()}
        model={unref(getProps).isCustom ? unref(getProps).model : formModel}
        class={["bg-bg_color", "w-[99/100]", unref(getProps).isCol ? "mt-form-container" : ""]}
        onSubmit={(e: Event) => {
          e.preventDefault();
        }}
      >
        {{
          /** 如果需要自定义，就什么都不渲染，而是提供默认插槽 */
          default: () => {
            const { isCustom } = unref(getProps);
            return isCustom ? getSlot(slots, "default") : renderWrap();
          },
        }}
      </el-form>
    );
  },
});
