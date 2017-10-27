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
import { ApprovalProcessViewApp } from "./ApprovalProcessViewApp";
import { ApprovalRequestProcessListApp } from "./ApprovalRequestProcessListApp";
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
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
        this.view.fetchApprovalRequestEvent = this.fetchApprovalRequest;
        this.view.showApprovalRequestDetailEvent = this.showApprovalRequestDetail;
        this.view.showApprovalRequestListEvent = this.showApprovalRequestList;
    }
    protected showApprovalRequestDetail(data: bo.ApprovalRequest): void {
        let appviewapp: ApprovalProcessViewApp = new ApprovalProcessViewApp();
        appviewapp.viewShower = this.viewShower;
        appviewapp.navigation = this.navigation;
        appviewapp.run(data);
    }
    protected showApprovalRequestList(): void {
        let listApp: ApprovalRequestProcessListApp = new ApprovalRequestProcessListApp();
        listApp.viewShower = this.viewShower;
        listApp.navigation = this.navigation;
        listApp.run();
    }
    protected fetchApprovalRequest(pcri: ibas.ICriteria): void {
        let that: this = this;

        let cri: ibas.ICriteria;
        if (!ibas.objects.isNull(pcri)) {
            cri = pcri;
        } else {
            cri = new ibas.Criteria();
            cri.result = 4;
            let con: ibas.ICondition = cri.conditions.create();
            con.alias = "ApprovalStatus";
            con.value = "P";
            let childCriteris: ibas.IChildCriteria = cri.childCriterias.create();
            childCriteris.propertyPath = "ApprovalRequestSteps";
            con = childCriteris.conditions.create();
            con.alias = "StepOwner";
            con.value = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_CODE);
            con = childCriteris.conditions.create();
            con.alias = "StepStatus";
            con.value = "P";
        }
        // this.busy(true);
        let boRepository: BORepositoryApprovalProcess = new BORepositoryApprovalProcess();
        boRepository.fetchUserApprovalRequest({
            criteria: cri,
            onCompleted(opRslt: ibas.IOperationResult<bo.ApprovalRequest>): void {
                try {
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    that.view.showData(opRslt.resultObjects, cri);
                    that.busy(false);
                } catch (error) {
                    that.messages(error);
                }
            }
        });
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
        this.fetchApprovalRequest(null);

    }
    /** 运行,覆盖原方法 */
    run(...args: any[]): void {
        super.run();
    }
}
/** 视图-审批流程 */
export interface IApprovalProcessView extends ibas.IResidentView {
    /** 查找用户审批项目 */
    showApprovalRequestDetailEvent: Function;
    fetchApprovalRequestEvent: Function;
    showApprovalRequestListEvent: Function;
    showData(datas: bo.ApprovalRequest[], cri: ibas.ICriteria): void;
}
