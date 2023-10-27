import type { Slots } from "vue";
import { getSlot } from "@/utils/tsxHelper";
import { transformI18n, $t } from "@/plugins/i18n";
import { isFunction } from "@pureadmin/utils";

/**
 *
 * @param schema 对应组件数据
 * @returns 返回提示信息对象
 * @description 用于自动设置placeholder
 */
export const setTextPlaceholder = (schema: FormSchema): PlaceholderMoel => {
  const textMap = ["Input", "Autocomplete", "InputNumber", "InputPassword"];
  const selectMap = ["Select", "TimePicker", "DatePicker", "TimeSelect", "TimeSelect"];
  if (textMap.includes(schema?.component as string)) {
    return {
      placeholder: transformI18n($t("form.inputText"))
    };
  }
  if (selectMap.includes(schema?.component as string)) {
    // 一些范围选择器
    const twoTextMap = ["datetimerange", "daterange", "monthrange", "datetimerange", "daterange"];
    if (twoTextMap.includes((schema?.componentProps?.type || schema?.componentProps?.isRange) as string)) {
      return {
        startPlaceholder: transformI18n($t("form.startTimeText")),
        endPlaceholder: transformI18n($t("form.endTimeText")),
        rangeSeparator: "-"
      };
    } else {
      return {
        placeholder: transformI18n($t("form.selectText"))
      };
    }
  }
  return {};
};

/**
 *
 * @param col 内置栅格
 * @returns 返回栅格属性
 * @description 合并传入进来的栅格属性
 */
export const setGridProp = (col: ColProps = {}): ColProps => {
  const colProps: ColProps = {
    // 如果有span，代表用户优先级更高，所以不需要默认栅格
    ...(col.span ? {} : { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }),
    ...col
  };
  return colProps;
};

/**
 *
 * @param item 传入的组件属性
 * @returns 默认添加 clearable 属性
 */
export const setComponentProps = (item: FormSchema): Recordable => {
  const notNeedClearable = ["ColorPicker"];
  const componentProps: Recordable = notNeedClearable.includes(item.component as string)
    ? { ...item.componentProps }
    : {
        clearable: true,
        ...item.componentProps
      };
  // 需要删除额外的属性
  delete componentProps?.slots;
  return componentProps;
};

/**
 *
 * @param slots 插槽
 * @param slotsProps 插槽属性
 * @param prop 字段名
 */
export const setItemComponentSlots = (slots: Slots, slotsProps: Recordable = {}, prop: string): Recordable => {
  const slotObj: Recordable = {};
  for (const key in slotsProps) {
    if (slotsProps[key]) {
      // 由于组件有可能重复，需要有一个唯一的前缀
      slotObj[key] = (data: Recordable) => {
        return getSlot(slots, `${prop}-${key}`, data);
      };
    }
  }
  return slotObj;
};

/**
 *
 * @param schema Form表单结构化数组
 * @param formModel FormMoel
 * @returns FormMoel
 * @description 生成对应的formModel
 */
export const initModel = (schema: FormSchema[], formModel: Recordable) => {
  const model: Recordable = { ...formModel };
  schema.map(v => {
    // 如果是hidden存在且返回true，就删除对应的值
    if (isFunction(v.hidden) && v.hidden({ item: v, model })) {
      delete model[v.prop];
    } else if (v.component && v.component !== "Divider") {
      const hasField = Reflect.has(model, v.prop);
      // 如果先前已经有值存在，则不进行重新赋值，而是采用现有的值
      model[v.prop] = hasField ? model[v.prop] : v.value !== void 0 ? v.value : "";
    }
  });
  return model;
};

/**
 * @param slots 插槽
 * @param prop 字段名
 * @returns 返回FormIiem插槽
 */
export const setFormItemSlots = (slots: Slots, prop: string): Recordable => {
  const slotObj: Recordable = {};
  if (slots[`${prop}-error`]) {
    slotObj["error"] = (data: Recordable) => {
      return getSlot(slots, `${prop}-error`, data);
    };
  }
  if (slots[`${prop}-label`]) {
    slotObj["label"] = (data: Recordable) => {
      return getSlot(slots, `${prop}-label`, data);
    };
  }
  return slotObj;
};
