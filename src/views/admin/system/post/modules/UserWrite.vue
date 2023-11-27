<script setup lang="ts">
import type { UserData } from "@/api/system/user/types";
import type { PositionData } from "@/api/system/postition/types";
import { required } from "@/utils/validator";
import { useForm } from "@/hooks/web/useForm";
import { ref, reactive, watch, unref } from "vue";
import { DIALOG_WIDTH_TYPE } from "@/utils/common";
import SelectMember from "@/views/components/SelectMember/index.vue";

defineOptions({
  name: "UserWriteForm"
});

const selectMemberRef = ref<ComponentRef<typeof SelectMember>>();

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<PositionData>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  tableList: {
    type: Array as PropType<UserData[]>,
    default: () => []
  },
  post: {
    type: Object,
    default: null
  }
});

const rules = reactive({});
props.formSchema.filter(schema => schema.required).map(schema => (rules[schema.prop] = [required()]));

const { register, methods, elFormRef } = useForm({
  schema: props.formSchema
});

const userOptions = ref([]);
const memberList = ref([]);
const selectMemberVisible = ref(false);
const dialogWidth = ref(DIALOG_WIDTH_TYPE.LARGE);

watch(
  () => props.currentRow,
  () => {
    const { postList, activePost } = props.post;
    const positions = postList.map(post => ({ label: post.name, value: post.id }));
    userOptions.value = props.tableList.map(user => ({ label: user.realName, value: user.id }));
    memberList.value = userOptions.value.map(item => item.value);

    methods.setSchema([
      { prop: "positionId", path: "componentProps.options", value: positions },
      { prop: "userIds", path: "componentProps.options", value: userOptions.value }
    ]);
    methods.setValue({
      positionId: activePost.id,
      userIds: userOptions.value.map(item => item.value)
    });
  },
  { deep: true, immediate: true }
);

function onSelectUser() {
  selectMemberVisible.value = true;
}

function onRemoveMember() {}

async function memberSubmit() {
  const data: UserData[] = await unref(selectMemberRef).getSelections();
  userOptions.value = unref(data).map(user => ({ label: user.realName, value: user.id }));
  memberList.value = memberList.value.concat(userOptions.value.map(item => item.value));
  methods.setValue({
    userIds: memberList.value
  });
  selectMemberVisible.value = false;
}
// 已选的禁选
function selectable(row) {
  const res = !memberList.value.some(v => v === row.id);
  return res;
}

defineExpose({
  elFormRef,
  getFormData: methods.getFormData
});
</script>

<template>
  <div>
    <mt-form :rules="rules" @register="register">
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
    </mt-form>
    <el-dialog
      v-if="selectMemberVisible"
      v-model="selectMemberVisible"
      draggable
      title="选择接收人"
      append-to-body
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
      <select-member ref="selectMemberRef" :selectable="selectable" />

      <template #footer>
        <el-button @click="selectMemberVisible = false">取 消</el-button>
        <el-button type="primary" @click="memberSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
