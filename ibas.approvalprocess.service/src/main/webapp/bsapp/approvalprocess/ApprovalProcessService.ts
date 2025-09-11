/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace app {
        /** 应用-审批流程 */
        export class ApprovalProcessService extends ibas.ServiceApplication<IApprovalProcessServiceView, ibas.IBOServiceContract> {
            /** 应用标识 */
            static APPLICATION_ID: string = "d524386b-c3af-4ff5-8c47-29aa3745440d";
            /** 应用名称 */
            static APPLICATION_NAME: string = "approvalprocess_app_approvalprocess";
            /** 构造函数 */
            constructor() {
                super();
                this.id = ApprovalProcessService.APPLICATION_ID;
                this.name = ApprovalProcessService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.approvalEvent = this.approval;
                this.view.viewApprovalDataEvent = this.viewApprovalData;
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.ApprovalRequest): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.ApprovalRequest)) {
                    let data: bo.ApprovalRequest = arguments[0];
                    this.fetchData(data.criteria());
                    return;
                } else if (typeof arguments[0].category === "string") {
                    // 判断是否为hash参数
                    let value: string = arguments[0].category;
                    if (!ibas.strings.isEmpty(value)) {
                        let criteria: ibas.Criteria = new ibas.Criteria();
                        criteria.result = 1;
                        for (let item of value.split("&")) {
                            let tmps: string[] = item.split("=");
                            if (tmps.length >= 2) {
                                let condition: ibas.ICondition = criteria.conditions.create();
                                condition.alias = tmps[0];
                                condition.value = tmps[1];
                            }
                        }
                        this.fetchData(criteria);
                        // 退出后续
                        return;
                    }
                }
                super.run.apply(this, arguments);
            }
            /** 运行服务 */
            runService(contract: ibas.IBOServiceContract): void {
                let bo: ibas.IBusinessObject;
                if (!ibas.objects.isNull(contract)) {
                    // 传入的数据可能是数组
                    if (contract.data instanceof Array) {
                        // 数组只处理第一个
                        bo = contract.data[0];
                    } else {
                        bo = contract.data;
                    }
                }
                if (ibas.objects.isNull(bo)) {
                    // 输入数据无效，服务不运行
                    this.proceeding(ibas.emMessageType.WARNING,
                        ibas.i18n.prop("approvalprocess_app_approvalprocess") + ibas.i18n.prop("sys_invalid_parameter", "data"));
                } else {
                    let criteria: ibas.ICriteria = new ibas.Criteria();
                    criteria.result = 1;
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = approvalprocess.bo.ApprovalRequest.PROPERTY_BOKEYS_NAME;
                    condition.value = bo.toString();
                    let sort: ibas.ISort = criteria.sorts.create();
                    sort.alias = approvalprocess.bo.ApprovalRequest.PROPERTY_OBJECTKEY_NAME;
                    sort.sortType = ibas.emSortType.DESCENDING;
                    this.fetchData(criteria);
                }
            }
            /** 关联的审批请求 */
            private approvalRequest: bo.ApprovalRequest;
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                if (!ibas.objects.isNull(this.approvalRequest)) {
                    this.view.showApprovalRequest(this.approvalRequest);
                    this.view.showApprovalRequestSteps(this.approvalRequest.approvalRequestSteps.filterDeleted());
                }
            }
            /** 查询审批请求 */
            protected fetchData(criteria: ibas.ICriteria): void {
                let that: this = this;
                if (!ibas.objects.isNull(criteria) && criteria.conditions.length > 0) {
                    this.busy(true);
                    // 有效的查询对象查询
                    let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                    boRepository.fetchApprovalRequest({
                        criteria: criteria,
                        onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
                            that.busy(false);
                            let data: bo.ApprovalRequest;
                            if (opRslt.resultCode === 0) {
                                data = opRslt.resultObjects.firstOrDefault();
                            }
                            if (ibas.objects.instanceOf(data, bo.ApprovalRequest)) {
                                // 查询到了有效数据
                                that.approvalRequest = data;
                                if (that.isViewShowed()) {
                                    that.viewShowed();
                                } else {
                                    that.show();
                                }
                            } else {
                                // 数据重新检索无效
                                that.messages({
                                    title: that.description,
                                    type: ibas.emMessageType.WARNING,
                                    message: ibas.i18n.prop("approvalprocess_msg_not_found_approvalrequest"),
                                    onCompleted(): void {
                                    }
                                });
                            }
                        }
                    });
                    // 开始查询数据
                    return;
                } else {
                    // 输入数据无效，服务不运行
                    this.proceeding(ibas.emMessageType.WARNING,
                        ibas.i18n.prop("approvalprocess_bo_approval_service") + ibas.i18n.prop("sys_invalid_parameter", "data"));
                }
            }
            /** 审批操作
             * @param step 审批请求步骤
             * @param result 操作
             */
            protected approval(step: bo.ApprovalRequestStep, result: number): void {
                let that: this = this;
                if (step.approvalRequestSubSteps.length > 0) {
                    let user: number = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_ID);
                    let subStep: bo.ApprovalRequestStep = step.approvalRequestSubSteps.firstOrDefault(c =>
                        c.stepOwner === user
                        && (result === ibas.emApprovalResult.PROCESSING ?
                            (c.stepStatus === ibas.emApprovalStepStatus.REJECTED || c.stepStatus === ibas.emApprovalStepStatus.APPROVED) :
                            (c.stepStatus === ibas.emApprovalStepStatus.PROCESSING))
                    );
                    if (ibas.objects.isNull(subStep)) {
                        this.messages(ibas.emMessageType.ERROR, ibas.i18n.prop("approvalprocess_msg_not_found_approvalrequest"));
                        return;
                    }
                    step = subStep;
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
                        boRepository.approval({
                            apRequestId: step.objectKey,
                            apStepId: step.lineId,
                            apResult: result,
                            judgment: step.judgment,
                            onCompleted(opRslt: ibas.IOperationMessage): void {
                                try {
                                    that.busy(false);
                                    if (opRslt.resultCode !== 0) {
                                        throw new Error(opRslt.message);
                                    }
                                    that.messages(ibas.emMessageType.SUCCESS, ibas.i18n.prop("shell_sucessful"));
                                    that.fetchData(that.approvalRequest.criteria());
                                } catch (error) {
                                    that.messages(error);
                                }
                            }
                        });
                    }
                };
                if (result === ibas.emApprovalResult.APPROVED) {
                    caller.type = ibas.emMessageType.SUCCESS;
                    caller.message = ibas.i18n.prop("approvalprocess_approval_process_continue", that.approvalRequest.boKeys);
                } else if (result === ibas.emApprovalResult.REJECTED) {
                    caller.type = ibas.emMessageType.ERROR;
                    caller.message = ibas.i18n.prop("approvalprocess_rejected_process_continue", that.approvalRequest.boKeys);
                } else if (result === ibas.emApprovalResult.PROCESSING) {
                    caller.type = ibas.emMessageType.WARNING;
                    caller.message = ibas.i18n.prop("approvalprocess_reset_process_continue",
                        that.approvalRequest.boKeys, ibas.enums.describe(ibas.emApprovalStepStatus, step.stepStatus));
                } else if (result === ibas.emApprovalResult.RETURNED) {
                    caller.type = ibas.emMessageType.WARNING;
                    caller.message = ibas.i18n.prop("approvalprocess_return_process_continue", that.approvalRequest.boKeys);
                }
                this.messages(caller);
            }
            protected viewApprovalData(data: bo.ApprovalRequest): void {
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
        /** 视图-审批流程 */
        export interface IApprovalProcessServiceView extends ibas.IView {
            // 审批操作，参数1，审批请求；参数2，操作
            approvalEvent: Function;
            /** 显示数据 */
            showApprovalRequest(data: bo.ApprovalRequest): void;
            /** 显示数据 */
            showApprovalRequestSteps(datas: bo.ApprovalRequestStep[]): void;

            /** 查看待审批数据 */
            viewApprovalDataEvent: Function;
            /** 显示数据 */
            showDataView(request: bo.ApprovalRequest, view: ibas.IView): void;
            /** 显示数据 */
            destroyDataView(view: ibas.IView): void;
            /** 显示数据 */
            busyDataView(busy: boolean, msg: string): void;
        }
        /** 业务对象审批流程服务映射 */
        export class ApprovalProcessServiceMapping extends ibas.ServiceMapping {

            constructor() {
                super();
                this.id = ApprovalProcessService.APPLICATION_ID;
                this.name = ApprovalProcessService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = ibas.BOServiceProxy;
                this.icon = ibas.i18n.prop("approvalprocess_bo_approval_icon");
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new ApprovalProcessService();
            }
        }
    }
}