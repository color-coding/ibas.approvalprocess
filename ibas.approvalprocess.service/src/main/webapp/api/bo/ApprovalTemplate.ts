/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace bo {
        /** 审批模板 */
        export interface IApprovalTemplate extends ibas.IBOSimple {
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

            /** 数据所属组织 */
            organization: string;

            /** 参考1 */
            reference1: string;

            /** 参考2 */
            reference2: string;

            /** 备注 */
            remarks: string;

            /** 审批流程名称 */
            name: string;

            /** 审批的对象类型 */
            approvalObjectCode: string;

            /** 激活的 */
            activated: ibas.emYesNo;

            /** 生效日期 */
            validDate: Date;

            /** 失效日期 */
            invalidDate: Date;


            /** 审批模板步骤集合 */
            approvalTemplateSteps: IApprovalTemplateSteps;


        }

        /** 审批模板步骤 集合 */
        export interface IApprovalTemplateSteps extends ibas.IBusinessObjects<IApprovalTemplateStep> {

            /** 创建并添加子项 */
            create(): IApprovalTemplateStep;
        }

        /** 审批模板步骤 */
        export interface IApprovalTemplateStep extends ibas.IBOSimpleLine {

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

            /** 创建动作标识 */
            createActionId: string;

            /** 更新动作标识 */
            updateActionId: string;

            /** 创建用户 */
            createUserSign: number;

            /** 修改用户 */
            updateUserSign: number;

            /** 参考1 */
            reference1: string;

            /** 参考2 */
            reference2: string;

            /** 步骤名称 */
            stepName: string;

            /** 步骤所有者类型 */
            stepOwnerType: emApprovalStepOwnerType;

            /** 步骤所有者 */
            stepOwner: number;

            /** 步骤执行顺序 */
            stepOrder: number;

            /** 步骤所有者可修改 */
            stepCanModify: ibas.emYesNo;


            /** 审批模板步骤条件集合 */
            approvalTemplateStepConditions: IApprovalTemplateStepConditions;


        }

        /** 审批模板步骤条件 集合 */
        export interface IApprovalTemplateStepConditions extends ibas.IBusinessObjects<IApprovalTemplateStepCondition> {

            /** 创建并添加子项 */
            create(): IApprovalTemplateStepCondition;
        }

        /** 审批模板步骤条件 */
        export interface IApprovalTemplateStepCondition extends ibas.IBOSimpleLine {

            /** 编号 */
            objectKey: number;

            /** 类型 */
            objectCode: string;

            /** 行号 */
            lineId: number;

            /** 步骤行号 */
            stepLineId: number;

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

            /** 参考1 */
            reference1: string;

            /** 参考2 */
            reference2: string;

            /** 比较的类型 */
            conditionType: emApprovalConditionType;

            /** 取值属性 */
            propertyName: string;

            /** 比较的值 */
            conditionValue: string;

            /** 比较的方法 */
            operation: ibas.emConditionOperation;

            /** 与上一个条件的关系 */
            relationship: ibas.emConditionRelationship;

            /** 开括号数 */
            bracketOpen: number;

            /** 闭括号数 */
            bracketClose: number;


        }

    }
}
