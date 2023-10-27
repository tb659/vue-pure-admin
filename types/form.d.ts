import type { FormItemRule, FormRules } from "element-plus";
import type { CSSProperties } from "vue";
import type { AxiosPromise } from "axios";

type Size = "large" | "default" | "small";
type ValidateStatus = "" | "error" | "validating" | "success";
type FormValueType = string | number | string[] | number[] | boolean | undefined | null;

type ComponentOptionsAlias = {
  labelField?: string;
  valueField?: string;
};

type ComponentProps = {
  optionsAlias?: ComponentOptionsAlias;
  options?: ComponentOptions[];
  optionsSlot?: boolean;
} & Recordable;

declare global {
  /** 表单组件 */
  type ComponentName =
    | "Autocomplete"
    | "Cascader"
    | "Checkbox"
    | "CheckboxButton"
    | "ColorPicker"
    | "DatePicker"
    | "Divider"
    | "Input"
    | "InputNumber"
    | "Radio"
    | "RadioButton"
    | "Rate"
    | "Select"
    | "SelectV2"
    | "Slider"
    | "Switch"
    | "TimePicker"
    | "TimeSelect"
    | "Transfer"
    | "Tree"
    | "TreeSelect"
    | "Editor"
    | "IconSelect";

  type ColProps = {
    span?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    tag?: string;
  };

  interface PlaceholderMoel {
    placeholder?: string;
    startPlaceholder?: string;
    endPlaceholder?: string;
    rangeSeparator?: string;
  }

  type ComponentOptions = {
    label?: string;
    value?: FormValueType;
    disabled?: boolean;
    key?: string | number;
    children?: ComponentOptions[];
    options?: ComponentOptions[];
    type?: string;
  } & Recordable;

  /**
   * @description `element-plus` 的 `form` 属性，未扩展
   * @see {@link https://element-plus.org/zh-CN/component/form.html#form-attributes}
   */
  type FormProps = {
    /** 表单数据对象 */
    model?: Record<string, any>;
    /** 表单验证规则 */
    rules?: FormRules;
    /** 行内表单模式 */
    inline?: boolean;
    /** 表单域标签的位置， 当设置为 left 或 right 时，则也需要设置 label-width 属性 */
    labelPosition?: LabelPosition;
    /** 标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto。 */
    labelWidth?: string | number;
    /** 表单域标签的后缀 */
    labelSuffix?: string;
    /** 是否隐藏必填字段标签旁边的红色星号。 */
    hideRequiredAsterisk?: boolean;
    /** 星号的位置。 */
    requireAsteriskPosition?: AsteriskPosition;
    /** 是否显示校验错误信息 */
    showMessage?: boolean;
    /** 是否以行内形式展示校验信息 */
    inlineMessage?: boolean;
    /** 是否在输入框中显示校验结果反馈图标 */
    statusIcon?: boolean;
    /** 是否在 rules 属性改变后立即触发一次验证 */
    validateOnRuleChange?: boolean;
    /** 用于控制该表单内组件的尺寸 */
    size?: Size;
    /** 是否禁用该表单内的所有组件。 如果设置为 true, 它将覆盖内部组件的 disabled 属性 */
    disabled?: boolean;
    /** 当校验失败时，滚动到第一个错误表单项 */
    scrollToError?: boolean;
  };

  /**
   * @description `element-plus` 的 `form` 属性，已扩展，额外增加
   * @see {@link https://element-plus.org/zh-CN/component/form.html#form-attributes}
   */
  interface PureFormProps extends FormProps {
    /** 表单form宽度 */
    formWidth?: string;
    /** 生成Form的布局结构数组 */
    schema?: FormSchema[];
    /** 是否需要栅格布局 */
    isCol?: boolean;
    /** 是否自动设置placeholder */
    autoSetPlaceHolder?: boolean;
    /** 是否自定义内容 */
    isCustom?: boolean;
    // search表单
    /** 操作按钮风格位置 */
    layout?: "inline" | "bottom";
    /** 底部按钮的对齐方式 */
    buttomPosition?: "left" | "center" | "right";
    /** 是否显示伸缩 */
    expand?: boolean;
    /** 伸缩的界限字段 */
    expandProp?: string;
    /** 是否显示查询按钮 */
    showSearch?: boolean;
    /** 是否显示重置按钮 */
    showReset?: boolean;
  }

  type FormItemProps = {
    /** model 的键名。 它可以是一个路径数组(例如 ['a', 'b', 0])。 在定义了 validate、resetFields 的方法时，该属性是必填的 */
    prop?: string | string[];
    /** 标签文本 */
    label?: string;
    /** 标签宽度，例如 '50px'。 可以使用 auto。 */
    labelWidth?: string | number;
    /** 是否为必填项，如不设置，则会根据校验规则确认 false */
    required?: boolean;
    /** 表单验证规则 */
    rules?: FormItemRule | FormItemRule[];
    /** 表单域验证错误时的提示信息。设置该值会导致表单验证状态变为 error，并显示该错误信息。 */
    error?: string;
    /** 是否显示校验错误信息。true */
    showMessage?: boolean;
    /** 是否在行内显示校验信息。false */
    inlineMessage?: boolean;
    /** 用于控制该表单域下组件的默认尺寸 default */
    size?: Size;
    /** 和原生标签相同能力 */
    for?: Size;
    /** formitem 校验的状态 */
    validateStatus?: ValidateStatus;
  };

  /** 表单formItem */
  type FormSchema = {
    /** 唯一值 */
    prop: string;
    /** 标题 */
    label?: string;
    /** 提示 */
    labelMsg?: string;
    /** 初始值 */
    value?: FormValueType;
    /** col组件属性 */
    colProps?: ColProps;
    /** formItem组件属性 */
    formItemProps?: FormItemProps;
    /** 渲染的组件 */
    component?: ComponentName;
    /** 表单组件属性，slots对应的是表单组件的插槽，规则：${field}-xxx，具体可以查看element-plus文档 */
    componentProps?: { slots?: Recordable } & ComponentProps;
    /** 是否隐藏 必须是个函数 */
    hidden?: CallableFunction;
    /** 远程加载下拉项 */
    api?: <T = any>() => AxiosPromise<T>;
  };

  /**
   *   data = {id: 1, meta}
   */
  type FormSetPropsType = {
    /** 字段 */
    prop: string;
    /** 路径 */
    path: string;
    /** 值 */
    value: any;
  };
}
