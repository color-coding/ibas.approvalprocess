/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace bo {
        /** 审批请求 */
        export interface IApprovalRequest extends ibas.IBOSimple {

            /** 编号 */
            objectKey: number;

            /** 类型 */
            objectCode: string;

            /** 实例号（版本） */
            logInst: number;

            /** 服务系列 */
            series: number;

            /** 数据源 */
            dataSource: string;

            /** 创建日期 */
            createDate: Date;

            /** 创建时间 */
            createTime: number;

            /** 修改日期 */
            updateDate: Date;

            /** 修改时间 */
            updateTime: number;

            /** 创建动作标识 */
            createActionId: string;

            /** 更新动作标识 */
            updateActionId: string;

            /** 创建用户 */
            createUserSign: number;

            /** 修改用户 */
            updateUserSign: number;

            /** 数据所有者 */
            dataOwner: number;

            /** 备注 */
            remarks: string;

            /** 审批请求名称 */
            name: string;

            /** 审批的对象类型 */
            approvalObjectCode: string;

            /** 激活的 */
            activated: ibas.emYesNo;

            /** 审批模板 */
            approvalTemplate: number;

            /** 业务对象标识 */
            boKeys: string;

            /** 审批摘要 */
            summary: string;

            /** 审批状态 */
            approvalStatus: ibas.emApprovalStatus;

            /** 审批所有者 */
            approvalOwner: number;

            /** 开始时间 */
            startedTime: Date;

            /** 结束时间 */
            finishedTime: Date;

            /** 语言类型 */
            className: string;


            /** 审批请求步骤集合 */
            approvalRequestSteps: IApprovalRequestSteps;


        }

        /** 审批请求步骤 集合 */
        export interface IApprovalRequestSteps extends ibas.IBusinessObjects<IApprovalRequestStep> {

            /** 创建并添加子项 */
            create(): IApprovalRequestStep;
        }

        /** 审批请求步骤 */
        export interface IApprovalRequestStep extends ibas.IBOSimpleLine {

            /** 编号 */
            objectKey: number;

            /** 类型 */
            objectCode: string;

            /** 行号 */
            lineId: number;

            /** 实例号（版本） */
            logInst: number;

            /** 数据源 */
            dataSource: string;

            /** 创建日期 */
            createDate: Date;

            /** 创建时间 */
            createTime: number;

            /** 修改日期 */
            updateDate: Date;

            /** 修改时间 */
            updateTime: number;

            /** 创建用户 */
            createUserSign: number;

            /** 修改用户 */
            updateUserSign: number;

            /** 创建动作标识 */
            createActionId: string;

            /** 更新动作标识 */
            updateActionId: string;

            /** 备注 */
            remarks: string;

            /** 步骤名称 */
            stepName: string;

            /** 步骤所有者 */
            stepOwner: number;

            /** 步骤执行顺序 */
            stepOrder: number;

            /** 步骤状态 */
            stepStatus: ibas.emApprovalStepStatus;

            /** 步骤条件 */
            stepConditions: string;

            /** 开始时间 */
            startedTime: Date;

            /** 结束时间 */
            finishedTime: Date;

            /** 审批意见 */
            judgment: string;

            /** 步骤所有者可修改 */
            stepCanModify: ibas.emYesNo;


        }
    }
}

