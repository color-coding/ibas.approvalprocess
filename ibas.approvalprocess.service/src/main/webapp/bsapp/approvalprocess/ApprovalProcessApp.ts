/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace app {

        /** 配置项目-审批流程刷新间隔（秒） */
        export const CONFIG_ITEM_APPROVALPROCESS_REFRESH_INTERVAL: string = "apInterval";
        /** 应用-审批流程 */
        export class ApprovalProcessApp extends ibas.ResidentApplication<IApprovalProcessView> {
            /** 应用标识 */
            static APPLICATION_ID: string = "dceca747-e6d4-45e3-8df8-a873f1d8c5cc";
            /** 应用名称 */
            static APPLICATION_NAME: string = "approvalprocess_app_approvalprocess";
            /** 构造函数 */
            constructor() {
                super();
                this.id = ApprovalProcessApp.APPLICATION_ID;
                this.name = ApprovalProcessApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            private refresh: boolean = true;
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.showListEvent = this.showList;
                this.view.approvalEvent = this.approval;
                // 自动刷新审批消息
                let that: this = this;
                let time: number = ibas.config.get(CONFIG_ITEM_APPROVALPROCESS_REFRESH_INTERVAL, 180);
                setInterval(function (): void {
                    if (that.isViewShowed() || !that.refresh) {
                        // 界面显示时，不刷新
                        return;
                    }
                    that.fetchApprovalRequest();
                }, time * 1000);
            }
            /** 运行,覆盖原方法 */
            run(): void {
                super.run.apply(this, arguments);
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                this.fetchApprovalRequest();
            }
            protected showList(): void {
                let app: ApprovalRequestListApp = new ApprovalRequestListApp();
                app.viewShower = this.viewShower;
                app.navigation = this.navigation;
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                // 激活的
                condition.alias = bo.ApprovalRequest.PROPERTY_ACTIVATED_NAME;
                condition.value = ibas.emYesNo.YES.toString();
                // 审批中的
                condition = criteria.conditions.create();
                condition.alias = bo.ApprovalRequest.PROPERTY_APPROVALSTATUS_NAME;
                condition.value = ibas.emApprovalStatus.PROCESSING.toString();
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.ApprovalRequest.PROPERTY_OBJECTKEY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 行项目查询
                let childCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                childCriteria.propertyPath = bo.ApprovalRequest.PROPERTY_APPROVALREQUESTSTEPS_NAME;
                childCriteria.onlyHasChilds = true;
                // 当前用户
                condition = childCriteria.conditions.create();
                condition.alias = bo.ApprovalRequestStep.PROPERTY_STEPOWNER_NAME;
                condition.value = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_ID);
                // 审批中
                condition = childCriteria.conditions.create();
                condition.alias = bo.ApprovalRequestStep.PROPERTY_STEPSTATUS_NAME;
                condition.value = ibas.emApprovalStatus.PROCESSING.toString();
                app.run(criteria);
            }
            protected fetchApprovalRequest(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                boRepository.fetchUserApprovalRequest({
                    user: ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_ID),
                    onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            that.view.showData(opRslt.resultObjects);
                            if (!that.refresh) {
                                that.refresh = true;
                            }
                        } catch (error) {
                            that.refresh = false;
                            that.messages(error);
                        }
                    }
                });
            }
            protected approval(ap: bo.ApprovalRequest, result: number): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                boRepository.approval({
                    apRequestId: ap.objectKey,
                    apStepId: ap.approvalRequestSteps.firstOrDefault().lineId,
                    apResult: result,
                    judgment: "",
                    onCompleted(opRslt: ibas.IOperationMessage): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            that.messages(ibas.emMessageType.SUCCESS, opRslt.message);
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
            }
        }
        /** 视图-审批流程 */
        export interface IApprovalProcessView extends ibas.IResidentView {
            // 显示列表
            showListEvent: Function;
            // 显示数据
            showData(datas: bo.ApprovalRequest[]): void;
            // 审批操作，参数1，审批请求；参数2，操作
            approvalEvent: Function;
        }
    }
}