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
                this.view.approvalEvent = this.approval;
                this.view.viewApprovalDataEvent = this.viewApprovalData;
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
                let condition: ibas.ICondition = null;
                if (ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_SUPER) !== true
                    && ibas.strings.equalsIgnoreCase(type, "participated")) {
                    // 我参与的审批请求
                    let cCriteria: ibas.IChildCriteria = criteria.childCriterias.firstOrDefault(
                        c => ibas.strings.equalsIgnoreCase(c.propertyPath, bo.ApprovalRequest.PROPERTY_APPROVALREQUESTSTEPS_NAME));
                    if (ibas.objects.isNull(cCriteria)) {
                        cCriteria = criteria.childCriterias.create();
                        cCriteria.propertyPath = bo.ApprovalRequest.PROPERTY_APPROVALREQUESTSTEPS_NAME;
                        cCriteria.onlyHasChilds = true;
                    }
                    condition = cCriteria.conditions.create();
                    condition.alias = bo.ApprovalRequestStep.PROPERTY_STEPSTATUS_NAME;
                    condition.value = ibas.emApprovalStepStatus.SKIPPED.toString();
                    condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                    condition = cCriteria.conditions.create();
                    condition.alias = bo.ApprovalRequestStep.PROPERTY_STEPSTATUS_NAME;
                    condition.value = ibas.emApprovalStepStatus.PENDING.toString();
                    condition.operation = ibas.emConditionOperation.NOT_EQUAL;

                    this.busy(true);
                    let that: this = this;
                    let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                    boRepository.fetchUserApprovalRequest({
                        user: ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_ID),
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
                } else {
                    if (ibas.strings.equalsIgnoreCase(type, "initiated")) {
                        // 我发起的审批请求
                        if (criteria.conditions.length > 1) {
                            criteria.conditions.firstOrDefault().bracketOpen++;
                            criteria.conditions.lastOrDefault().bracketClose++;
                        }
                        // 有效的审批请求
                        /*
                        condition = criteria.conditions.create();
                        condition.alias = bo.ApprovalRequest.PROPERTY_ACTIVATED_NAME;
                        condition.value = ibas.emYesNo.YES.toString();
                        */
                        condition = criteria.conditions.create();
                        condition.alias = bo.ApprovalRequest.PROPERTY_APPROVALSTATUS_NAME;
                        condition.value = ibas.emApprovalStatus.CANCELLED.toString();
                        condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                        condition = criteria.conditions.create();
                        condition.alias = bo.ApprovalRequest.PROPERTY_APPROVALOWNER_NAME;
                        condition.value = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_ID);
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

            /** 审批操作
             * @param step 审批请求步骤
             * @param result 操作
             * @param judgment 意见
             */
            protected approval(datas: bo.ApprovalRequest[], result: number, judgment: string): void {
                let that: this = this;
                let beApprovalDatas: {
                    /** 审批请求编号 */
                    apRequestId: number,
                    /** 审批请求步骤编号 */
                    apStepId: number,
                    /** 审批的结果 */
                    apResult: number,
                    /** 审批意见 */
                    judgment: string
                }[] = new ibas.ArrayList<any>();
                let user: number = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_ID);
                for (let data of ibas.arrays.create(datas)) {
                    for (let step of data.approvalRequestSteps) {
                        if (result === ibas.emApprovalResult.PROCESSING) {
                            // 撤回，仅批准和拒绝有效
                            if (step.stepStatus !== ibas.emApprovalStepStatus.REJECTED
                                && step.stepStatus !== ibas.emApprovalStepStatus.APPROVED) {
                                continue;
                            }
                            if (step.approvalRequestSubSteps.length > 0) {
                                for (let sub of step.approvalRequestSubSteps) {
                                    if (step.stepStatus !== ibas.emApprovalStepStatus.REJECTED
                                        && step.stepStatus !== ibas.emApprovalStepStatus.APPROVED) {
                                        continue;
                                    }
                                    if (sub.stepOwner !== user) {
                                        continue;
                                    }
                                    beApprovalDatas.push({
                                        apRequestId: step.objectKey,
                                        apStepId: sub.lineId,
                                        apResult: result,
                                        judgment: judgment
                                    });
                                }
                            } else {
                                if (step.stepOwner !== user) {
                                    continue;
                                }
                                beApprovalDatas.push({
                                    apRequestId: step.objectKey,
                                    apStepId: step.lineId,
                                    apResult: result,
                                    judgment: judgment
                                });
                            }
                        } else {
                            if (step.stepStatus !== ibas.emApprovalStepStatus.PROCESSING) {
                                continue;
                            }
                            if (step.approvalRequestSubSteps.length > 0) {
                                for (let sub of step.approvalRequestSubSteps) {
                                    if (sub.stepStatus !== ibas.emApprovalStepStatus.PROCESSING) {
                                        continue;
                                    }
                                    if (sub.stepOwner !== user) {
                                        continue;
                                    }
                                    beApprovalDatas.push({
                                        apRequestId: step.objectKey,
                                        apStepId: sub.lineId,
                                        apResult: result,
                                        judgment: judgment
                                    });
                                }
                            } else {
                                if (step.stepOwner !== user) {
                                    continue;
                                }
                                beApprovalDatas.push({
                                    apRequestId: step.objectKey,
                                    apStepId: step.lineId,
                                    apResult: result,
                                    judgment: judgment
                                });
                            }
                        }
                    }
                }
                if (beApprovalDatas.length === 0) {
                    this.messages(ibas.emMessageType.ERROR, ibas.i18n.prop("approvalprocess_msg_not_found_approvalrequest"));
                    return;
                }
                let caller: ibas.IMessgesCaller = {
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_continue"),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action !== ibas.emMessageAction.YES) {
                            return;
                        }
                        that.busy(true);
                        let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                        ibas.queues.execute(beApprovalDatas,
                            (data, next) => {
                                boRepository.approval({
                                    apRequestId: data.apRequestId,
                                    apStepId: data.apStepId,
                                    apResult: result,
                                    judgment: data.judgment,
                                    onCompleted(opRslt: ibas.IOperationMessage): void {
                                        if (opRslt.resultCode !== 0) {
                                            next(new Error(opRslt.message));
                                        } else {
                                            for (let item of ibas.arrays.create(datas)) {
                                                if (data.apRequestId = item.objectKey) {
                                                    continue;
                                                }
                                                for (let sItem of item.approvalRequestSteps) {
                                                    if (data.apStepId === sItem.lineId) {
                                                        continue;
                                                    }
                                                    sItem.stepStatus = result;
                                                }
                                                if (item.approvalRequestSteps.firstOrDefault(c => c.stepStatus !== result) == null) {
                                                    item.approvalStatus = result;
                                                }
                                            }
                                            next();
                                        }
                                    }
                                });
                            },
                            (error) => {
                                that.busy(false);
                                if (error instanceof Error) {
                                    that.messages(error);
                                } else {
                                    that.messages(ibas.emMessageType.SUCCESS, ibas.i18n.prop("shell_sucessful"));
                                    that.view.destroyDataView(undefined);
                                }
                            }
                        );
                    }
                };
                if (result === ibas.emApprovalResult.APPROVED) {
                    caller.type = ibas.emMessageType.SUCCESS;
                    caller.message = ibas.i18n.prop("approvalprocess_approval_process_continue", ibas.i18n.prop("approvalprocess_step_owner_count", beApprovalDatas.length));
                } else if (result === ibas.emApprovalResult.REJECTED) {
                    caller.type = ibas.emMessageType.ERROR;
                    caller.message = ibas.i18n.prop("approvalprocess_rejected_process_continue", ibas.i18n.prop("approvalprocess_step_owner_count", beApprovalDatas.length));
                } else if (result === ibas.emApprovalResult.RETURNED) {
                    caller.type = ibas.emMessageType.WARNING;
                    caller.message = ibas.i18n.prop("approvalprocess_return_process_continue", ibas.i18n.prop("approvalprocess_step_owner_count", beApprovalDatas.length));
                }
                this.messages(caller);
            }
            private viewApprovalData(data: bo.ApprovalRequest): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_view")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = ibas.criterias.valueOf(data.boKeys);
                if (!ibas.objects.isNull(criteria)) {
                    let proxy: ibas.BOLinkServiceProxy = new ibas.BOLinkServiceProxy({
                        boCode: criteria.businessObject,
                        linkValue: criteria,
                        changeHashUrl: false,
                    });
                    let serviceAgents: ibas.IServiceAgent[] = ibas.servicesManager.getServices({
                        category: criteria.businessObject,
                        proxy: proxy
                    });
                    if (serviceAgents.length > 0) {
                        let serviceMapping: ibas.IServiceMapping = ibas.servicesManager.getServiceMapping(serviceAgents[0].id);
                        if (!ibas.objects.isNull(serviceMapping)) {
                            let service: ibas.IService<ibas.IServiceContract> = serviceMapping.create();
                            if (!ibas.objects.isNull(service)) {
                                // 运行服务
                                if (ibas.objects.instanceOf(service, ibas.Application)) {
                                    let that: this = this;
                                    (<ibas.Application<ibas.IView>>service).navigation = serviceMapping.navigation;
                                    (<ibas.Application<ibas.IView>>service).viewShower = {
                                        show(view: ibas.IView): void {
                                            that.view.showDataView(data, view);
                                            if (view instanceof ibas.View) {
                                                view.isDisplayed = true;
                                            }
                                        },
                                        destroy(view: ibas.IView): void {
                                            that.view.destroyDataView(view);
                                            if (view instanceof ibas.View) {
                                                view.isDisplayed = false;
                                            }
                                        },
                                        busy(view: ibas.IView, busy: boolean, msg: string): void {
                                            that.view.busyDataView(busy, msg);
                                        },
                                        proceeding(view: ibas.IView, type: ibas.emMessageType, msg: string): void {
                                            that.viewShower.proceeding(view, type, msg);
                                        },
                                        messages(caller: ibas.IMessgesCaller): void {
                                            that.viewShower.messages(caller);
                                        },
                                    };
                                }
                                for (let name in serviceAgents[0].caller.proxy.contract) {
                                    if (typeof name === "string") {
                                        (<any>serviceAgents[0].caller)[name] = serviceAgents[0].caller.proxy.contract[name];
                                    }
                                }
                                service.run(
                                    serviceAgents[0].caller
                                ); return;
                            }
                        }
                    }
                    let done: boolean = ibas.servicesManager.runLinkService({
                        boCode: criteria.businessObject,
                        linkValue: criteria
                    });
                    if (!done) {
                        this.proceeding(ibas.emMessageType.WARNING,
                            ibas.i18n.prop("approvalprocess_not_found_businessojbect_link_service",
                                ibas.businessobjects.describe(criteria.businessObject))
                        );
                    }
                }
            }
        }
        /** 视图-审批请求 */
        export interface IApprovalRequestListView extends ibas.IBOListView {
            /** 编辑数据事件，参数：编辑对象 */
            editDataEvent: Function;
            /** 删除数据事件，参数：删除对象集合 */
            deleteDataEvent: Function;
            // 审批操作，参数1，审批请求；参数2，操作
            approvalEvent: Function;
            /** 显示数据 */
            showData(datas: bo.ApprovalRequest[]): void;

            smartMode(smart: boolean): void;

            /** 查看待审批数据 */
            viewApprovalDataEvent: Function;
            /** 显示数据 */
            showDataView(request: bo.ApprovalRequest, view: ibas.IView): void;
            /** 显示数据 */
            destroyDataView(view: ibas.IView): void;
            /** 显示数据 */
            busyDataView(busy: boolean, msg: string): void;
        }
    }
}