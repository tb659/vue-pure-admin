<script setup lang="ts">
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { ref, reactive, watch, unref } from "vue";
import { DIALOG_WIDTH_TYPE } from "@/utils/constants";
import SelectMember from "@/views/components/SelectMember/index.vue";

defineOptions({
  name: "UserWriteForm",
});

const selectMemberRef = ref<ComponentRef<typeof SelectMember>>();

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<PositionData>>,
    default: () => null,
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => [],
  },
  tableList: {
    type: Array as PropType<UserData[]>,
    default: () => [],
  },
  post: {
    type: Object,
    default: null,
  },
});

const rules = reactive({});
props.formSchema
  .filter(schema => schema.required)
  .map(schema => (rules[schema.field] = [required(schema.componentProps?.placeholder)]));

const { formRegister, formMethods } = useForm();
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods;

const userOptions = ref([]);
const memberList = ref([]);
const selectMemberVisible = ref(false);

watch(
  () => props.currentRow,
  () => {
    const { postList, activePost } = props.post;
    const positions = postList.map(post => ({ label: post.name, value: post.id }));
    userOptions.value = props.tableList.map(user => ({ label: user.realName, value: user.id }));
    memberList.value = userOptions.value.map(item => item.value);

    setSchema([
      { field: "positionId", path: "componentProps.options", value: positions },
      { field: "userIds", path: "componentProps.options", value: userOptions.value },
    ]);
    setValues({
      positionId: activePost.id,
      userIds: userOptions.value.map(item => item.value),
    });
  },
  { deep: true, immediate: true },
);

function onSelectUser() {
  selectMemberVisible.value = true;
}

function onRemoveMember() {}

async function memberSubmit() {
  const data: UserData[] = await unref(selectMemberRef).getSelections();
  userOptions.value = unref(data).map(user => ({ label: user.realName, value: user.id }));
  memberList.value = memberList.value.concat(userOptions.value.map(item => item.value));
  setValues({
    userIds: memberList.value,
  });
  selectMemberVisible.value = false;
}
// 已选的禁选
function selectable(row) {
  const res = !memberList.value.some(v => v === row.id);
  return res;
}

const submit = async () => {
  const elForm = await getElFormExpose();
  const valid = await elForm?.validate().catch(err => {
    console.log(err);
  });
  if (valid) {
    const formData = await getFormData();
    return formData;
  }
};

defineExpose({
  submit,
});
</script>

<template>
  <div>
    <MtForm :rules="rules" :schema="formSchema" @register="formRegister">
      <template #userIds>
        <div class="w-full fix-focus" @click.capture="onSelectUser">
          <el-select
            v-model="memberList"
            multiple
            placeholder="请选择"
            :teleported="false"
            style="width: 100%"
            @remove-tag="onRemoveMember"
          >
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </template>
    </MtForm>
    <el-dialog
      v-if="selectMemberVisible"
      v-model="selectMemberVisible"
      draggable
      title="选择接收人"
      append-to-body
      :width="DIALOG_WIDTH_TYPE.LARGE"
      :close-on-click-modal="false"
    >
      <SelectMember ref="selectMemberRef" :selectable="selectable" />

      <template #footer>
        <el-button @click="selectMemberVisible = false">取 消</el-button>
        <el-button type="primary" @click="memberSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
