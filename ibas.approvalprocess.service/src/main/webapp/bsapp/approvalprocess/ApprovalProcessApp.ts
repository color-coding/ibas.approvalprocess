/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";

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
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
    }
    /** 运行,覆盖原方法 */
    run(...args: any[]): void {
        super.run();
    }
}
/** 视图-审批流程 */
export interface IApprovalProcessView extends ibas.IResidentView {

}
