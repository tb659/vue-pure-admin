<script setup lang="ts">
/**
 * 审批流程-设置
 */
import Write from "./modules/Write.vue";
import { useCommonStoreHook } from "@/store/modules/common";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useData } from "./data";
import { useHook } from "./hook";
import { WORKFLOW_USER_TYPE, CONDITION_EQUAL_OPTIONS, STATUS_TYPE, DIALOG_WIDTH_TYPE } from "@/utils/constants";

import Question from "~icons/ep/question-filled";
import Add from "~icons/ep/circle-plus-filled";
import Edit from "~icons/ep/edit";

const writeRef = ref<ComponentRef<typeof Write>>();
const customToClick = ref();
const { formSchema, conditionRoleOptions, conditionDeptOptions } = useData();

const {
  title,
  visible,
  loading,
  handleAddBranch,
  currentRow,
  handleSave,
  expandId,
  workflowDefVosMain,
  handleAddNode,
  handleDelNode,
  handleEditNode,
  handleTagClose,
  handlePageSubmit,
  handleAddCondition,
  handleDelCondition,
  handleConditionTypeChange,
} = useHook();

defineOptions({
  name: "WorkflowSet",
});
const { goLastPage } = useCommonStoreHook();
const route = useRoute();

/** 页面类型标题 */
const pageTypeTitle = ref<any>("工作流—审批设置");

watch(
  () => route.query,
  newVal => {
    pageTypeTitle.value = newVal.title || "工作流—审批设置";
    if (newVal.id) {
      //;
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div class="bg-[#fff] shadow-md rounded p-[16px]">
    <div class="text-[36px] font-bold text-center">{{ pageTypeTitle }}</div>
    <div class="flex items-center mb-[16px]">
      <div ref="customToClick" class="text-[#01ABCE] mr-[16px]">流程设置</div>
      <el-button size="small" type="primary" @click="handleAddBranch">添加分支</el-button>
    </div>
    <div class="main-content">
      <el-scrollbar height="calc(100vh - 340px)" class="overflow-y-auto">
        <div class="demo-collapse">
          <el-collapse v-model="expandId" disabled class="!border-none">
            <el-collapse-item v-for="(item, itemIndex) in workflowDefVosMain" :key="itemIndex" :name="itemIndex">
              <!-- 标题提示 -->
              <template #title>
                <span class="mr-[6px]">{{ item.name }}</span>
                <el-tooltip v-if="item.tip" class="box-item" effect="dark" :content="item.tip" placement="right">
                  <IconifyIconOffline :icon="Question" />
                </el-tooltip>
                <!-- 删除分支 -->
                <el-button v-if="item.branch === 'S'" class="ml-[20px]" link @click.stop="handleDelNode(itemIndex)">
                  删除
                </el-button>
              </template>
              <!-- 内容 -->
              <div class="wrap p-[16px]">
                <!-- 分支条件 -->
                <div v-show="item.branch === 'S'" class="bg-gray-100 py-[16px] mb-[20px]">
                  <p class="mb-[20px] ml-[35px]">请设置用来判断审批流程分支的条件字段：</p>
                  <!-- 填写人（按角色）子分支有，默认分支无 -->
                  <div class="item">
                    <span class="label">填写人（按角色）</span>
                    <div>
                      <el-select v-model="item.role" placeholder="全部" multiple :teleported="false" style="width: 500px">
                        <el-option
                          v-for="item in conditionRoleOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </div>
                  <!-- 且 子分支有，默认分支无 -->
                  <div class="item">
                    <span class="!text-center label">且</span>
                  </div>
                  <!-- 填写人（按部门）子分支有，默认分支无 -->
                  <div class="item">
                    <span class="label">填写人（按部门）</span>
                    <div>
                      <el-tree-select
                        v-model="item.dept"
                        :data="conditionDeptOptions"
                        multiple
                        filterable
                        check-strictly
                        placeholder="全部"
                        style="width: 500px"
                      />
                    </div>
                  </div>
                  <!-- 且 子分支有，默认分支无 -->
                  <div v-if="item.conditionTypeLabel || item.conditionNumberLabel" class="item">
                    <span class="!text-center label">且</span>
                  </div>
                  <!-- 对应审批的条件-数值 子分支有，默认分支无 -->
                  <div class="!block item">
                    <!-- 审批流程对应类型 -->
                    <div v-if="item.conditionTypeLabel" class="flex mb-[20px]">
                      <span class="label">
                        {{ item.conditionTypeLabel }}
                      </span>
                      <el-button
                        v-show="item.conditionTypeLabel && !item.conditionTypeList.length"
                        link
                        class="!text-sky-500"
                        @click="handleAddCondition('type', item)"
                      >
                        添加
                      </el-button>
                      <div class="flex items-center">
                        <el-checkbox-group
                          v-model="item.conditionTypeData"
                          style="width: 500px"
                          @change="val => handleConditionTypeChange(item, val)"
                        >
                          <el-checkbox
                            v-for="(type, conditionIndex) in item.conditionTypeList"
                            :key="conditionIndex"
                            :value="type.value"
                            style="height: 20px; margin-bottom: 16px"
                          >
                            {{ type.label }}
                          </el-checkbox>
                        </el-checkbox-group>
                        <el-button
                          v-show="item.conditionTypeList.length"
                          link
                          class="ml-[12px] text-sky-500!"
                          @click="handleDelCondition('type', item, 0)"
                        >
                          删除
                        </el-button>
                      </div>
                    </div>
                    <!-- 审批流程对应数值 -->
                    <div class="flex">
                      <span class="label">
                        {{ item.conditionNumberLabel }}
                      </span>
                      <el-button
                        v-show="item.conditionNumberLabel && !item.conditionNumberList.length"
                        link
                        class="!text-sky-500"
                        @click="handleAddCondition('number', item)"
                      >
                        添加
                      </el-button>
                      <div v-if="item.conditionNumberList.length">
                        <div
                          v-for="(number, conditionIndex) in item.conditionNumberList"
                          :key="conditionIndex"
                          :class="item.conditionNumberList.length > 1 ? 'mb-[16px] flex items-center' : 'flex items-center'"
                        >
                          <el-select v-model="number.conditionOperation" class="mr-[10px] !w-[240px]">
                            <el-option
                              v-for="option in CONDITION_EQUAL_OPTIONS"
                              :key="option.value"
                              :label="option.label"
                              :value="option.value"
                            />
                          </el-select>
                          <el-input-number
                            v-model="number.conditionParamNumber"
                            :min="item.conditionNumberMin"
                            controls-position="right"
                            style="width: 250px"
                          />
                          <el-button
                            v-show="item.conditionNumberList.length < 2"
                            link
                            class="ml-[12px] text-sky-500!"
                            @click="handleAddCondition('number', item)"
                          >
                            添加
                          </el-button>
                          <el-button
                            v-show="item.conditionNumberList.length <= 2"
                            link
                            class="!text-sky-500"
                            @click="handleDelCondition('number', item, conditionIndex)"
                          >
                            删除
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 审批节点 -->
                <div class="item">
                  <span class="label"><i class="text-red-500">*</i> 审批节点</span>
                  <div>
                    <el-timeline style="max-width: 600px">
                      <el-timeline-item v-for="(node, nodeIndex) in item.workflowDefNodeVos" :key="nodeIndex">
                        <!-- 用户 -->
                        <template v-if="node.userType === WORKFLOW_USER_TYPE.USER_V">
                          <div>
                            <el-tag
                              v-for="(user, userIndex) in node.userList"
                              :key="userIndex"
                              :closable="user.userType === WORKFLOW_USER_TYPE.USER_V"
                              class="mr-[10px]"
                              @close="handleTagClose(item, node, nodeIndex, userIndex)"
                            >
                              {{ user.label }}
                            </el-tag>
                            <el-button size="small" type="primary" @click="handleEditNode(item, node, 0)">
                              <IconifyIconOffline :icon="Edit" />
                              <span class="ml-[6px]">修改</span>
                            </el-button>
                          </div>
                        </template>
                        <!-- 角色 -->
                        <template v-else-if="node.userType === WORKFLOW_USER_TYPE.ROLE_V">
                          <div>
                            <template v-if="node.userList.length === 2">
                              <el-tag closable class="mr-[10px]" @close="handleTagClose(item, node, nodeIndex)">
                                {{ `${node.userList[0].label} / ${node.userList[1].label}` }}
                              </el-tag>
                            </template>
                            <el-button size="small" type="primary" @click="handleEditNode(item, node, 0)">
                              <IconifyIconOffline :icon="Edit" />
                              <span class="ml-[6px]">修改</span>
                            </el-button>
                          </div>
                        </template>
                        <template v-else>
                          <div>
                            <el-tag closable class="mr-[10px]" @close="handleTagClose(item, node, nodeIndex)">
                              <!-- 多级负责人 -->
                              <span v-if="node.userType === WORKFLOW_USER_TYPE.MULTI_SPPROVERS_V">
                                {{ WORKFLOW_USER_TYPE.MULTI_SPPROVERS_L }}
                              </span>
                              <!-- 发起人自己 -->
                              <span v-if="node.userType === WORKFLOW_USER_TYPE.OWNER_V">
                                {{ WORKFLOW_USER_TYPE.OWNER_L }}
                              </span>
                            </el-tag>
                            <el-button size="small" type="primary" @click="handleEditNode(item, node, 0)">
                              <IconifyIconOffline :icon="Edit" />
                              <span class="ml-[6px]">修改</span>
                            </el-button>
                          </div>
                        </template>
                      </el-timeline-item>
                    </el-timeline>
                    <el-button class="!ml-[28px]" size="small" type="primary" @click="handleAddNode(item, 0)">
                      <IconifyIconOffline :icon="Add" />
                      <span class="ml-[6px]">设置审批人</span>
                    </el-button>
                  </div>
                </div>
                <!-- 抄送节点 -->
                <div class="item">
                  <span class="label">抄送人</span>
                  <div>
                    <el-timeline style="max-width: 600px">
                      <el-timeline-item v-for="(node, nodeIndex) in item.workflowDefNodeVosCopy" :key="nodeIndex">
                        <!-- 用户 -->
                        <div>
                          <el-tag
                            v-for="(user, userIndex) in node.userList"
                            :key="userIndex"
                            :closable="user.userType === WORKFLOW_USER_TYPE.USER_V"
                            class="mr-[10px]"
                            @close="handleTagClose(item, node, nodeIndex, userIndex)"
                          >
                            {{ user.label }}
                          </el-tag>
                          <el-button size="small" type="primary" @click="handleEditNode(item, node, 1)">
                            <IconifyIconOffline :icon="Edit" />
                            <span class="ml-[6px]">修改</span>
                          </el-button>
                        </div>
                      </el-timeline-item>
                    </el-timeline>
                    <el-button
                      v-if="!item.workflowDefNodeVosCopy.length"
                      class="!ml-[28px]"
                      size="small"
                      type="primary"
                      @click="handleAddNode(item, 1)"
                    >
                      <IconifyIconOffline :icon="Add" />
                      <span class="ml-[6px]">设置抄送人</span>
                    </el-button>
                  </div>
                </div>
                <!-- 是否触发审批 -->
                <div v-show="item.branch === 'S'" class="item">
                  <span class="label">是否触发审批</span>
                  <el-switch
                    v-model="item.status"
                    class="ml-[28px]"
                    :active-value="STATUS_TYPE.ENABLED_V"
                    :inactive-value="STATUS_TYPE.DISABLED_V"
                  />
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-scrollbar>
      <div class="flex justify-end pt-[10px]" style="border-top: 1px solid #ccc">
        <el-button
          size="large"
          @click="goLastPage({ info: '当前数据可能未保存，仍要关闭窗口？', isConfirm: true, closeTab: true })"
        >
          取消
        </el-button>
        <el-button size="large" type="primary" :loading="loading" @click="handlePageSubmit">提交</el-button>
      </div>
    </div>
    <el-dialog
      v-if="visible"
      v-model="visible"
      :title="title"
      draggable
      :mix-width="DIALOG_WIDTH_TYPE.SMALL"
      :width="DIALOG_WIDTH_TYPE.DEFAULT"
      :close-on-click-modal="false"
    >
      <Write ref="writeRef" :form-schema="formSchema" :current-row="currentRow" />
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="() => handleSave(writeRef)"> 保存 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-collapse-item) {
  margin-bottom: 20px;

  .el-collapse-item__header {
    padding-left: 16px;
    background-color: rgb(246 247 247);
  }

  .wrap {
    .item {
      @apply flex;

      margin-bottom: 20px;

      .label {
        @apply w-[140px] inline-block text-right;

        margin-right: 30px;
      }
    }
  }
}
</style>
