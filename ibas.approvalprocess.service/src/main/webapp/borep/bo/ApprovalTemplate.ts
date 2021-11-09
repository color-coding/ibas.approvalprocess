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
        export class ApprovalTemplate extends ibas.BOSimple<ApprovalTemplate> implements IApprovalTemplate {

            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = BO_CODE_APPROVALTEMPLATE;
            /** 构造函数 */
            constructor() {
                super();
            }
            /** 映射的属性名称-编号 */
            static PROPERTY_OBJECTKEY_NAME: string = "ObjectKey";
            /** 获取-编号 */
            get objectKey(): number {
                return this.getProperty<number>(ApprovalTemplate.PROPERTY_OBJECTKEY_NAME);
            }
            /** 设置-编号 */
            set objectKey(value: number) {
                this.setProperty(ApprovalTemplate.PROPERTY_OBJECTKEY_NAME, value);
            }

            /** 映射的属性名称-类型 */
            static PROPERTY_OBJECTCODE_NAME: string = "ObjectCode";
            /** 获取-类型 */
            get objectCode(): string {
                return this.getProperty<string>(ApprovalTemplate.PROPERTY_OBJECTCODE_NAME);
            }
            /** 设置-类型 */
            set objectCode(value: string) {
                this.setProperty(ApprovalTemplate.PROPERTY_OBJECTCODE_NAME, value);
            }

            /** 映射的属性名称-实例号（版本） */
            static PROPERTY_LOGINST_NAME: string = "LogInst";
            /** 获取-实例号（版本） */
            get logInst(): number {
                return this.getProperty<number>(ApprovalTemplate.PROPERTY_LOGINST_NAME);
            }
            /** 设置-实例号（版本） */
            set logInst(value: number) {
                this.setProperty(ApprovalTemplate.PROPERTY_LOGINST_NAME, value);
            }

            /** 映射的属性名称-服务系列 */
            static PROPERTY_SERIES_NAME: string = "Series";
            /** 获取-服务系列 */
            get series(): number {
                return this.getProperty<number>(ApprovalTemplate.PROPERTY_SERIES_NAME);
            }
            /** 设置-服务系列 */
            set series(value: number) {
                this.setProperty(ApprovalTemplate.PROPERTY_SERIES_NAME, value);
            }

            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string = "DataSource";
            /** 获取-数据源 */
            get dataSource(): string {
                return this.getProperty<string>(ApprovalTemplate.PROPERTY_DATASOURCE_NAME);
            }
            /** 设置-数据源 */
            set dataSource(value: string) {
                this.setProperty(ApprovalTemplate.PROPERTY_DATASOURCE_NAME, value);
            }

            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string = "CreateDate";
            /** 获取-创建日期 */
            get createDate(): Date {
                return this.getProperty<Date>(ApprovalTemplate.PROPERTY_CREATEDATE_NAME);
            }
            /** 设置-创建日期 */
            set createDate(value: Date) {
                this.setProperty(ApprovalTemplate.PROPERTY_CREATEDATE_NAME, value);
            }

            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string = "CreateTime";
            /** 获取-创建时间 */
            get createTime(): number {
                return this.getProperty<number>(ApprovalTemplate.PROPERTY_CREATETIME_NAME);
            }
            /** 设置-创建时间 */
            set createTime(value: number) {
                this.setProperty(ApprovalTemplate.PROPERTY_CREATETIME_NAME, value);
            }

            /** 映射的属性名称-修改日期 */
            static PROPERTY_UPDATEDATE_NAME: string = "UpdateDate";
            /** 获取-修改日期 */
            get updateDate(): Date {
                return this.getProperty<Date>(ApprovalTemplate.PROPERTY_UPDATEDATE_NAME);
            }
            /** 设置-修改日期 */
            set updateDate(value: Date) {
                this.setProperty(ApprovalTemplate.PROPERTY_UPDATEDATE_NAME, value);
            }

            /** 映射的属性名称-修改时间 */
            static PROPERTY_UPDATETIME_NAME: string = "UpdateTime";
            /** 获取-修改时间 */
            get updateTime(): number {
                return this.getProperty<number>(ApprovalTemplate.PROPERTY_UPDATETIME_NAME);
            }
            /** 设置-修改时间 */
            set updateTime(value: number) {
                this.setProperty(ApprovalTemplate.PROPERTY_UPDATETIME_NAME, value);
            }

            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string = "CreateActionId";
            /** 获取-创建动作标识 */
            get createActionId(): string {
                return this.getProperty<string>(ApprovalTemplate.PROPERTY_CREATEACTIONID_NAME);
            }
            /** 设置-创建动作标识 */
            set createActionId(value: string) {
                this.setProperty(ApprovalTemplate.PROPERTY_CREATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string = "UpdateActionId";
            /** 获取-更新动作标识 */
            get updateActionId(): string {
                return this.getProperty<string>(ApprovalTemplate.PROPERTY_UPDATEACTIONID_NAME);
            }
            /** 设置-更新动作标识 */
            set updateActionId(value: string) {
                this.setProperty(ApprovalTemplate.PROPERTY_UPDATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string = "CreateUserSign";
            /** 获取-创建用户 */
            get createUserSign(): number {
                return this.getProperty<number>(ApprovalTemplate.PROPERTY_CREATEUSERSIGN_NAME);
            }
            /** 设置-创建用户 */
            set createUserSign(value: number) {
                this.setProperty(ApprovalTemplate.PROPERTY_CREATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-修改用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string = "UpdateUserSign";
            /** 获取-修改用户 */
            get updateUserSign(): number {
                return this.getProperty<number>(ApprovalTemplate.PROPERTY_UPDATEUSERSIGN_NAME);
            }
            /** 设置-修改用户 */
            set updateUserSign(value: number) {
                this.setProperty(ApprovalTemplate.PROPERTY_UPDATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-数据所有者 */
            static PROPERTY_DATAOWNER_NAME: string = "DataOwner";
            /** 获取-数据所有者 */
            get dataOwner(): number {
                return this.getProperty<number>(ApprovalTemplate.PROPERTY_DATAOWNER_NAME);
            }
            /** 设置-数据所有者 */
            set dataOwner(value: number) {
                this.setProperty(ApprovalTemplate.PROPERTY_DATAOWNER_NAME, value);
            }

            /** 映射的属性名称-数据所属组织 */
            static PROPERTY_ORGANIZATION_NAME: string = "Organization";
            /** 获取-数据所属组织 */
            get organization(): string {
                return this.getProperty<string>(ApprovalTemplate.PROPERTY_ORGANIZATION_NAME);
            }
            /** 设置-数据所属组织 */
            set organization(value: string) {
                this.setProperty(ApprovalTemplate.PROPERTY_ORGANIZATION_NAME, value);
            }

            /** 映射的属性名称-备注 */
            static PROPERTY_REMARKS_NAME: string = "Remarks";
            /** 获取-备注 */
            get remarks(): string {
                return this.getProperty<string>(ApprovalTemplate.PROPERTY_REMARKS_NAME);
            }
            /** 设置-备注 */
            set remarks(value: string) {
                this.setProperty(ApprovalTemplate.PROPERTY_REMARKS_NAME, value);
            }

            /** 映射的属性名称-审批流程名称 */
            static PROPERTY_NAME_NAME: string = "Name";
            /** 获取-审批流程名称 */
            get name(): string {
                return this.getProperty<string>(ApprovalTemplate.PROPERTY_NAME_NAME);
            }
            /** 设置-审批流程名称 */
            set name(value: string) {
                this.setProperty(ApprovalTemplate.PROPERTY_NAME_NAME, value);
            }

            /** 映射的属性名称-审批的对象类型 */
            static PROPERTY_APPROVALOBJECTCODE_NAME: string = "ApprovalObjectCode";
            /** 获取-审批的对象类型 */
            get approvalObjectCode(): string {
                return this.getProperty<string>(ApprovalTemplate.PROPERTY_APPROVALOBJECTCODE_NAME);
            }
            /** 设置-审批的对象类型 */
            set approvalObjectCode(value: string) {
                this.setProperty(ApprovalTemplate.PROPERTY_APPROVALOBJECTCODE_NAME, value);
            }

            /** 映射的属性名称-激活的 */
            static PROPERTY_ACTIVATED_NAME: string = "Activated";
            /** 获取-激活的 */
            get activated(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(ApprovalTemplate.PROPERTY_ACTIVATED_NAME);
            }
            /** 设置-激活的 */
            set activated(value: ibas.emYesNo) {
                this.setProperty(ApprovalTemplate.PROPERTY_ACTIVATED_NAME, value);
            }

            /** 映射的属性名称-生效日期 */
            static PROPERTY_VALIDDATE_NAME: string = "ValidDate";
            /** 获取-生效日期 */
            get validDate(): Date {
                return this.getProperty<Date>(ApprovalTemplate.PROPERTY_VALIDDATE_NAME);
            }
            /** 设置-生效日期 */
            set validDate(value: Date) {
                this.setProperty(ApprovalTemplate.PROPERTY_VALIDDATE_NAME, value);
            }

            /** 映射的属性名称-失效日期 */
            static PROPERTY_INVALIDDATE_NAME: string = "InvalidDate";
            /** 获取-失效日期 */
            get invalidDate(): Date {
                return this.getProperty<Date>(ApprovalTemplate.PROPERTY_INVALIDDATE_NAME);
            }
            /** 设置-失效日期 */
            set invalidDate(value: Date) {
                this.setProperty(ApprovalTemplate.PROPERTY_INVALIDDATE_NAME, value);
            }

            /** 映射的属性名称-审批流程摘要 */
            static PROPERTY_SUMMARY_NAME: string = "Summary";
            /** 获取-审批流程摘要 */
            get summary(): string {
                return this.getProperty<string>(ApprovalTemplate.PROPERTY_SUMMARY_NAME);
            }
            /** 设置-审批流程摘要 */
            set summary(value: string) {
                this.setProperty(ApprovalTemplate.PROPERTY_SUMMARY_NAME, value);
            }

            /** 映射的属性名称-审批模板步骤集合 */
            static PROPERTY_APPROVALTEMPLATESTEPS_NAME: string = "ApprovalTemplateSteps";
            /** 获取-审批模板步骤集合 */
            get approvalTemplateSteps(): ApprovalTemplateSteps {
                return this.getProperty<ApprovalTemplateSteps>(ApprovalTemplate.PROPERTY_APPROVALTEMPLATESTEPS_NAME);
            }
            /** 设置-审批模板步骤集合 */
            set approvalTemplateSteps(value: ApprovalTemplateSteps) {
                this.setProperty(ApprovalTemplate.PROPERTY_APPROVALTEMPLATESTEPS_NAME, value);
            }


            /** 初始化数据 */
            protected init(): void {
                this.approvalTemplateSteps = new ApprovalTemplateSteps(this);
                this.objectCode = ibas.config.applyVariables(ApprovalTemplate.BUSINESS_OBJECT_CODE);
                this.activated = ibas.emYesNo.YES;
            }
        }

        /** 审批模板步骤 集合 */
        export class ApprovalTemplateSteps extends ibas.BusinessObjects<ApprovalTemplateStep, ApprovalTemplate> implements IApprovalTemplateSteps {

            /** 创建并添加子项 */
            create(): ApprovalTemplateStep {
                let item: ApprovalTemplateStep = new ApprovalTemplateStep();
                this.add(item);
                return item;
            }
            /**
             * 添加项目后
             * @param item 项目
             */
            protected afterAdd(item: ApprovalTemplateStep): void {
                super.afterAdd(item);
                let max: number = 0;
                for (let element of this) {
                    if (item === element) {
                        continue;
                    }
                    if (element.stepOrder > max) {
                        max = element.stepOrder;
                    }
                }
                item.stepOrder = (Math.round((max / 10)) + 1) * 10;
                if (item.stepOrder <= 0) {
                    item.stepOrder = 10;
                }
            }
        }

        /** 审批模板步骤 */
        export class ApprovalTemplateStep extends ibas.BOSimpleLine<ApprovalTemplateStep> implements IApprovalTemplateStep {

            /** 构造函数 */
            constructor() {
                super();
            }
            /** 映射的属性名称-编号 */
            static PROPERTY_OBJECTKEY_NAME: string = "ObjectKey";
            /** 获取-编号 */
            get objectKey(): number {
                return this.getProperty<number>(ApprovalTemplateStep.PROPERTY_OBJECTKEY_NAME);
            }
            /** 设置-编号 */
            set objectKey(value: number) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_OBJECTKEY_NAME, value);
            }

            /** 映射的属性名称-类型 */
            static PROPERTY_OBJECTCODE_NAME: string = "ObjectCode";
            /** 获取-类型 */
            get objectCode(): string {
                return this.getProperty<string>(ApprovalTemplateStep.PROPERTY_OBJECTCODE_NAME);
            }
            /** 设置-类型 */
            set objectCode(value: string) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_OBJECTCODE_NAME, value);
            }

            /** 映射的属性名称-行号 */
            static PROPERTY_LINEID_NAME: string = "LineId";
            /** 获取-行号 */
            get lineId(): number {
                return this.getProperty<number>(ApprovalTemplateStep.PROPERTY_LINEID_NAME);
            }
            /** 设置-行号 */
            set lineId(value: number) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_LINEID_NAME, value);
            }

            /** 映射的属性名称-实例号（版本） */
            static PROPERTY_LOGINST_NAME: string = "LogInst";
            /** 获取-实例号（版本） */
            get logInst(): number {
                return this.getProperty<number>(ApprovalTemplateStep.PROPERTY_LOGINST_NAME);
            }
            /** 设置-实例号（版本） */
            set logInst(value: number) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_LOGINST_NAME, value);
            }

            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string = "DataSource";
            /** 获取-数据源 */
            get dataSource(): string {
                return this.getProperty<string>(ApprovalTemplateStep.PROPERTY_DATASOURCE_NAME);
            }
            /** 设置-数据源 */
            set dataSource(value: string) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_DATASOURCE_NAME, value);
            }

            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string = "CreateDate";
            /** 获取-创建日期 */
            get createDate(): Date {
                return this.getProperty<Date>(ApprovalTemplateStep.PROPERTY_CREATEDATE_NAME);
            }
            /** 设置-创建日期 */
            set createDate(value: Date) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_CREATEDATE_NAME, value);
            }

            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string = "CreateTime";
            /** 获取-创建时间 */
            get createTime(): number {
                return this.getProperty<number>(ApprovalTemplateStep.PROPERTY_CREATETIME_NAME);
            }
            /** 设置-创建时间 */
            set createTime(value: number) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_CREATETIME_NAME, value);
            }

            /** 映射的属性名称-修改日期 */
            static PROPERTY_UPDATEDATE_NAME: string = "UpdateDate";
            /** 获取-修改日期 */
            get updateDate(): Date {
                return this.getProperty<Date>(ApprovalTemplateStep.PROPERTY_UPDATEDATE_NAME);
            }
            /** 设置-修改日期 */
            set updateDate(value: Date) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_UPDATEDATE_NAME, value);
            }

            /** 映射的属性名称-修改时间 */
            static PROPERTY_UPDATETIME_NAME: string = "UpdateTime";
            /** 获取-修改时间 */
            get updateTime(): number {
                return this.getProperty<number>(ApprovalTemplateStep.PROPERTY_UPDATETIME_NAME);
            }
            /** 设置-修改时间 */
            set updateTime(value: number) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_UPDATETIME_NAME, value);
            }

            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string = "CreateActionId";
            /** 获取-创建动作标识 */
            get createActionId(): string {
                return this.getProperty<string>(ApprovalTemplateStep.PROPERTY_CREATEACTIONID_NAME);
            }
            /** 设置-创建动作标识 */
            set createActionId(value: string) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_CREATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string = "UpdateActionId";
            /** 获取-更新动作标识 */
            get updateActionId(): string {
                return this.getProperty<string>(ApprovalTemplateStep.PROPERTY_UPDATEACTIONID_NAME);
            }
            /** 设置-更新动作标识 */
            set updateActionId(value: string) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_UPDATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string = "CreateUserSign";
            /** 获取-创建用户 */
            get createUserSign(): number {
                return this.getProperty<number>(ApprovalTemplateStep.PROPERTY_CREATEUSERSIGN_NAME);
            }
            /** 设置-创建用户 */
            set createUserSign(value: number) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_CREATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-修改用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string = "UpdateUserSign";
            /** 获取-修改用户 */
            get updateUserSign(): number {
                return this.getProperty<number>(ApprovalTemplateStep.PROPERTY_UPDATEUSERSIGN_NAME);
            }
            /** 设置-修改用户 */
            set updateUserSign(value: number) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_UPDATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-备注 */
            static PROPERTY_REMARKS_NAME: string = "Remarks";
            /** 获取-备注 */
            get remarks(): string {
                return this.getProperty<string>(ApprovalTemplateStep.PROPERTY_REMARKS_NAME);
            }
            /** 设置-备注 */
            set remarks(value: string) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_REMARKS_NAME, value);
            }

            /** 映射的属性名称-步骤名称 */
            static PROPERTY_STEPNAME_NAME: string = "StepName";
            /** 获取-步骤名称 */
            get stepName(): string {
                return this.getProperty<string>(ApprovalTemplateStep.PROPERTY_STEPNAME_NAME);
            }
            /** 设置-步骤名称 */
            set stepName(value: string) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_STEPNAME_NAME, value);
            }

            /** 映射的属性名称-步骤所有者类型 */
            static PROPERTY_STEPOWNERTYPE_NAME: string = "StepOwnerType";
            /** 获取-步骤所有者类型 */
            get stepOwnerType(): emApprovalStepOwnerType {
                return this.getProperty<emApprovalStepOwnerType>(ApprovalTemplateStep.PROPERTY_STEPOWNERTYPE_NAME);
            }
            /** 设置-步骤所有者类型 */
            set stepOwnerType(value: emApprovalStepOwnerType) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_STEPOWNERTYPE_NAME, value);
            }

            /** 映射的属性名称-步骤所有者 */
            static PROPERTY_STEPOWNER_NAME: string = "StepOwner";
            /** 获取-步骤所有者 */
            get stepOwner(): number {
                return this.getProperty<number>(ApprovalTemplateStep.PROPERTY_STEPOWNER_NAME);
            }
            /** 设置-步骤所有者 */
            set stepOwner(value: number) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_STEPOWNER_NAME, value);
            }

            /** 映射的属性名称-步骤执行顺序 */
            static PROPERTY_STEPORDER_NAME: string = "StepOrder";
            /** 获取-步骤执行顺序 */
            get stepOrder(): number {
                return this.getProperty<number>(ApprovalTemplateStep.PROPERTY_STEPORDER_NAME);
            }
            /** 设置-步骤执行顺序 */
            set stepOrder(value: number) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_STEPORDER_NAME, value);
            }

            /** 映射的属性名称-步骤所有者可修改 */
            static PROPERTY_STEPCANMODIFY_NAME: string = "StepCanModify";
            /** 获取-步骤所有者可修改 */
            get stepCanModify(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(ApprovalTemplateStep.PROPERTY_STEPCANMODIFY_NAME);
            }
            /** 设置-步骤所有者可修改 */
            set stepCanModify(value: ibas.emYesNo) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_STEPCANMODIFY_NAME, value);
            }

            /** 映射的属性名称-审批模板步骤条件集合 */
            static PROPERTY_APPROVALTEMPLATESTEPCONDITIONS_NAME: string = "ApprovalTemplateStepConditions";
            /** 获取-审批模板步骤条件集合 */
            get approvalTemplateStepConditions(): ApprovalTemplateStepConditions {
                return this.getProperty<ApprovalTemplateStepConditions>(ApprovalTemplateStep.PROPERTY_APPROVALTEMPLATESTEPCONDITIONS_NAME);
            }
            /** 设置-审批模板步骤条件集合 */
            set approvalTemplateStepConditions(value: ApprovalTemplateStepConditions) {
                this.setProperty(ApprovalTemplateStep.PROPERTY_APPROVALTEMPLATESTEPCONDITIONS_NAME, value);
            }

            /** 初始化数据 */
            protected init(): void {
                this.approvalTemplateStepConditions = new ApprovalTemplateStepConditions(this);
                this.stepOwnerType = emApprovalStepOwnerType.USER;
            }

            protected registerRules(): ibas.IBusinessRule[] {
                return [
                    // 根据所有者类型，改变名称
                    new ChangeStepName(
                        ApprovalTemplateStep.PROPERTY_STEPNAME_NAME, ApprovalTemplateStep.PROPERTY_STEPOWNERTYPE_NAME),
                ];
            }
        }
        /** 业务规则-更新步骤名称 */
        class ChangeStepName extends ibas.BusinessRuleCommon {
            /**
             *
             * @param length 长度
             * @param properties 属性
             */
            constructor(stepName: string, ownerType: string) {
                super();
                this.stepName = stepName;
                this.ownerType = ownerType;
                this.inputProperties.add(this.ownerType);
                this.affectedProperties.add(this.stepName);
            }
            /** 所有者类型 */
            ownerType: string;
            /** 步骤名称 */
            stepName: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let type: emApprovalStepOwnerType = context.inputValues.get(this.ownerType);
                let name: string = ibas.i18n.prop("approvalprocess_approvaltemplate_name", ibas.enums.describe(emApprovalStepOwnerType, type));
                context.outputValues.set(this.stepName, name);
            }
        }
        /** 审批模板步骤条件 集合 */
        export class ApprovalTemplateStepConditions extends ibas.BusinessObjects<ApprovalTemplateStepCondition, ApprovalTemplateStep> implements IApprovalTemplateStepConditions {

            /** 创建并添加子项 */
            create(): ApprovalTemplateStepCondition {
                let item: ApprovalTemplateStepCondition = new ApprovalTemplateStepCondition();
                this.add(item);
                return item;
            }
        }
        /** 审批模板步骤条件 */
        export class ApprovalTemplateStepCondition extends ibas.BOSimpleLine<ApprovalTemplateStepCondition> implements IApprovalTemplateStepCondition {

            /** 构造函数 */
            constructor() {
                super();
            }
            /** 映射的属性名称-编号 */
            static PROPERTY_OBJECTKEY_NAME: string = "ObjectKey";
            /** 获取-编号 */
            get objectKey(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_OBJECTKEY_NAME);
            }
            /** 设置-编号 */
            set objectKey(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_OBJECTKEY_NAME, value);
            }

            /** 映射的属性名称-类型 */
            static PROPERTY_OBJECTCODE_NAME: string = "ObjectCode";
            /** 获取-类型 */
            get objectCode(): string {
                return this.getProperty<string>(ApprovalTemplateStepCondition.PROPERTY_OBJECTCODE_NAME);
            }
            /** 设置-类型 */
            set objectCode(value: string) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_OBJECTCODE_NAME, value);
            }

            /** 映射的属性名称-行号 */
            static PROPERTY_LINEID_NAME: string = "LineId";
            /** 获取-行号 */
            get lineId(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_LINEID_NAME);
            }
            /** 设置-行号 */
            set lineId(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_LINEID_NAME, value);
            }

            /** 映射的属性名称-步骤行号 */
            static PROPERTY_STEPLINEID_NAME: string = "StepLineId";
            /** 获取-步骤行号 */
            get stepLineId(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_STEPLINEID_NAME);
            }
            /** 设置-步骤行号 */
            set stepLineId(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_STEPLINEID_NAME, value);
            }

            /** 映射的属性名称-实例号（版本） */
            static PROPERTY_LOGINST_NAME: string = "LogInst";
            /** 获取-实例号（版本） */
            get logInst(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_LOGINST_NAME);
            }
            /** 设置-实例号（版本） */
            set logInst(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_LOGINST_NAME, value);
            }

            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string = "DataSource";
            /** 获取-数据源 */
            get dataSource(): string {
                return this.getProperty<string>(ApprovalTemplateStepCondition.PROPERTY_DATASOURCE_NAME);
            }
            /** 设置-数据源 */
            set dataSource(value: string) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_DATASOURCE_NAME, value);
            }

            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string = "CreateDate";
            /** 获取-创建日期 */
            get createDate(): Date {
                return this.getProperty<Date>(ApprovalTemplateStepCondition.PROPERTY_CREATEDATE_NAME);
            }
            /** 设置-创建日期 */
            set createDate(value: Date) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_CREATEDATE_NAME, value);
            }

            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string = "CreateTime";
            /** 获取-创建时间 */
            get createTime(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_CREATETIME_NAME);
            }
            /** 设置-创建时间 */
            set createTime(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_CREATETIME_NAME, value);
            }

            /** 映射的属性名称-修改日期 */
            static PROPERTY_UPDATEDATE_NAME: string = "UpdateDate";
            /** 获取-修改日期 */
            get updateDate(): Date {
                return this.getProperty<Date>(ApprovalTemplateStepCondition.PROPERTY_UPDATEDATE_NAME);
            }
            /** 设置-修改日期 */
            set updateDate(value: Date) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_UPDATEDATE_NAME, value);
            }

            /** 映射的属性名称-修改时间 */
            static PROPERTY_UPDATETIME_NAME: string = "UpdateTime";
            /** 获取-修改时间 */
            get updateTime(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_UPDATETIME_NAME);
            }
            /** 设置-修改时间 */
            set updateTime(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_UPDATETIME_NAME, value);
            }

            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string = "CreateUserSign";
            /** 获取-创建用户 */
            get createUserSign(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_CREATEUSERSIGN_NAME);
            }
            /** 设置-创建用户 */
            set createUserSign(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_CREATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-修改用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string = "UpdateUserSign";
            /** 获取-修改用户 */
            get updateUserSign(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_UPDATEUSERSIGN_NAME);
            }
            /** 设置-修改用户 */
            set updateUserSign(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_UPDATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string = "CreateActionId";
            /** 获取-创建动作标识 */
            get createActionId(): string {
                return this.getProperty<string>(ApprovalTemplateStepCondition.PROPERTY_CREATEACTIONID_NAME);
            }
            /** 设置-创建动作标识 */
            set createActionId(value: string) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_CREATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string = "UpdateActionId";
            /** 获取-更新动作标识 */
            get updateActionId(): string {
                return this.getProperty<string>(ApprovalTemplateStepCondition.PROPERTY_UPDATEACTIONID_NAME);
            }
            /** 设置-更新动作标识 */
            set updateActionId(value: string) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_UPDATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-备注 */
            static PROPERTY_REMARKS_NAME: string = "Remarks";
            /** 获取-备注 */
            get remarks(): string {
                return this.getProperty<string>(ApprovalTemplateStepCondition.PROPERTY_REMARKS_NAME);
            }
            /** 设置-备注 */
            set remarks(value: string) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_REMARKS_NAME, value);
            }

            /** 映射的属性名称-比较的类型 */
            static PROPERTY_CONDITIONTYPE_NAME: string = "ConditionType";
            /** 获取-比较的类型 */
            get conditionType(): emApprovalConditionType {
                return this.getProperty<emApprovalConditionType>(ApprovalTemplateStepCondition.PROPERTY_CONDITIONTYPE_NAME);
            }
            /** 设置-比较的类型 */
            set conditionType(value: emApprovalConditionType) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_CONDITIONTYPE_NAME, value);
            }

            /** 映射的属性名称-取值属性 */
            static PROPERTY_PROPERTYNAME_NAME: string = "PropertyName";
            /** 获取-取值属性 */
            get propertyName(): string {
                return this.getProperty<string>(ApprovalTemplateStepCondition.PROPERTY_PROPERTYNAME_NAME);
            }
            /** 设置-取值属性 */
            set propertyName(value: string) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_PROPERTYNAME_NAME, value);
            }

            /** 映射的属性名称-比较的值 */
            static PROPERTY_CONDITIONVALUE_NAME: string = "ConditionValue";
            /** 获取-比较的值 */
            get conditionValue(): string {
                return this.getProperty<string>(ApprovalTemplateStepCondition.PROPERTY_CONDITIONVALUE_NAME);
            }
            /** 设置-比较的值 */
            set conditionValue(value: string) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_CONDITIONVALUE_NAME, value);
            }

            /** 映射的属性名称-比较的方法 */
            static PROPERTY_OPERATION_NAME: string = "Operation";
            /** 获取-比较的方法 */
            get operation(): initialfantasy.bo.emConditionOperation {
                return this.getProperty<initialfantasy.bo.emConditionOperation>(ApprovalTemplateStepCondition.PROPERTY_OPERATION_NAME);
            }
            /** 设置-比较的方法 */
            set operation(value: initialfantasy.bo.emConditionOperation) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_OPERATION_NAME, value);
            }

            /** 映射的属性名称-与上一个条件的关系 */
            static PROPERTY_RELATIONSHIP_NAME: string = "Relationship";
            /** 获取-与上一个条件的关系 */
            get relationship(): initialfantasy.bo.emConditionRelationship {
                return this.getProperty<initialfantasy.bo.emConditionRelationship>(ApprovalTemplateStepCondition.PROPERTY_RELATIONSHIP_NAME);
            }
            /** 设置-与上一个条件的关系 */
            set relationship(value: initialfantasy.bo.emConditionRelationship) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_RELATIONSHIP_NAME, value);
            }

            /** 映射的属性名称-开括号数 */
            static PROPERTY_BRACKETOPEN_NAME: string = "BracketOpen";
            /** 获取-开括号数 */
            get bracketOpen(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_BRACKETOPEN_NAME);
            }
            /** 设置-开括号数 */
            set bracketOpen(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_BRACKETOPEN_NAME, value);
            }

            /** 映射的属性名称-闭括号数 */
            static PROPERTY_BRACKETCLOSE_NAME: string = "BracketClose";
            /** 获取-闭括号数 */
            get bracketClose(): number {
                return this.getProperty<number>(ApprovalTemplateStepCondition.PROPERTY_BRACKETCLOSE_NAME);
            }
            /** 设置-闭括号数 */
            set bracketClose(value: number) {
                this.setProperty(ApprovalTemplateStepCondition.PROPERTY_BRACKETCLOSE_NAME, value);
            }

            /** 初始化数据 */
            protected init(): void {
                this.conditionType = emApprovalConditionType.PROPERTY_VALUE;
                this.operation = initialfantasy.bo.emConditionOperation.EQUAL;
                this.relationship = initialfantasy.bo.emConditionRelationship.AND;
            }
        }

    }
}