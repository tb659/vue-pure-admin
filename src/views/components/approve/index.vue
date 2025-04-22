<script setup lang="ts">
/**
 * @description 审批组件
 */
import dayjs from "dayjs";
import { ref } from "vue";

import { workflowApi } from "@/api/system/workflow";

import { isNumber } from "@/utils/is";
import { AUDIT_STATUS_MAP, WORKFLOW_USER_TYPE } from "@/utils/constants";

const props = defineProps({
  /** 查询业务详情的id */
  serviceId: {
    type: Number,
    default: null,
  },
  /** 查询审批详情的id */
  approveId: {
    type: Number,
    default: null,
  },
  /** 查询审批详情的数据 */
  serviceData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["snapshotList", "detail"]);
// 表格加载状态
const loading = ref(false);
// 审批流程列表（具体审批动作）
const tableList = ref<any[]>([]);
// 审批流程列表（设置中的审批流程节点）
const snapshotList = ref<any[]>([]);
const detailInfo = ref<WorkflowDetail>({});
getDetail();

async function getDetail() {
  let res;
  if (props.serviceId && !props.approveId) {
    // 业务列表进入详情
    loading.value = true;
    res = await workflowApi.queryInsDetailByService<WorkflowDetailUserListItem[]>(props.serviceId);
    console.log("审批实例详情查询审批人列表------业务列表进入详情", res.data);
    loading.value = false;
  } else if (props.approveId) {
    // 审批实例列表进入详情
    loading.value = true;
    res = await workflowApi.queryInsDetail<WorkflowDetailUserListItem[]>(props.approveId);
    console.log("审批实例详情查询审批人列表------审批实例列表进入详情", res.data);
    loading.value = false;
  }
  if (res?.data) {
    try {
      // 只展示提交和具体操作人 过滤未提交和审批中（后端过滤了）
      res.data.auditLogList = res.data.auditLogList.reverse();
      res.data.auditLogList.forEach(item => {
        // 处理秒时间戳
        item.auditTime = dayjs(item.auditTime * 1000).format("YYYY-MM-DD HH:mm:ss");
        // 处理审批意见
        item.auditContent = item.auditContent || "无";
        // 审批状态
        item.auditStatusLabel = AUDIT_STATUS_MAP[item.auditStatus].label;
        item.userJsonData = item.userJson ? JSON.parse(item.userJson) : null;
        // 处理审批节点
        switch (item.userType) {
          case WORKFLOW_USER_TYPE.USER_V: // 指定人员
            item.nodeName = `用户`;
            break;
          case WORKFLOW_USER_TYPE.ROLE_V: // 指定角色
            item.nodeName = `角色`;
            if (item.userJsonData) {
              if (!isNumber(item.userJsonData.isSumbitUserDept)) {
                // 角色 具体部门 和 角色
                item.nodeName = item.userJsonData.deptName + item.userJsonData.roleName;
              } else {
                // 角色 关联部门/不关联部门 和 角色
                item.nodeName = item.userJsonData.roleName;
              }
            }
            break;
          case WORKFLOW_USER_TYPE.MULTI_SPPROVERS_V: // 多级负责人
            item.nodeName = `多级负责人`;
            if (item.userJsonData) {
              if (item.userJsonData.deptLevel === "1") {
                // 事业部
                item.nodeName = `部门负责人`;
              } else if (item.userJsonData.deptLevel === "2") {
                // 分公司
                item.nodeName = `分公司负责人`;
              }
            }
            break;
          case WORKFLOW_USER_TYPE.OWNER_V: // 发起人自己
            item.nodeName = `发起人自己`;
            break;
          default:
            item.nodeName = "发起人自己";
            item.auditStatusLabel = "提交";
            break;
        }
        detailInfo.value = res.data;
        tableList.value = res.data.auditLogList;
      });
      console.log("res.data--------", res.data);
    } catch (error) {
      console.log(error);
    }
    const data = [];
    res.data.snapshotList.forEach(item => {
      if (data.length && item.nodeSequence === data[data.length - 1]?.nodeSequence) {
        data[data.length - 1]?.list?.push(item);
      } else {
        data.push({ nodeSequence: item.nodeSequence, list: [item] });
      }
    });
    // 过滤只展示当前节点之前 === 只能驳回到之前的节点
    snapshotList.value = data.filter(item => item.nodeSequence < res.data.nodeSequence);
    emit("snapshotList", snapshotList.value);
    emit("detail", res.data);
  }
}
</script>

<template>
  <div class="w-[100%] border-t-[1px] border-l-[1px] border-[#ddd]">
    <div class="flex">
      <div class="label">当前状态</div>
      <div class="value">
        <el-button link :type="AUDIT_STATUS_MAP[serviceData.auditStatus].type">
          {{ AUDIT_STATUS_MAP[serviceData.auditStatus].label }}
        </el-button>
      </div>
    </div>
    <div class="flex">
      <div class="label">当前处理人</div>
      <div class="value">{{ detailInfo.currentAuditUser || "--" }}</div>
    </div>
    <el-table
      :data="tableList"
      style="width: 100%; border-right: 1px solid #ddd"
      :loading="loading"
      :header-cell-style="{ background: 'var(--el-table-row-hover-bg-color)' }"
    >
      <el-table-column prop="auditTime" align="center" label="时间" />
      <el-table-column prop="nodeName" align="center" label="审批节点" />
      <el-table-column prop="userName" align="center" label="操作人" />
      <el-table-column prop="auditStatusLabel" align="center" label="操作" />
      <el-table-column prop="auditContent" align="center" label="处理意见" />
    </el-table>
  </div>
</template>
<style lang="scss" scoped>
.label {
  @apply flex items-center justify-center border-b-[1px] border-r-[1px] border-[#ddd] w-[150px] min-h-[40px] bg-[#F6F6F6];
}

.value {
  @apply flex items-center border-b-[1px] border-r-[1px] border-[#ddd] w-[calc(100%-150px)] px-[16px];
}
</style>
