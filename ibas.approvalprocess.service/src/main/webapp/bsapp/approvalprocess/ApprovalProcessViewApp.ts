/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { BORepositoryApprovalProcess } from "../../borep/BORepositories";
import * as bo from "../../borep/bo/index";
/** 应用-审批流程 */
export class ApprovalProcessViewApp extends ibas.BOViewService<IApprovalProcessViewView> {
    /** 应用标识 */
    static APPLICATION_ID: string = "135fa32b-92c5-468c-98bd-5c1297c223d3";
    /** 应用名称 */
    static APPLICATION_NAME: string = "approvalprocess_app_approvalprocessview";
    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = bo.ApprovalRequest.BUSINESS_OBJECT_CODE;
    /** 构造函数 */
    constructor() {
        super();
        this.id = ApprovalProcessViewApp.APPLICATION_ID;
        this.name = ApprovalProcessViewApp.APPLICATION_NAME;
        this.boCode = ApprovalProcessViewApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
    }
    // 运行,覆盖原方法 && args[0]  bo.IApprovalRequest
    run(...args: any[]): void {
        if (!ibas.objects.isNull(args) && args.length === 1) {
            this.viewData = args[0];
            this.fetchData(arguments[0].criteria());
            this.show();
        } else {
            super.run(args);
        }
    }
    private viewData: bo.ApprovalRequest;
    /** 查询数据 */
    protected fetchData(criteria: ibas.ICriteria | string): void {
        this.busy(true);
        let that: this = this;

        if (typeof criteria === "string") {
            criteria = new ibas.Criteria();
            // 添加查询条件

        }
        let boRepository: BORepositoryApprovalProcess = new BORepositoryApprovalProcess();
        boRepository.fetchUserApprovalRequest({
            criteria: criteria,
            onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
                try {
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    that.viewData = opRslt.resultObjects.firstOrDefault();

                    that.view.showApprovalRequest(that.viewData);
                    that.viewShowed();
                } catch (error) {
                    that.messages(error);
                }
            }
        });
        this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("sys_shell_fetching_data"));
    }
    /** 获取服务的契约 */
    protected getServiceProxies(): ibas.IServiceProxy<ibas.IServiceContract>[] {
        return [];
    }
}
/** 视图-客户主数据 */
export interface IApprovalProcessViewView extends ibas.IBOViewView {
    /** 显示数据 */
    showApprovalRequest(data: bo.ApprovalRequest): void;
}
/** 客户主数据连接服务映射 */
export class ApprovalProcessServiceMapping extends ibas.BOLinkServiceMapping {
    /** 构造函数 */
    constructor() {
        super();
        this.id = ApprovalProcessViewApp.APPLICATION_ID;
        this.name = ApprovalProcessViewApp.APPLICATION_NAME;
        this.boCode = ApprovalProcessViewApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 创建服务并运行 */
    create(): ibas.IService<ibas.IServiceContract> {
        return new ApprovalProcessViewApp();
    }
}