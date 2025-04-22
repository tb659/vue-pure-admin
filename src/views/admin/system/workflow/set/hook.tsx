import type { CheckboxValueType } from "element-plus";
import { ref, unref } from "vue";
// import { workflowApi } from "@/api/system/workflow";
// import { STATUS_TYPE } from "@/utils/constants";
import { useRouter } from "vue-router";
// import { msg } from "@/utils/msg";
import {
  ASSOCIATION_DEPT,
  PROMOTER_DEPT,
  WORKFLOW_STATUS_TYPE,
  WORKFLOW_USER_TYPE,
  WORKFLOW_TYPE,
  CONDITION_EQUAL_TYPE,
  CONDITION_TYPE,
  DICT_PARAMS,
  IS_SUBMIT_USER_DEPT,
} from "@/utils/constants";
import { useData } from "./data";
import { msg } from "@/utils/msg";
import { workflowApi } from "@/api/system/workflow";
import { cloneDeep } from "lodash-es";
import { isArray, isNumber } from "@/utils/is";
import { useCommonStoreHook } from "@/store/modules/common";

export function useHook() {
  const router = useRouter();
  const { memberOptions, originDeptOptions, roleOptions } = useData();

  // 审批流程默认分支提示
  const defaultBranchTip = "无分支条件设置或不满足其他分支条件设置时，进入“默认分支”流程审批";
  // 审批流程id
  const workflowId = router.currentRoute.value.query.id as unknown as number;
  // 审批流程类型
  const workflowType = router.currentRoute.value.query.type as unknown as string;
  // 审批流程对应类型parentCode
  const workflowParentCode = ref();
  let parentCode;
  switch (workflowType) {
    // 单独类型
    case WORKFLOW_TYPE.TYPE_12: // 用印申请
      parentCode = DICT_PARAMS.seal_use_type;
      break;
    case WORKFLOW_TYPE.TYPE_18: // 会议预定
      parentCode = DICT_PARAMS.meeting_type;
      break;
    // 类型 + 数值
    case WORKFLOW_TYPE.TYPE_02: // 合同管理
      parentCode = DICT_PARAMS.contract_type;
      break;
    case WORKFLOW_TYPE.TYPE_11: // 报销申请
      parentCode = DICT_PARAMS.reimburse_type;
      break;
    case WORKFLOW_TYPE.TYPE_13: // 请假申请
    case WORKFLOW_TYPE.TYPE_14: // 销假申请
      parentCode = DICT_PARAMS.ask_for_leave;
      break;

    default:
      break;
  }
  workflowParentCode.value = parentCode;

  // 审批流程类型对应的条件类型label
  const workflowTypeLabel = useCommonStoreHook().dictList.filter(dict => dict.value === workflowType + ".label.type")[0]?.label;
  const conditionTypeLabel = ref(workflowTypeLabel || "类型");
  // 审批流程类型对应的条件数值label
  const workflowNumberLabel = useCommonStoreHook().dictList.filter(dict => dict.value === workflowType + ".label.number")[0]
    ?.label;
  const conditionNumberLabel = ref(workflowNumberLabel || "数值");
  // 审批流程类型对应的条件数值最小值
  const conditionNumberMin = ref(workflowType === WORKFLOW_TYPE.TYPE_13 || workflowType === WORKFLOW_TYPE.TYPE_14 ? 1 : 0);

  const title = ref("审批设置");
  const visible = ref(false);
  const loading = ref<boolean>(false);

  // 当前展开的分支
  const expandId = ref([0]);
  // 当前操作的分支
  const currentRow = ref(null);
  // 是不是添加新的节点
  const isNewNodeTimeLine = ref(false);
  // 节点修改的索引
  const nodeEditIndex = ref(0);

  // 默认分支
  const workflowDefVosMain = ref<WorkflowData[]>([
    {
      _id: 0,
      name: "默认分支",
      tip: defaultBranchTip,
      branch: "M",
      status: WORKFLOW_STATUS_TYPE.ENABLED_V,
      role: [],
      dept: [],
      workflowDefNodeVos: [],
      workflowDefNodeVosCopy: [],
      workflowDefConditionVos: [],
      conditionTypeList: [],
      conditionTypeData: [],
      conditionNumberList: [],
      workflowId,
      type: workflowType,
    },
  ]);
  // 额外分支
  const workflowDefVosBranch = ref<WorkflowData>({
    _id: 1,
    name: "分支",
    tip: "",
    branch: "S",
    status: WORKFLOW_STATUS_TYPE.ENABLED_V,
    role: [],
    dept: [],
    workflowDefNodeVos: [],
    workflowDefNodeVosCopy: [],
    workflowDefConditionVos: [],
    conditionTypeList: [],
    conditionTypeData: [],
    conditionNumberList: [],
    workflowId,
    type: workflowType,
  });

  /** id查询审批流程详情 */
  getWorkflowDetail();

  function handleEdit(data) {
    router.push({ path: `/system/workflow/set`, query: { title: "编辑", id: data.id } });
  }

  /** 添加新分支 */
  function handleAddBranch() {
    const item = Object.assign({}, cloneDeep(workflowDefVosBranch.value));
    // 分支名称
    item.name = `分支${workflowDefVosMain.value.length}`;
    item._id = workflowDefVosMain.value.length;
    // 处理默认条件展示
    handleDefaultCondition(item);
    expandId.value.unshift(item._id);
    workflowDefVosMain.value.unshift(item);
  }

  /** 删除分支 */
  function handleDelNode(index: number) {
    workflowDefVosMain.value.splice(index, 1);
    expandId.value.splice(index, 1);
    // 重置分支名称序号
    workflowDefVosMain.value
      .filter(w => w.branch === "S")
      .forEach((item, index) => (item.name = `分支${workflowDefVosMain.value.length - index - 1}`));
    console.log(workflowDefVosMain.value);
  }

  /** 添加条件 */
  function handleAddCondition(type: "type" | "number", item: WorkflowData) {
    console.log(item);
    // 类型
    if (type === "type") {
      item.conditionTypeList = useCommonStoreHook().dictList.filter(dict => dict.parentCode === workflowParentCode.value);
      // 初始默认勾选第一个
      // item.conditionTypeData = [item.conditionTypeList[0].value];
    } else {
      // 数值
      item.conditionNumberList.push({
        conditionOperation: CONDITION_EQUAL_TYPE.GT_V,
        conditionParamNumber: 0,
        conditionSeq: (item.conditionTypeData.length ? 1 : 0) + item.conditionNumberList.length,
        conditionType: CONDITION_TYPE.TYPE_04, // 对应审批数值过滤
      });
    }
  }

  /** 删除条件 */
  function handleDelCondition(type: "type" | "number", item: WorkflowData, index: number) {
    type === "type" ? ((item.conditionTypeList = []), (item.conditionTypeData = [])) : item.conditionNumberList.splice(index, 1);
  }
  /** 勾选条件类型 */
  function handleConditionTypeChange(item: WorkflowData, value: CheckboxValueType[]) {
    console.log(item, value);
    // if (!value.length) {
    //   msg.warning("至少需要勾选一个" + conditionTypeLabel.value || "类型");
    //   // 全部勾选去除后默认勾选第一个
    //   item.conditionTypeData = [item.conditionTypeList[0].value];
    // }
  }

  /** 添加节点 */
  function handleAddNode(item, copyState: number) {
    title.value = `设置${copyState ? "抄送人" : "审批人"}`;
    item.copyState = copyState;
    delete item.formData;
    currentRow.value = item;
    isNewNodeTimeLine.value = true;
    visible.value = true;
  }

  /** 修改节点 */
  function handleEditNode(item, nodeItem, copyState: number) {
    title.value = `修改${copyState ? "抄送人" : "审批人"}`;
    // 回填
    // 是用户
    if (nodeItem.userType === WORKFLOW_USER_TYPE.USER_V) {
      item.formData = { userType: nodeItem.userList[0]?.userType || nodeItem.userType };
      item.formData.member = nodeItem.userList.map(user => user.value);
    } else if (nodeItem.userType === WORKFLOW_USER_TYPE.ROLE_V) {
      // 是角色
      item.formData = { userType: nodeItem.userList[0]?.userType || nodeItem.userType };
      item.formData.role = { dept: nodeItem.userList[0]?.value, role: nodeItem.userList[1]?.value };
    } else {
      item.formData = { userType: nodeItem.userType };
    }
    item.copyState = copyState;
    currentRow.value = item;
    isNewNodeTimeLine.value = false;
    const nodeIndex = item.workflowDefNodeVos.findIndex(n => n.userJson === nodeItem.userJson);
    // 获取索引用以保存
    nodeEditIndex.value = nodeIndex;
    visible.value = true;
  }

  /** 删除某一个节点 */
  function handleTagClose(item, node, nodeIndex, userIndex = -1) {
    console.log(item, node, nodeIndex, userIndex);
    switch (node.userType) {
      // 用户
      case WORKFLOW_USER_TYPE.USER_V:
        node.userList.splice(userIndex, 1);
        node.userJson = getUserJson(node.userList, node.userType);
        // 删完了用户删除节点 区分是否抄送
        if (!node.userList.length) {
          node.copyState ? item.workflowDefNodeVosCopy.splice(nodeIndex, 1) : item.workflowDefNodeVos.splice(nodeIndex, 1);
        }
        break;
      default:
        // 删除当前节点
        item.workflowDefNodeVos.splice(nodeIndex, 1);
    }
  }

  /** 审批人保存-选人后确认 */
  async function handleSave(writeRef) {
    const write = unref(writeRef);
    const formData = await write?.submit();
    if (formData) {
      console.log("formData--------", formData);
      const { userType, copyState } = formData;
      let userList,
        roleItem,
        deptItem,
        nodeItem = {};
      // 抄送人状态：0、否，1、是
      if (!copyState) {
        // 审批节点
        switch (userType) {
          // 用户
          case WORKFLOW_USER_TYPE.USER_V:
            // 重置用户
            userList = [];
            // 过滤后按下拉选择顺序添加
            formData.member.filter(v =>
              memberOptions.value.filter(item => {
                item.value === v && userList.push({ label: item.label, value: item.value, userType });
              }),
            );
            break;
          // 角色
          case WORKFLOW_USER_TYPE.ROLE_V:
            // 过滤后按下拉选择顺序添加
            roleItem = roleOptions.value.filter(role => role.value === formData.role.role)[0];
            deptItem = originDeptOptions.value.filter(role => role.value === formData.role.dept)[0];
            userList = [
              { ...deptItem, userType },
              { ...roleItem, userType },
            ];
            break;

          default:
            break;
        }
        // 定义节点
        nodeItem = {
          copyState,
          userType,
          // 前端需要的用户数据，后端不需要
          userList,
          // 后端需要的用户数据，前端需要转化
          userJson: getUserJson(userList, userType),
        };
        if (isNewNodeTimeLine.value) {
          // 添加新节点
          currentRow.value.workflowDefNodeVos.push(nodeItem);
        } else {
          // 修改节点
          currentRow.value.workflowDefNodeVos[nodeEditIndex.value] = nodeItem;
        }
      } else {
        // 抄送节点
        // 重置用户
        userList = [];
        // 过滤后按下拉选择顺序添加
        formData.member.filter(v =>
          memberOptions.value.filter(item => {
            item.value === v && userList.push({ label: item.label, value: item.value, userType });
          }),
        );
        currentRow.value.workflowDefNodeVosCopy = [
          {
            copyState,
            userType,
            // 前端需要的用户数据，后端不需要
            userList,
            // 后端需要的用户数据，前端需要转化
            userJson: getUserJson(userList, userType),
          },
        ];
      }
      console.log("新增编辑提交", formData);
      console.log("主分支", workflowDefVosMain.value);
      console.log("当前操作分支", currentRow.value);
      visible.value = false;
    }
  }

  /** 1、指定人员: [{\"userId\":1,\"userName\":\"zs\"},{{\"userId\":2,\"userName\":\"ls\"}}]
   *  2、指定角色: {\"roleId\":1, \"roleName\":\"管理员\", \"deptId\":1, \"deptName\": \"测试部\"}
   *  3、多级负责人: 空
   *  4、发起人自己: 空" */
  function getUserJson(userList, userType) {
    if (userType === WORKFLOW_USER_TYPE.USER_V) {
      // 是用户
      return JSON.stringify(userList.map(user => ({ userId: user.value, userName: user.label })));
    } else if (userType === WORKFLOW_USER_TYPE.ROLE_V) {
      // 是角色
      const data = {
        roleId: userList[userList.length - 1]?.value,
        roleName: userList[userList.length - 1]?.label,
        deptId: userList[userList.length - 2]?.value,
        deptName: userList[userList.length - 2]?.label,
        isSumbitUserDept: IS_SUBMIT_USER_DEPT.value_null,
      };
      if (data.deptId === ASSOCIATION_DEPT.value) {
        // 不关联部门
        delete data.deptId;
        delete data.deptName;
        data.isSumbitUserDept = IS_SUBMIT_USER_DEPT.value_0;
      } else if (data.deptId === PROMOTER_DEPT.value) {
        // 发起人所在部门
        // data.deptId = getUser("deptId");
        // data.deptName = getUser("deptName");
        data.isSumbitUserDept = IS_SUBMIT_USER_DEPT.value_1;
      } else {
        // 具体部门
        delete data.isSumbitUserDept;
      }
      return JSON.stringify(data);
    } else {
      return null;
    }
  }

  /** 设置页面保存，请求接口 */
  async function handlePageSubmit() {
    const data = {
      workflowDefVos: cloneDeep(workflowDefVosMain.value).reverse(),
      workflowId,
    };
    // 处理数据
    let flag = false;
    data.workflowDefVos.forEach(item => {
      // 1、判断是否有审批节点无数据
      if (!item.workflowDefNodeVos.length) {
        flag = true;
      }
      // 2、抄送人合并到审批
      if (item.workflowDefNodeVosCopy.length) {
        item.workflowDefNodeVos.push(item.workflowDefNodeVosCopy[0]);
      }
      item.workflowDefConditionVos = [];
      // 3、处理条件--角色
      if (item.role.length) {
        const roleData = {
          conditionParam: JSON.stringify(item.role.map(r => r + "")),
          conditionSeq: 1,
          conditionType: CONDITION_TYPE.TYPE_01, // 角色条件过滤
        };
        item.workflowDefConditionVos.push(roleData);
      }
      // 4、处理条件--部门
      if (item.dept.length) {
        const deptData = {
          conditionParam: JSON.stringify(item.dept.map(r => r + "")),
          conditionSeq: 2,
          conditionType: CONDITION_TYPE.TYPE_02, // 部门条件过滤
        };
        item.workflowDefConditionVos.push(deptData);
      }
      // 5、处理条件--类型
      if (item.conditionTypeData.length) {
        const typeData = {
          conditionParam: JSON.stringify(item.conditionTypeData),
          conditionSeq: 3,
          conditionType: CONDITION_TYPE.TYPE_03, // 对应审批类型过滤
        };
        item.workflowDefConditionVos.push(typeData);
      }
      // 6、处理条件--数值
      if (item.conditionNumberList.length) {
        item.conditionNumberList.map((condition, conditionIndex) => {
          const numberData = {
            conditionOperation: condition.conditionOperation,
            conditionParam: JSON.stringify(condition.conditionParamNumber),
            conditionSeq: 4 + conditionIndex,
            conditionType: CONDITION_TYPE.TYPE_04, // 对应审批数值过滤
          };
          item.workflowDefConditionVos.push(numberData);
        });
      }
    });
    if (flag) {
      return msg.warning("请添加审批节点");
    }
    console.log("请求接口data数据-----------------", data);
    // return;
    msg.confirm(`将按当前设置执行审批流程，确定保存？`, "提示", {
      confirmBack: async () => {
        loading.value = true;
        const res = await workflowApi
          .createDef(data)
          .catch(() => {})
          .finally(() => {
            loading.value = false;
          });
        if (res) {
          visible.value = false;
          msg.success();
          router.replace({ name: "Workflow" });
        }
      },
    });
  }

  /** id查询审批流程详情 */
  async function getWorkflowDetail() {
    const res = await workflowApi.queryDef<WorkflowDefVosData>(workflowId);
    if (res?.data?.workflowDefVos?.length) {
      // 有设置过流程
      const { workflowDefVos } = res.data;
      const resData = workflowDefVos.reverse();
      resData.forEach((item, index) => {
        item._id = index;
        // 默认展开
        expandId.value.push(index);
        // 初始数据
        item.role = [];
        item.dept = [];
        item.conditionTypeList = [];
        item.conditionTypeData = [];
        item.conditionNumberList = [];
        // 默认分支提示
        item.tip = item.branch === "M" ? defaultBranchTip : "";
        // 处理node节点数据回填格式
        item.workflowDefNodeVos.forEach(node => {
          // 存在userJson 是用户和角色
          if (node.userJson) {
            const userData = JSON.parse(node.userJson);
            // 初始化
            node.userList = [];
            // 用户是数组 角色是对象
            if (isArray(userData)) {
              // 用户
              node.userList = userData;
            } else {
              let userItem;
              if (!isNumber(userData.isSumbitUserDept)) {
                // 角色 具体部门 和 角色
                userItem = { label: userData.deptName, value: userData.deptId };
              } else {
                // 角色 关联部门/不关联部门 和 角色
                userItem = userData.isSumbitUserDept ? PROMOTER_DEPT : ASSOCIATION_DEPT;
              }
              node.userList = [
                { ...userItem, userType: node.userType },
                { label: userData.roleName, value: userData.roleId, userType: node.userType },
              ];
            }
            // 处理user用户数据 label value 回填格式
            node.userList.forEach(user => {
              user.userType = node.userType;
              // label/value 数据回填格式
              Object.keys(user).forEach(key => {
                key.includes("Id") && (user.value = user[key]);
                key.includes("Name") && (user.label = user[key]);
              });
            });
          }
        });
        // 先默认
        handleDefaultCondition(item);
        // 处理条件数据回填格式
        item.workflowDefConditionVos.forEach(condition => {
          condition.conditionParam = JSON.parse(condition.conditionParam);
          switch (condition.conditionType) {
            case CONDITION_TYPE.TYPE_01: // 1、角色条件
              if (isArray(condition.conditionParam)) {
                item.role = (condition.conditionParam as unknown as string[]).map(id => (id as unknown as number) * 1);
              }
              break;
            case CONDITION_TYPE.TYPE_02: // 2、部门条件
              if (isArray(condition.conditionParam)) {
                item.dept = (condition.conditionParam as unknown as string[]).map(id => (id as unknown as number) * 1);
              }
              break;
            case CONDITION_TYPE.TYPE_03: // 3、类型条件
              if (isArray(condition.conditionParam)) {
                item.conditionTypeData = condition.conditionParam as unknown as string[];
              }
              item.conditionTypeLabel = conditionTypeLabel.value;
              item.conditionTypeList = useCommonStoreHook().dictList.filter(dict => dict.parentCode === workflowParentCode.value);
              break;
            case CONDITION_TYPE.TYPE_04: // 4、数值条件
              item.conditionNumberLabel = conditionNumberLabel.value;
              condition.conditionParamNumber = (condition.conditionParam as unknown as number) * 1;
              item.conditionNumberList.push(condition);
              break;
            default:
              break;
          }
        });
        // 处理抄送和非抄送
        const workflowDefNodeVos = item.workflowDefNodeVos.filter(f => !f.copyState);
        const workflowDefNodeVosCopy = item.workflowDefNodeVos.filter(f => f.copyState);
        item.workflowDefNodeVos = workflowDefNodeVos;
        item.workflowDefNodeVosCopy = workflowDefNodeVosCopy;
        // console.log("回填数据workflowDefVos----item---", item);
      });
      console.log("回填数据workflowDefVos", resData);
      workflowDefVosMain.value = resData;
    }
  }

  function handleDefaultCondition(item: WorkflowData) {
    // console.log(item);
    item.conditionNumberMin = conditionNumberMin.value;
    switch (workflowType) {
      // 单独类型
      case WORKFLOW_TYPE.TYPE_12: // 用印申请
      case WORKFLOW_TYPE.TYPE_18: // 会议预定
        // item.conditionTypeList = [
        //   {
        //     conditionParam: [],
        //     conditionSeq: 3,
        //     conditionType: CONDITION_TYPE.TYPE_03 // 对应审批类型过滤
        //   }
        // ];
        item.conditionTypeLabel = conditionTypeLabel.value;
        break;
      // 单独数值
      case WORKFLOW_TYPE.TYPE_04: // 中标信息
      case WORKFLOW_TYPE.TYPE_06: // 开票申请
      case WORKFLOW_TYPE.TYPE_08: // 红票申请
      case WORKFLOW_TYPE.TYPE_15: // 车辆预算
      case WORKFLOW_TYPE.TYPE_16: // 车辆维修
      case WORKFLOW_TYPE.TYPE_23: // 收据申请
        // item.conditionNumberList = [
        //   {
        //     conditionOperation: CONDITION_EQUAL_TYPE.GT_V,
        //     conditionParamNumber: 0,
        //     conditionSeq: 3,
        //     conditionType: CONDITION_TYPE.TYPE_04 // 对应审批数值过滤
        //   }
        // ];
        item.conditionNumberLabel = conditionNumberLabel.value;
        break;
      // 类型 + 数值
      case WORKFLOW_TYPE.TYPE_02: // 合同管理
      case WORKFLOW_TYPE.TYPE_11: // 报销申请
      case WORKFLOW_TYPE.TYPE_13: // 请假申请
      case WORKFLOW_TYPE.TYPE_14: // 销假申请
        // item.conditionTypeList = [
        //   {
        //     conditionParam: [],
        //     conditionSeq: 3,
        //     conditionType: CONDITION_TYPE.TYPE_03 // 对应审批类型过滤
        //   }
        // ];
        // item.conditionNumberList = [
        //   {
        //     conditionOperation: CONDITION_EQUAL_TYPE.GT_V,
        //     conditionParamNumber: 0,
        //     conditionSeq: 4,
        //     conditionType: CONDITION_TYPE.TYPE_04 // 对应审批数值过滤
        //   }
        // ];
        item.conditionTypeLabel = conditionTypeLabel.value;
        item.conditionNumberLabel = conditionNumberLabel.value;
        break;

      default:
        // 不存在条件
        // case WORKFLOW_TYPE.TYPE_01: // 项目登记
        // case WORKFLOW_TYPE.TYPE_03: // 开标计划
        // case WORKFLOW_TYPE.TYPE_05: // 投标报备
        // case WORKFLOW_TYPE.TYPE_07: // 发票确认
        // case WORKFLOW_TYPE.TYPE_09: // 保证金缴纳
        // case WORKFLOW_TYPE.TYPE_10: // 保证金退款
        // case WORKFLOW_TYPE.TYPE_17: // 录像下载
        // case WORKFLOW_TYPE.TYPE_19: // 文件编制
        // case WORKFLOW_TYPE.TYPE_20: // 复评处理
        // case WORKFLOW_TYPE.TYPE_21: // 招标终止处理
        // case WORKFLOW_TYPE.TYPE_22: // 专家录入
        break;
    }
  }

  return {
    title,
    visible,
    loading,

    handleAddBranch,
    handleEdit,
    handleSave,
    currentRow,

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
  };
}
