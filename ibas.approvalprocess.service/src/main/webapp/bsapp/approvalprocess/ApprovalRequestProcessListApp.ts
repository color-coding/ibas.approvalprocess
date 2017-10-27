/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "../../borep/bo/index";
import { BORepositoryApprovalProcess } from "../../borep/BORepositories";
import { ApprovalProcessViewApp } from "./ApprovalProcessViewApp";


/** 列表应用-审批请求 */
export class ApprovalRequestProcessListApp extends ibas.BOListApplication<IApprovalRequestProcessListView, bo.ApprovalRequest> {

    /** 应用标识 */
    static APPLICATION_ID: string = "cb86890b-717b-452d-85f5-79dcbf77492f";
    /** 应用名称 */
    static APPLICATION_NAME: string = "initialfantasy_app_approvalrequest_list";
    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = bo.ApprovalRequest.BUSINESS_OBJECT_CODE;
    /** 构造函数 */
    constructor() {
        super();
        this.id = ApprovalRequestProcessListApp.APPLICATION_ID;
        this.name = ApprovalRequestProcessListApp.APPLICATION_NAME;
        this.boCode = ApprovalRequestProcessListApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
        this.view.viewDataEvent = this.viewData;
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
    }
    /** 查询数据 */
    protected fetchData(criteria: ibas.ICriteria): void {
        this.busy(true);
        let that: this = this;
        let boRepository: BORepositoryApprovalProcess = new BORepositoryApprovalProcess();
        boRepository.fetchUserApprovalRequest({
            criteria: criteria,
            onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
                try {
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    that.view.showData(opRslt.resultObjects);
                    that.busy(false);
                } catch (error) {
                    that.messages(error);
                }
            }
        });
        this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("sys_shell_fetching_data"));
    }
    protected newData(): void {
        //
    }
    /** 查看数据，参数：目标数据 */
    protected viewData(data: bo.ApprovalRequest): void {
        // 检查目标数据
        if (ibas.objects.isNull(data)) {
            this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("sys_shell_please_chooose_data",
                ibas.i18n.prop("sys_shell_data_view")
            ));
            return;
        }
        let app: ApprovalProcessViewApp = new ApprovalProcessViewApp();
        app.navigation = this.navigation;
        app.viewShower = this.viewShower;
        app.run(data);

    }
    /** 获取服务的契约 */
    protected getServiceProxies(): ibas.IServiceProxy<ibas.IServiceContract>[] {
        return [];
    }
}
/** 视图-审批请求 */
export interface IApprovalRequestProcessListView extends ibas.IBOListView {
    /** 编辑数据事件，参数：编辑对象 */
    viewDataEvent: Function;
    /** 显示数据 */
    showData(datas: bo.ApprovalRequest[]): void;
}
