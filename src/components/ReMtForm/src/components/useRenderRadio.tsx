import type { defineComponent } from "vue";
import { ElRadio, ElRadioButton } from "element-plus";
import { ComponentNameEnum } from "../helper";

export const useRenderRadio = () => {
  const renderRadioOptions = (item: FormSchema) => {
    // 如果有别名，就取别名
    const componentProps = item?.componentProps as RadioGroupComponentProps;
    const valueAlias = componentProps?.props?.value || "value";
    const labelAlias = componentProps?.props?.label || "label";
    const disabledAlias = componentProps?.props?.disabled || "disabled";
    const Com = (item.component === ComponentNameEnum.RADIO_GROUP ? ElRadio : ElRadioButton) as ReturnType<
      typeof defineComponent
    >;
    return componentProps?.options?.map(option => (
      <Com {...option} disabled={option[disabledAlias]} label={option[labelAlias]} value={option[valueAlias]} />
    ));
  };

  return {
    renderRadioOptions,
  };
};
