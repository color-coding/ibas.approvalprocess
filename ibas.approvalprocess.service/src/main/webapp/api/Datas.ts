/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

// 共享的数据
import {
} from "ibas/index";

/** 业务仓库名称 */
export const BO_REPOSITORY_APPROVALPROCESS: string = "BORepositoryApprovalProcess";
/** 业务对象编码-审批请求 */
export const BO_CODE_APPROVALREQUEST: string = "CC_AP_APPROVALREQU";
/** 业务对象编码-审批模板 */
export const BO_CODE_APPROVALTEMPLATE: string = "CC_AP_APPROVALTPLT";

/**
 * 审批步骤所有者类型
 */
export enum emApprovalStepOwnerType {
    USER,
    /*
     DATA_OWNER,
     DIRECT_SUPERIOR,
     DATA_ORGANIZATION_MANAGER,
     PROJECT_MANAGER,
     PROJECT_ORGANIZATION_MANAGER
    */
}
/**
 * 审批条件类型
 */
export enum emApprovalConditionType {
    /** 属性值 */
    PROPERTY_VALUE,
    /** SQL脚本 */
    SQL_SCRIPT,
}