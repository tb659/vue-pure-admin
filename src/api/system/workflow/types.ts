interface User {
  userType?: number;
  userId?: number;
  userName?: string;
  roleId?: number;
  roleName?: string;
  deptId?: number;
  deptName?: string;
  label?: string;
  value?: number;
  isSumbitUserDept?: number;
}
interface WorkflowDefNodeVosData {
  copyState?: number;
  dataVersion?: number;
  id?: number;
  nodeSeq?: number;
  userJson?: string;
  userList?: User[];
  userType?: number;
  versionNo?: string;
  workflowDefId?: number;
}
interface WorkflowDefConditionVosData {
  conditionOperation?: string;
  conditionParam?: string;
  conditionSeq?: number;
  conditionType?: string;
  dataVersion?: number;
  id?: number;
  versionNo?: string;
  workflowDefId?: number;
  conditionParamNumber?: number;
}
declare global {
  interface WorkflowData {
    branch?: string;
    branchSeq?: number;
    dataVersion?: number;
    id?: number;
    _id?: number;
    name?: string;
    status?: number;
    role?: number[];
    dept?: number[];
    tip?: string;
    type?: string;
    versionNo?: string;
    workflowDefNodeVos?: WorkflowDefNodeVosData[];
    workflowDefNodeVosCopy?: WorkflowDefNodeVosData[];
    workflowDefConditionVos?: WorkflowDefConditionVosData[];
    conditionNumberList?: WorkflowDefConditionVosData[];
    conditionTypeList?: DictData[];
    conditionTypeData?: string[];
    workflowId?: number;
    conditionTypeLabel?: string;
    conditionNumberLabel?: string;
    conditionNumberMin?: number;
  }

  interface WorkflowDefVosData {
    workflowDefVos: WorkflowData[];
  }

  /** 审批流程定义节点审批人 */
  interface WorkflowDetailUserListItem {
    auditContent?: string;
    auditStatus?: number;
    auditTime?: number;
    copyState?: number;
    dataVersion?: number;
    id?: number;
    nodeSequence?: number;
    serviceId?: number;
    snapshotStatus?: number;
    subSequence?: number;
    userId?: number;
    userName?: string;
    userType?: number;
    versionNo?: string;
    workflowInsId?: number;
  }
  interface WorkflowDetail {
    auditLogList?: WorkflowDetailUserListItem[];
    auditStatus?: number;
    branch?: string;
    crtDt?: number;
    crtUser?: number;
    currentAuditUser?: string;
    dataVersion?: number;
    deptId?: number;
    deptName?: string;
    id?: number;
    modDt?: number;
    modUser?: number;
    name?: string;
    nodeSequence?: number;
    realName?: string;
    serviceId?: number;
    snapshotList?: WorkflowDetailUserListItem[];
    summary?: string;
    type?: string;
    typeName?: string;
    versionNo?: string;
    workflowDefId?: number;
  }
}
export {};
