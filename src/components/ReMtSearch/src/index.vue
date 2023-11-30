<script setup lang="ts">
import _props from "./props";
import { findIndex } from "@/utils";
import { cloneDeep } from "@pureadmin/utils";
import { useForm } from "@/hooks/web/useForm";
import { transformI18n, $t } from "@/plugins/i18n";
import { toRefs, computed, ref, unref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Search from "@iconify-icons/fa/search";
import Refresh from "@iconify-icons/fa/refresh";
import Up from "@iconify-icons/fa/chevron-up";
import Down from "@iconify-icons/fa/chevron-down";

defineOptions({
  name: "MtSearch"
});

const visible = ref(true);

const props = defineProps(_props);

const emit = defineEmits(["search", "reset"]);

const { register, elFormRef, methods } = useForm();

const { isCol, labelWidth, formWidth, inline } = toRefs(props) as unknown as PureFormProps;

/** 布局按钮在底部时的位置 */
const bottonButtonStyle = computed(() => {
  return {
    textAlign: props.buttomPosition as unknown as "left" | "center" | "right"
  };
});

/** 处理按钮 */
const newSchema = computed(() => {
  let schema: FormSchema[] = cloneDeep(props.schema);
  /** 展开/收起 */
  if (props.expand && props.expandProp && !unref(visible)) {
    const index = findIndex(schema, (v: FormSchema) => v.prop === props.expandProp);
    if (index > -1) {
      const length = schema.length;
      schema.splice(index + 1, length);
    }
  }
  /** 搜索按钮 */
  if (props.layout === "inline") {
    schema = schema.concat([{ prop: "action", formItemProps: { labelWidth: "0px" } }]);
  }
  return schema;
});

/** 展开收起点击事件 */
function setVisible() {
  unref(elFormRef)?.resetFields();
  visible.value = !unref(visible);
}

/** 搜索按钮事件 */
async function search() {
  await unref(elFormRef)?.validate(async isValid => {
    if (isValid) {
      const model = await methods.getFormData();
      emit("search", model);
    }
  });
}

/** 重置按钮事件 */
async function reset() {
  unref(elFormRef)?.resetFields();
  const model = await methods.getFormData();
  emit("reset", model);
}
</script>

<template>
  <mt-form
    :is-col="isCol"
    :in-line="inline"
    :is-custom="false"
    :schema="newSchema"
    :label-width="labelWidth"
    :form-width="formWidth"
    hide-required-asterisk
    class="pt-4 pl-8"
    @register="register"
  >
    <template #action>
      <div v-if="layout === 'inline'">
        <el-button v-if="showSearch" :icon="useRenderIcon(Search)" type="primary" @click="search">
          {{ transformI18n($t("form.query")) }}
        </el-button>
        <el-button v-if="showReset" :icon="useRenderIcon(Refresh)" @click="reset">
          {{ transformI18n($t("form.reset")) }}
        </el-button>
        <el-button v-if="expand" text @click="setVisible">
          {{ transformI18n($t(visible ? "form.shrink" : "form.expand")) }}
          <IconifyIconOffline :icon="visible ? Up : Down" />
        </el-button>
      </div>
    </template>
  </mt-form>

  <template v-if="layout === 'bottom'">
    <div :style="bottonButtonStyle">
      <el-button v-if="showSearch" :icon="useRenderIcon(Search)" type="primary" @click="search">
        {{ transformI18n($t("form.query")) }}
      </el-button>
      <el-button v-if="showReset" :icon="useRenderIcon(Refresh)" @click="reset">
        {{ transformI18n($t("form.reset")) }}
      </el-button>
      <el-button v-if="expand" text @click="setVisible">
        {{ transformI18n($t(visible ? "form.shrink" : "form.expand")) }}
        <IconifyIconOffline :icon="visible ? Up : Down" />
      </el-button>
    </div>
  </template>
</template>
