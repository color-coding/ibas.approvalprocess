/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace app {

        /** 应用-审批模板 */
        export class ApprovalTemplateEditApp extends ibas.BOEditApplication<IApprovalTemplateEditView, bo.ApprovalTemplate> {

            /** 应用标识 */
            static APPLICATION_ID: string = "dd924e76-424b-47f2-8ee0-8334b7414685";
            /** 应用名称 */
            static APPLICATION_NAME: string = "approvalprocess_app_approvaltemplate_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.ApprovalTemplate.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = ApprovalTemplateEditApp.APPLICATION_ID;
                this.name = ApprovalTemplateEditApp.APPLICATION_NAME;
                this.boCode = ApprovalTemplateEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addApprovalTemplateStepEvent = this.addApprovalTemplateStep;
                this.view.removeApprovalTemplateStepEvent = this.removeApprovalTemplateStep;
                this.view.editApprovalTemplateStepEvent = this.editApprovalTemplateStep;
                this.view.addApprovalTemplateStepConditionEvent = this.addApprovalTemplateStepCondition;
                this.view.removeApprovalTemplateStepConditionEvent = this.removeApprovalTemplateStepCondition;
                this.view.chooseApprovalTemplateBOInformationEvent = this.chooseApprovalTemplateBOInformation;
                this.view.chooseApprovalTemplateBOPropertyEvent = this.chooseApprovalTemplateBOProperty;
                this.view.editApprovalTemplateStepOwnersEvent = this.editApprovalTemplateStepOwners;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.ApprovalTemplate();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showApprovalTemplate(this.editData);
                this.view.showApprovalTemplateSteps(this.editData.approvalTemplateSteps.filterDeleted());
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.ApprovalTemplate): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.ApprovalTemplate)) {
                    let data: bo.ApprovalTemplate = arguments[0];
                    // 新对象直接编辑
                    if (data.isNew) {
                        that.editData = data;
                        that.show();
                        return;
                    }
                    // 尝试重新查询编辑对象
                    let criteria: ibas.ICriteria = data.criteria();
                    if (!ibas.objects.isNull(criteria) && criteria.conditions.length > 0) {
                        // 有效的查询对象查询
                        let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                        boRepository.fetchApprovalTemplate({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalTemplate>): void {
                                let data: bo.ApprovalTemplate;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.ApprovalTemplate)) {
                                    // 查询到了有效数据
                                    that.editData = data;
                                    that.show();
                                } else {
                                    // 数据重新检索无效
                                    that.messages({
                                        type: ibas.emMessageType.WARNING,
                                        message: ibas.i18n.prop("shell_data_deleted_and_created"),
                                        onCompleted(): void {
                                            that.show();
                                        }
                                    });
                                }
                            }
                        });
                        // 开始查询数据
                        return;
                    }
                }
                super.run.apply(this, arguments);
            }
            /** 待编辑的审批步骤数据 */
            protected editApprovalTemplateStepData: bo.ApprovalTemplateStep;
            /** 保存数据 */
            protected saveData(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                boRepository.saveApprovalTemplate({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalTemplate>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                // 删除成功，释放当前对象
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                                that.editData = undefined;
                            } else {
                                // 替换编辑对象
                                that.editData = opRslt.resultObjects.firstOrDefault();
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                            }
                            // 刷新当前视图
                            that.viewShowed();
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_saving_data"));
            }
            /** 删除数据 */
            protected deleteData(): void {
                let that: this = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_delete_continue"),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action === ibas.emMessageAction.YES) {
                            that.editData.delete();
                            that.saveData();
                        }
                    }
                });
            }
            /** 新建数据，参数1：是否克隆 */
            protected createData(clone: boolean): void {
                let that: this = this;
                let createData: Function = function (): void {
                    if (clone) {
                        // 克隆对象
                        that.editData = that.editData.clone();
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_cloned_new"));
                        that.viewShowed();
                    } else {
                        // 新建对象
                        that.editData = new bo.ApprovalTemplate();
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                        that.viewShowed();
                    }
                };
                if (that.editData.isDirty) {
                    this.messages({
                        type: ibas.emMessageType.QUESTION,
                        title: ibas.i18n.prop(this.name),
                        message: ibas.i18n.prop("shell_data_not_saved_continue"),
                        actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                        onCompleted(action: ibas.emMessageAction): void {
                            if (action === ibas.emMessageAction.YES) {
                                createData();
                            }
                        }
                    });
                } else {
                    createData();
                }
            }
            /** 添加审批模板步骤事件 */
            private addApprovalTemplateStep(): void {
                this.editData.approvalTemplateSteps.create();
                // 仅显示没有标记删除的
                this.view.showApprovalTemplateSteps(this.editData.approvalTemplateSteps.filterDeleted());
            }
            /** 删除审批模板步骤事件 */
            private removeApprovalTemplateStep(items: bo.ApprovalTemplateStep[]): void {
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                // 移除项目
                for (let item of items) {
                    if (this.editData.approvalTemplateSteps.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.approvalTemplateSteps.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showApprovalTemplateSteps(this.editData.approvalTemplateSteps.filterDeleted());
            }
            /** 编辑审批模板步骤条件事件 */
            private editApprovalTemplateStep(item: bo.ApprovalTemplateStep): void {
                this.editApprovalTemplateStepData = item;
                if (ibas.objects.isNull(this.editApprovalTemplateStepData)) {
                    // 无编辑对象
                    this.view.showApprovalTemplateSteps(this.editData.approvalTemplateSteps.filterDeleted());
                } else {
                    // 存在编辑对象
                    this.view.showApprovalTemplateStepConditions(this.editApprovalTemplateStepData.approvalTemplateStepConditions.filterDeleted());
                }
            }
            /** 添加审批模板步骤条件事件 */
            private addApprovalTemplateStepCondition(): void {
                if (!this.editApprovalTemplateStepData) {
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_edit")));
                    return;
                }
                this.editApprovalTemplateStepData.approvalTemplateStepConditions.create();
                // 仅显示没有标记删除的
                this.view.showApprovalTemplateStepConditions(this.editApprovalTemplateStepData.approvalTemplateStepConditions.filterDeleted());
            }
            /** 删除审批模板步骤条件事件 */
            private removeApprovalTemplateStepCondition(items: bo.ApprovalTemplateStepCondition[]): void {
                if (!this.editApprovalTemplateStepData) {
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_edit")));
                    return;
                }
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                // 移除项目
                for (let item of items) {
                    if (this.editApprovalTemplateStepData.approvalTemplateStepConditions.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editApprovalTemplateStepData.approvalTemplateStepConditions.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showApprovalTemplateStepConditions(this.editApprovalTemplateStepData.approvalTemplateStepConditions.filterDeleted());
            }
            /** 选择业务对象类型 */
            private chooseApprovalTemplateBOInformation(): void {
                let that: this = this;
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.noChilds = true;
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME;
                condition.value = ".";
                condition.operation = ibas.emConditionOperation.NOT_CONTAIN;

                ibas.servicesManager.runChooseService<initialfantasy.bo.IBOInformation>({
                    boCode: initialfantasy.bo.BO_CODE_BOINFORMATION,
                    criteria: criteria,
                    chooseType: ibas.emChooseType.SINGLE,
                    onCompleted(selecteds: ibas.IList<initialfantasy.bo.IBOInformation>): void {
                        let selected: initialfantasy.bo.IBOInformation = selecteds.firstOrDefault();
                        that.editData.approvalObjectCode = selected.code;
                        that.editData.name = ibas.i18n.prop("approvalprocess_approvaltemplate_name", selected.description);
                        that.view.showApprovalTemplate(that.editData);
                    }
                });
            }
            /** 选择业务对象类型 */
            private chooseApprovalTemplateBOProperty(): void {
                let that: this = this;
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME;
                condition.value = this.editData.approvalObjectCode;
                ibas.servicesManager.runChooseService<initialfantasy.bo.IBOPropertyInformation>({
                    boCode: initialfantasy.bo.BO_CODE_BOPROPERTY,
                    criteria: criteria,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    onCompleted(selecteds: ibas.IList<initialfantasy.bo.IBOPropertyInformation>): void {
                        let builder: ibas.StringBuilder = new ibas.StringBuilder();
                        builder.map(null, "");
                        builder.map(undefined, "");
                        builder.append(that.editData.summary);
                        for (let item of selecteds) {
                            builder.append("${");
                            builder.append(item.property);
                            builder.append("}");
                        }
                        that.editData.summary = builder.toString();
                    }
                });
            }
            private editApprovalTemplateStepOwners(step: bo.ApprovalTemplateStep): void {
                if (ibas.objects.isNull(step)) {
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_edit")));
                    return;
                }
                let app: ApprovalTemplateStepOwnerEditApp = new ApprovalTemplateStepOwnerEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(step, () => {
                    this.view.showApprovalTemplateSteps(this.editData.approvalTemplateSteps.filterDeleted());
                });
            }
        }
        /** 视图-审批模板 */
        export interface IApprovalTemplateEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showApprovalTemplate(data: bo.ApprovalTemplate): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加审批模板步骤事件 */
            addApprovalTemplateStepEvent: Function;
            /** 删除审批模板步骤事件 */
            removeApprovalTemplateStepEvent: Function;
            /** 显示数据 */
            showApprovalTemplateSteps(datas: bo.ApprovalTemplateStep[]): void;
            /** 编辑审批模板步骤条件事件 */
            editApprovalTemplateStepEvent: Function;
            /** 添加审批模板步骤条件事件 */
            addApprovalTemplateStepConditionEvent: Function;
            /** 删除审批模板步骤条件事件 */
            removeApprovalTemplateStepConditionEvent: Function;
            /** 显示数据 */
            showApprovalTemplateStepConditions(datas: bo.ApprovalTemplateStepCondition[]): void;
            /** 选择业务对象类型 */
            chooseApprovalTemplateBOInformationEvent: Function;
            /** 选择业务对象属性 */
            chooseApprovalTemplateBOPropertyEvent: Function;
            /** 编辑审批模板步骤所有者事件 */
            editApprovalTemplateStepOwnersEvent: Function;
        }
        export class ApprovalTemplateStepOwnerEditApp extends ibas.Application<IApprovalTemplateStepOwnerEditView> {
            /** 应用标识 */
            static APPLICATION_ID: string = "933770c7-e08a-44b4-b533-58cd555f1d72";
            /** 应用名称 */
            static APPLICATION_NAME: string = "approvalprocess_app_approvaltemplatestepowner_edit";
            /** 构造函数 */
            constructor() {
                super();
                this.id = ApprovalTemplateStepOwnerEditApp.APPLICATION_ID;
                this.name = ApprovalTemplateStepOwnerEditApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.chooseApprovalTemplateStepUserEvent = this.chooseApprovalTemplateStepUser;
                this.view.addApprovalTemplateStepOwnerEvent = this.addApprovalTemplateStepOwner;
                this.view.removeApprovalTemplateStepOwnerEvent = this.removeApprovalTemplateStepOwner;
            }
            protected viewShowed(): void {
                if (ibas.objects.isNull(this.editData)) {
                    this.editData = new bo.ApprovalTemplateStep();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showApprovalTemplateStepOwners(this.editData.approvalTemplateStepOwners.filterDeleted());
            }
            protected editData: bo.ApprovalTemplateStep;
            protected onCompleted: Function;
            run(data?: bo.ApprovalTemplateStep, onCompleted?: Function): void {
                this.editData = data;
                this.onCompleted = onCompleted;
                super.run();
            }
            /** 添加审批模板步骤事件 */
            private addApprovalTemplateStepOwner(type: string): void {
                if (type === initialfantasy.bo.User.name) {
                    this.chooseApprovalTemplateStepUser(undefined);
                } else {
                    this.editData.approvalTemplateStepOwners.create();
                    // 仅显示没有标记删除的
                    this.view.showApprovalTemplateStepOwners(this.editData.approvalTemplateStepOwners.filterDeleted());
                }
            }
            /** 删除审批模板步骤事件 */
            private removeApprovalTemplateStepOwner(items: bo.ApprovalTemplateStepOwner[]): void {
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                // 移除项目
                for (let item of items) {
                    if (this.editData.approvalTemplateStepOwners.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.approvalTemplateStepOwners.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showApprovalTemplateStepOwners(this.editData.approvalTemplateStepOwners.filterDeleted());
            }
            /** 审批步骤选择步骤所有者 */
            private chooseApprovalTemplateStepUser(caller?: bo.ApprovalTemplateStepOwner): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<initialfantasy.bo.IUser>({
                    boCode: initialfantasy.bo.BO_CODE_USER,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: [
                        new ibas.Condition("Activated", ibas.emConditionOperation.EQUAL, ibas.emYesNo.YES)
                    ],
                    onCompleted(selecteds: ibas.IList<initialfantasy.bo.IUser>): void {
                        // 获取触发的对象
                        let index: number = that.editData.approvalTemplateStepOwners.indexOf(caller);
                        let item: bo.ApprovalTemplateStepOwner = that.editData.approvalTemplateStepOwners[index];
                        // 选择返回数量多于触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.approvalTemplateStepOwners.create();
                                created = true;
                            }
                            item.stepOwner = selected.docEntry;
                            item.stepOwnerType = bo.emApprovalStepOwnerType.USER;
                            if (ibas.strings.isEmpty(that.editData.stepName)) {
                                that.editData.stepName = ibas.i18n.prop("approvalprocess_approvaltemplate_name", selected.name);
                            }
                            item = null;
                        }
                        if (created) {
                            that.view.showApprovalTemplateStepOwners(that.editData.approvalTemplateStepOwners.filterDeleted());
                        }
                    }
                });
            }
            close(): void {
                super.close();
                if (this.onCompleted instanceof Function) {
                    this.onCompleted();
                }
            }
        }
        export interface IApprovalTemplateStepOwnerEditView extends ibas.IView {
            /** 添加审批模板步骤所有者事件 */
            addApprovalTemplateStepOwnerEvent: Function;
            /** 删除审批模板步骤所有者事件 */
            removeApprovalTemplateStepOwnerEvent: Function;
            /** 审批步骤选择步骤所有者 */
            chooseApprovalTemplateStepUserEvent: Function;
            /** 显示步骤所有者 */
            showApprovalTemplateStepOwners(datas: bo.ApprovalTemplateStepOwner[]): void;
        }
    }
}