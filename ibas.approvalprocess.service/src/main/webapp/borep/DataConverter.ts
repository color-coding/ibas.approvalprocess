/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace bo {
        /** 数据转换者 */
        export class DataConverter extends ibas.DataConverter4j {

            /** 创建业务对象转换者 */
            protected createConverter(): ibas.BOConverter {
                return new BOConverter;
            }
        }
        /** 模块业务对象工厂 */
        export const boFactory: ibas.BOFactory = new ibas.BOFactory();
        /** 业务对象转换者 */
        class BOConverter extends ibas.BOConverter {
            /** 模块对象工厂 */
            protected factory(): ibas.BOFactory {
                return boFactory;
            }

            /**
             * 自定义解析
             * @param data 远程数据
             * @returns 本地数据
             */
            protected customParsing(data: any): ibas.IBusinessObject {
                return data;
            }

            /**
             * 转换数据
             * @param boName 对象名称
             * @param property 属性名称
             * @param value 值
             * @returns 转换的值
             */
            protected convertData(boName: string, property: string, value: any): any {
                if (boName === bo.ApprovalTemplateStepCondition.name) {
                    if (property === bo.ApprovalTemplateStepCondition.PROPERTY_CONDITIONTYPE_NAME) {
                        return ibas.enums.toString(emApprovalConditionType, value);
                    } else if (property === bo.ApprovalTemplateStepCondition.PROPERTY_RELATIONSHIP_NAME) {
                        return ibas.enums.toString(ibas.emConditionRelationship, value);
                    } else if (property === bo.ApprovalTemplateStepCondition.PROPERTY_OPERATION_NAME) {
                        return ibas.enums.toString(ibas.emConditionOperation, value);
                    }
                } else if (boName === bo.ApprovalTemplateStep.name) {
                    if (property === bo.ApprovalTemplateStep.PROPERTY_STEPOWNERTYPE_NAME) {
                        return ibas.enums.toString(emApprovalStepOwnerType, value);
                    }
                } else if (boName === bo.ApprovalRequestStep.name) {
                    if (property === bo.ApprovalRequestStep.PROPERTY_STEPSTATUS_NAME) {
                        return ibas.enums.toString(ibas.emApprovalStatus, value);
                    }
                }
                return super.convertData(boName, property, value);
            }
            /**
             * 解析数据
             * @param boName 对象名称
             * @param property 属性名称
             * @param value 值
             * @returns 解析的值
             */
            protected parsingData(boName: string, property: string, value: any): any {
                if (boName === bo.ApprovalTemplateStepCondition.name) {
                    if (property === bo.ApprovalTemplateStepCondition.PROPERTY_CONDITIONTYPE_NAME) {
                        return ibas.enums.valueOf(emApprovalConditionType, value);
                    } else if (property === bo.ApprovalTemplateStepCondition.PROPERTY_RELATIONSHIP_NAME) {
                        return ibas.enums.valueOf(ibas.emConditionRelationship, value);
                    } else if (property === bo.ApprovalTemplateStepCondition.PROPERTY_OPERATION_NAME) {
                        return ibas.enums.valueOf(ibas.emConditionOperation, value);
                    }
                } else if (boName === bo.ApprovalTemplateStep.name) {
                    if (property === bo.ApprovalTemplateStep.PROPERTY_STEPOWNERTYPE_NAME) {
                        return ibas.enums.valueOf(emApprovalStepOwnerType, value);
                    }
                } else if (boName === bo.ApprovalRequestStep.name) {
                    if (property === bo.ApprovalRequestStep.PROPERTY_STEPSTATUS_NAME) {
                        return ibas.enums.valueOf(ibas.emApprovalStatus, value);
                    }
                }
                return super.parsingData(boName, property, value);
            }
        }
    }
}