<script setup lang="tsx">
import { set } from "lodash-es";
import type { FormItemProp } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import { toRefs, computed, ref, unref, onMounted, watch } from "vue";

import ActionButton from "./components/ActionButton.vue";

import _props from "./props";
import { findIndex } from "@/utils";
import { useForm } from "@/hooks/web/useForm";
import { isEmptyVal, isObject } from "@/utils/is";
import { initModel } from "@/components/ReMtForm/src/helper";

defineOptions({
  name: "MtSearch",
});

const props = defineProps(_props);

const visible = ref(props.expandInitVisible);

const emit = defineEmits(["register", "watch-search", "validate", "search", "reset", "export"]);

const { formRegister, formMethods } = useForm();
const { getFormData, getFormExpose, getElFormExpose } = formMethods;

// 表单数据
const formModel = ref<Recordable>(props.model);

/** 合并后的props */
const newSchema = ref<FormSchema[]>([]);

/** 合并后的props */
const mergeProps = ref<SearchProps>({});

const getProps = computed(() => {
  const propsObj = { ...props };
  Object.assign(propsObj, unref(mergeProps));
  return propsObj;
});

/** 合并props */
function setProps(props: SearchProps = {}) {
  mergeProps.value = Object.assign(unref(mergeProps), props);
}

// 对表单赋值
async function setValues(data: Recordable = {}) {
  formModel.value = Object.assign(props.model, unref(formModel), data);
  const formExpose = await getFormExpose();
  formExpose?.setValues(data);
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
function delSchema(field: string) {
  const { schema } = unref(getProps);

  const index = findIndex(schema, (v: FormSchema) => v.field === field);
  if (index > -1) {
    schema.splice(index, 1);
  }
}

const { isCol, labelWidth, formWidth, inline } = toRefs(props) as unknown as FormProps;

/** 布局按钮在底部时的位置 */
const bottonButtonStyle = computed(() => {
  return {
    textAlign: unref(getProps).buttonPosition as unknown as "left" | "center" | "right",
  };
});

/** 处理按钮 */
const schemaAddButton = computed(() => {
  const propsComputed = unref(getProps);
  let schema: FormSchema[] = cloneDeep(propsComputed.schema);
  /** 展开/收起 */
  if (propsComputed.showExpand && propsComputed.expandProp && !unref(visible)) {
    const index = findIndex(schema, (v: FormSchema) => v.field === propsComputed.expandProp);
    schema.map((v, i) => {
      v.hidden = () => i >= index;
      return v;
    });
  }
  /** 搜索按钮 */
  if (propsComputed.layout === "inline") {
    schema = schema.concat([
      {
        field: "action",
        formItemProps: {
          labelWidth: "0px",
          slots: {
            default: () => {
              return (
                <div>
                  <ActionButton
                    showSearch={propsComputed.showSearch}
                    showReset={propsComputed.showReset}
                    showExport={propsComputed.showExport}
                    showExpand={propsComputed.showExpand}
                    searchLoading={propsComputed.searchLoading}
                    resetLoading={propsComputed.resetLoading}
                    visible={visible.value}
                    onSearch={search}
                    onReset={reset}
                    onExport={_export}
                    onExpand={setVisible}
                  />
                </div>
              );
            },
            label: () => {
              return <span>&nbsp;</span>;
            },
          },
        },
      },
    ]);
  }
  return schema;
});

/** 展开收起点击事件 */
async function setVisible() {
  const elForm = await getElFormExpose();
  elForm?.resetFields();
  visible.value = !unref(visible);
}

/** 搜索按钮事件 */
async function search() {
  const elForm = await getElFormExpose();
  await elForm?.validate(async isValid => {
    if (isValid) {
      emit("search", await filterModel());
    }
  });
}

/** 重置按钮事件 */
async function reset() {
  const elForm = await getElFormExpose();
  elForm?.resetFields();
  emit("reset", await filterModel());
}

/** 导出事件 */
async function _export() {
  emit("export", await filterModel());
}

/** 检验表单 */
function onFormValidate(field: FormItemProp, isValid: boolean, message: string) {
  emit("validate", field, isValid, message);
}

/** 过滤表单空数据 */
async function filterModel() {
  const model = await getFormData();
  if (unref(getProps).removeNoValueItem) {
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
    }, {});
  }
  return model;
}

/** 监听表单结构化数组，重新生成formModel */
watch(
  () => unref(schemaAddButton),
  async (schema = []) => {
    formModel.value = initModel(schema, unref(formModel));
    newSchema.value = schema;
  },
  {
    immediate: true,
    deep: true,
  },
);

const defaultExpose = {
  setProps,
  setValues,
  getSchema,
  setSchema,
  delSchema,
  addSchema,
  getSearchData: getFormData,
  getElFormExpose,
};

defineExpose(defaultExpose);

// 注册
onMounted(() => {
  emit("register", defaultExpose);
  // 表单初始赋值，自动查询
  unref(getProps).autoSearch && search();
});
</script>

<template>
  <MtForm
    :is-col="isCol"
    :in-line="inline"
    :is-custom="false"
    :search-form="true"
    :schema="newSchema"
    :label-width="labelWidth"
    :form-width="formWidth"
    hide-required-asterisk
    class="pt-4 pl-8"
    @register="formRegister"
    @validate="onFormValidate"
    @watch-form="emit('watch-search')"
  />

  <template v-if="layout === 'bottom'">
    <div :style="bottonButtonStyle">
      <ActionButton
        :showSearch="getProps.showSearch"
        :showReset="getProps.showReset"
        :showExport="getProps.showExport"
        :showExpand="getProps.showExpand"
        :searchLoading="getProps.searchLoading"
        :resetLoading="resetLoading"
        :visible="visible"
        @search="search"
        @reset="reset"
        @export="_export"
        @expand="setVisible"
      />
    </div>
  </template>
</template>
