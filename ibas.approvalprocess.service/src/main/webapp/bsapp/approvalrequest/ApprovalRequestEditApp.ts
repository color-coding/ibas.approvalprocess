/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace app {

        /** 应用-审批请求 */
        export class ApprovalRequestEditApp extends ibas.BOEditApplication<IApprovalRequestEditView, bo.ApprovalRequest> {

            /** 应用标识 */
            static APPLICATION_ID: string = "25ea4de2-3898-4704-ba0d-692b98a862c8";
            /** 应用名称 */
            static APPLICATION_NAME: string = "approvalprocess_app_approvalrequest_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.ApprovalRequest.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = ApprovalRequestEditApp.APPLICATION_ID;
                this.name = ApprovalRequestEditApp.APPLICATION_NAME;
                this.boCode = ApprovalRequestEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addApprovalRequestStepEvent = this.addApprovalRequestStep;
                this.view.removeApprovalRequestStepEvent = this.removeApprovalRequestStep;
                this.view.chooseApprovalRequestStepOwnerEvent = this.chooseApprovalRequestStepOwner;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.ApprovalRequest();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showApprovalRequest(this.editData);
                this.view.showApprovalRequestSteps(this.editData.approvalRequestSteps.filterDeleted());
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.ApprovalRequest): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.ApprovalRequest)) {
                    let data: bo.ApprovalRequest = arguments[0];
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
                        boRepository.fetchApprovalRequest({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
                                let data: bo.ApprovalRequest;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.ApprovalRequest)) {
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
            /** 保存数据 */
            protected saveData(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                boRepository.saveApprovalRequest({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
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
                        that.editData = new bo.ApprovalRequest();
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
            /** 添加审批请求步骤事件 */
            private addApprovalRequestStep(): void {
                this.editData.approvalRequestSteps.create();
                // 仅显示没有标记删除的
                this.view.showApprovalRequestSteps(this.editData.approvalRequestSteps.filterDeleted());
            }
            /** 删除审批请求步骤事件 */
            private removeApprovalRequestStep(items: bo.ApprovalRequestStep[]): void {
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                // 移除项目
                for (let item of items) {
                    if (this.editData.approvalRequestSteps.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.approvalRequestSteps.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showApprovalRequestSteps(this.editData.approvalRequestSteps.filterDeleted());
            }
            /** 选择审批步骤所有者事件 */
            private chooseApprovalRequestStepOwner(caller: bo.ApprovalRequestStep): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<initialfantasy.bo.IUser>({
                    boCode: initialfantasy.bo.BO_CODE_USER,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: [
                        new ibas.Condition("Activated", ibas.emConditionOperation.EQUAL, ibas.emYesNo.YES)
                    ],
                    onCompleted(selecteds: ibas.IList<initialfantasy.bo.IUser>): void {
                        let selected: initialfantasy.bo.IUser = selecteds.firstOrDefault();
                        caller.stepOwner = selected.docEntry;
                        caller.stepName = ibas.i18n.prop("approvalprocess_approvaltemplate_name", selected.name);
                    }
                });

            }

        }
        /** 视图-审批请求 */
        export interface IApprovalRequestEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showApprovalRequest(data: bo.ApprovalRequest): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加审批请求步骤事件 */
            addApprovalRequestStepEvent: Function;
            /** 删除审批请求步骤事件 */
            removeApprovalRequestStepEvent: Function;
            /** 显示数据 */
            showApprovalRequestSteps(datas: bo.ApprovalRequestStep[]): void;
            /** 选择审批步骤所有者 */
            chooseApprovalRequestStepOwnerEvent: Function;
        }
    }
}