/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace app {

        /** 列表应用-审批请求 */
        export class ApprovalRequestListApp extends ibas.BOListApplication<IApprovalRequestListView, bo.ApprovalRequest> {

            /** 应用标识 */
            static APPLICATION_ID: string = "dc9357e5-f3a9-44b2-994f-c0dfbe626bd5";
            /** 应用名称 */
            static APPLICATION_NAME: string = "approvalprocess_app_approvalrequest_list";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.ApprovalRequest.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = ApprovalRequestListApp.APPLICATION_ID;
                this.name = ApprovalRequestListApp.APPLICATION_NAME;
                this.boCode = ApprovalRequestListApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.editDataEvent = this.editData;
                this.view.viewDataEvent = this.viewData;
                this.view.deleteDataEvent = this.deleteData;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                this.view.smartMode(this.smart);
            }
            run(criteria?: ibas.ICriteria): void {
                if (!ibas.objects.isNull(criteria)) {
                    this.smart = false;
                }
                if (ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_SUPER) === true) {
                    this.smart = false;
                }
                super.run.apply(this, arguments);
            }
            private smart: boolean = true;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria, type?: string): void {
                if (ibas.objects.isNull(criteria)) {
                    criteria = new ibas.Criteria();
                    criteria.noChilds = true;
                }
                if (this.smart === true) {
                    let condition: ibas.ICondition = null;
                    if (criteria.conditions.length > 1) {
                        criteria.conditions.firstOrDefault().bracketOpen++;
                        criteria.conditions.lastOrDefault().bracketClose++;
                    }
                    // 有效的审批请求
                    condition = criteria.conditions.create();
                    condition.alias = bo.ApprovalRequest.PROPERTY_ACTIVATED_NAME;
                    condition.value = ibas.emYesNo.YES.toString();
                    condition = criteria.conditions.create();
                    condition.alias = bo.ApprovalRequest.PROPERTY_APPROVALSTATUS_NAME;
                    condition.value = ibas.emApprovalStatus.CANCELLED.toString();
                    condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                    if (ibas.strings.equalsIgnoreCase(type, "initiated")) {
                        // 我发起的审批请求
                        condition = criteria.conditions.create();
                        condition.alias = bo.ApprovalRequest.PROPERTY_APPROVALOWNER_NAME;
                        condition.value = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_ID);
                    } else {
                        // 我参与的审批请求
                        let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                        cCriteria.propertyPath = bo.ApprovalRequest.PROPERTY_APPROVALREQUESTSTEPS_NAME;
                        cCriteria.onlyHasChilds = true;
                        condition = cCriteria.conditions.create();
                        condition.bracketOpen = 1;
                        condition.alias = bo.ApprovalRequestStep.PROPERTY_STEPOWNER_NAME;
                        condition.value = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_ID);
                        condition = cCriteria.conditions.create();
                        condition.alias = bo.ApprovalRequestStep.PROPERTY_STEPOWNERS_NAME;
                        condition.value = ibas.strings.format("!{0},", ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_ID));
                        condition.operation = ibas.emConditionOperation.CONTAIN;
                        condition.relationship = ibas.emConditionRelationship.OR;
                        condition.bracketClose = 1;
                        condition = cCriteria.conditions.create();
                        condition.alias = bo.ApprovalRequestStep.PROPERTY_STEPSTATUS_NAME;
                        condition.value = ibas.emApprovalStepStatus.SKIPPED.toString();
                        condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                        condition = cCriteria.conditions.create();
                        condition.alias = bo.ApprovalRequestStep.PROPERTY_STEPSTATUS_NAME;
                        condition.value = ibas.emApprovalStepStatus.PENDING.toString();
                        condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                    }
                }
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                boRepository.fetchApprovalRequest({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (!that.isViewShowed()) {
                                that.show();
                            }
                            if (opRslt.resultObjects.length === 0) {
                                that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_fetched_none"));
                            }
                            that.view.showData(opRslt.resultObjects);
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
            /** 新建数据 */
            protected newData(): void {
                let app: ApprovalRequestEditApp = new ApprovalRequestEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run();
            }
            /** 查看数据，参数：目标数据 */
            protected viewData(data: bo.ApprovalRequest): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_view")
                    ));
                    return;
                }
                let app: ApprovalProcessService = new ApprovalProcessService();
                app.viewShower = this.viewShower;
                app.navigation = this.navigation;
                app.run(data);
            }
            /** 编辑数据，参数：目标数据 */
            protected editData(data: bo.ApprovalRequest): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_edit")
                    ));
                    return;
                }
                let app: ApprovalRequestEditApp = new ApprovalRequestEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(data);
            }
            /** 删除数据，参数：目标数据集合 */
            protected deleteData(data: bo.ApprovalRequest | bo.ApprovalRequest[]): void {
                let beDeleteds: ibas.IList<bo.ApprovalRequest> = ibas.arrays.create(data);
                // 没有选择删除的对象
                if (beDeleteds.length === 0) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_delete")
                    ));
                    return;
                }
                // 标记删除对象
                beDeleteds.forEach((value) => {
                    value.delete();
                });
                let that: this = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_multiple_data_delete_continue", beDeleteds.length),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action !== ibas.emMessageAction.YES) {
                            return;
                        }
                        let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                        ibas.queues.execute(beDeleteds, (data, next) => {
                            // 处理数据
                            boRepository.saveApprovalRequest({
                                beSaved: data,
                                onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
                                    if (opRslt.resultCode !== 0) {
                                        next(new Error(ibas.i18n.prop("shell_data_delete_error", data, opRslt.message)));
                                    } else {
                                        next();
                                    }
                                }
                            });
                            that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_deleting", data));
                        }, (error) => {
                            // 处理完成
                            if (error instanceof Error) {
                                that.messages(ibas.emMessageType.ERROR, error.message);
                            } else {
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                            }
                            that.busy(false);
                        });
                        that.busy(true);
                    }
                });
            }
        }
        /** 视图-审批请求 */
        export interface IApprovalRequestListView extends ibas.IBOListView {
            /** 编辑数据事件，参数：编辑对象 */
            editDataEvent: Function;
            /** 删除数据事件，参数：删除对象集合 */
            deleteDataEvent: Function;
            /** 显示数据 */
            showData(datas: bo.ApprovalRequest[]): void;

            smartMode(smart: boolean): void;
        }
    }
}