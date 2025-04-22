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
  ElTreeSelect,
} from "element-plus";
import { ReEditor } from "@/components/ReEditor";
import { MtUpload } from "@/components/ReMtUpload";
import IconSelect from "@/components/ReIcon/src/Select.vue";

const componentMap: Recordable<Component> = {
  Autocomplete: ElAutocomplete,
  Cascader: ElCascader,
  CheckboxGroup: ElCheckboxGroup,
  CheckboxButton: ElCheckboxGroup,
  ColorPicker: ElColorPicker,
  DatePicker: ElDatePicker,
  Divider: ElDivider,
  Input: ElInput,
  InputNumber: ElInputNumber,
  RadioGroup: ElRadioGroup,
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
  MtUpload: MtUpload,
  IconSelect: IconSelect,
};

export { componentMap };
