/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace app {

        /** 查看应用-审批请求 */
        export class ApprovalRequestViewApp extends ibas.BOViewService<IApprovalRequestViewView, bo.ApprovalRequest> {

            /** 应用标识 */
            static APPLICATION_ID: string = "f7a124a5-ba62-4623-aa5e-95681f783406";
            /** 应用名称 */
            static APPLICATION_NAME: string = "approvalprocess_app_approvalrequest_view";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.ApprovalRequest.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = ApprovalRequestViewApp.APPLICATION_ID;
                this.name = ApprovalRequestViewApp.APPLICATION_NAME;
                this.boCode = ApprovalRequestViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.editDataEvent = this.editData;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
            }
            /** 编辑数据，参数：目标数据 */
            protected editData(): void {
                let app: ApprovalRequestEditApp = new ApprovalRequestEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(this.viewData);
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.ApprovalRequest): void;
            run(): void {
                if (ibas.objects.instanceOf(arguments[0], bo.ApprovalRequest)) {
                    this.viewData = arguments[0];
                    let app: ApprovalProcessService = new ApprovalProcessService();
                    app.navigation = this.navigation;
                    app.viewShower = this.viewShower;
                    app.run(this.viewData);
                } else {
                    super.run.apply(this, arguments);
                }
            }
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria | string): void {
                this.busy(true);
                let that: this = this;
                if (typeof criteria === "string") {
                    let condition: ibas.ICondition;
                    let value: string = criteria;
                    criteria = new ibas.Criteria();
                    criteria.result = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.ApprovalRequest.PROPERTY_OBJECTKEY_NAME;
                    condition.value = value;
                }
                let boRepository: bo.BORepositoryApprovalProcess = new bo.BORepositoryApprovalProcess();
                boRepository.fetchApprovalRequest({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            that.viewData = opRslt.resultObjects.firstOrDefault();
                            let app: ApprovalProcessService = new ApprovalProcessService();
                            app.navigation = that.navigation;
                            app.viewShower = that.viewShower;
                            app.run(that.viewData);
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
        }
        /** 视图-审批请求 */
        export interface IApprovalRequestViewView extends ibas.IBOViewView {

        }
        /** 审批请求连接服务映射 */
        export class ApprovalRequestLinkServiceMapping extends ibas.BOLinkServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = ApprovalRequestViewApp.APPLICATION_ID;
                this.name = ApprovalRequestViewApp.APPLICATION_NAME;
                this.boCode = ApprovalRequestViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOLinkServiceCaller> {
                return new ApprovalRequestViewApp();
            }
        }
        /** 权限元素-物料价格清单编辑 */
        export const ELEMENT_APPROVAL_REQUEST_DATA_VIEW: ibas.IElement = {
            id: "aa175b01-98cb-4f23-beef-eb8d04c5a66a",
            name: "approvalprocess_view_approvalprocess_data",
        };
    }
}