import type { defineComponent } from "vue";
import { ComponentNameEnum } from "../helper";
import { ElCheckbox, ElCheckboxButton } from "element-plus";

export const useRenderCheckbox = () => {
  const renderCheckboxOptions = (item: FormSchema) => {
    // 如果有别名，就取别名
    const componentProps = item?.componentProps as CheckboxGroupComponentProps;
    const valueAlias = componentProps?.props?.value || "value";
    const labelAlias = componentProps?.props?.label || "label";
    const disabledAlias = componentProps?.props?.disabled || "disabled";
    const Com = (item.component === ComponentNameEnum.CHECKBOX_GROUP ? ElCheckbox : ElCheckboxButton) as ReturnType<
      typeof defineComponent
    >;
    return componentProps?.options?.map(option => (
      <Com {...option} disabled={option[disabledAlias]} label={option[labelAlias]} value={option[valueAlias]} />
    ));
  };

  return {
    renderCheckboxOptions,
  };
};
