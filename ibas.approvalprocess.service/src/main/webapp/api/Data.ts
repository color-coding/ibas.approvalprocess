/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    /** 模块-标识 */
    export const CONSOLE_ID: string = "b3382a56-bdda-412c-bc2f-af17cd19142e";
    /** 模块-名称 */
    export const CONSOLE_NAME: string = "ApprovalProcess";
    /** 模块-版本 */
    export const CONSOLE_VERSION: string = "0.1.0";

    export namespace config {
        /**
         * 获取此模块配置
         * @param key 配置项
         * @param defalut 默认值
         */
        export function get<T>(key: string, defalut?: T): T {
            return ibas.config.get(ibas.strings.format("{0}|{1}", CONSOLE_ID, key), defalut);
        }
    }
    export namespace bo {
        /** 业务仓库名称 */
        export const BO_REPOSITORY_APPROVALPROCESS: string = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
        /** 业务对象编码-审批请求 */
        export const BO_CODE_APPROVALREQUEST: string = "${Company}_AP_APPROVALREQU";
        /** 业务对象编码-审批模板 */
        export const BO_CODE_APPROVALTEMPLATE: string = "${Company}_AP_APPROVALTPLT";
        /**
         * 审批步骤所有者类型
         */
        export enum emApprovalStepOwnerType {
            USER,
            DATA_OWNER,
            PROJECT_MANAGER,
            DATA_ORGANIZATION_MANAGER,
            PROJECT_ORGANIZATION_MANAGER
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
        export namespace emums {
            export namespace approval {
                export namespace status {
                    export function valueOf(value: ibas.emApprovalResult): ibas.emApprovalStatus {
                        if (value === ibas.emApprovalResult.APPROVED) {
                            return ibas.emApprovalStatus.APPROVED;
                        } else if (value === ibas.emApprovalResult.REJECTED) {
                            return ibas.emApprovalStatus.REJECTED;
                        } else if (value === ibas.emApprovalResult.RETURNED) {
                            return ibas.emApprovalStatus.RETURNED;
                        } else if (value === ibas.emApprovalResult.PROCESSING) {
                            return ibas.emApprovalStatus.PROCESSING;
                        }
                        return ibas.emApprovalStatus.UNAFFECTED;
                    }
                }
                export namespace stepStatus {
                    export function valueOf(value: ibas.emApprovalResult): ibas.emApprovalStepStatus {
                        if (value === ibas.emApprovalResult.APPROVED) {
                            return ibas.emApprovalStepStatus.APPROVED;
                        } else if (value === ibas.emApprovalResult.REJECTED) {
                            return ibas.emApprovalStepStatus.REJECTED;
                        } else if (value === ibas.emApprovalResult.RETURNED) {
                            return ibas.emApprovalStepStatus.RETURNED;
                        } else if (value === ibas.emApprovalResult.PROCESSING) {
                            return ibas.emApprovalStepStatus.PROCESSING;
                        }
                        return ibas.emApprovalStepStatus.PENDING;
                    }
                }
            }
        }
    }
}