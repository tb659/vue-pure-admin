import type { Component } from "vue";
import {
  ElAutocomplete,
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElDivider,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElTree,
  ElTreeSelect
} from "element-plus";
import { ReEditor } from "@/components/ReEditor";
import IconSelect from "@/components/ReIcon/src/Select.vue";

const componentMap: Recordable<Component, ComponentName> = {
  Autocomplete: ElAutocomplete,
  Cascader: ElCascader,
  Checkbox: ElCheckboxGroup,
  CheckboxButton: ElCheckboxGroup,
  ColorPicker: ElColorPicker,
  DatePicker: ElDatePicker,
  Divider: ElDivider,
  Input: ElInput,
  InputNumber: ElInputNumber,
  Radio: ElRadioGroup,
  RadioButton: ElRadioGroup,
  Rate: ElRate,
  Select: ElSelect,
  SelectV2: ElSelectV2,
  Slider: ElSlider,
  Switch: ElSwitch,
  TimePicker: ElTimePicker,
  TimeSelect: ElTimeSelect,
  Transfer: ElTransfer,
  Tree: ElTree,
  TreeSelect: ElTreeSelect,
  Editor: ReEditor,
  IconSelect: IconSelect
};

export { componentMap };
