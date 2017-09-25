/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { utils } from "openui5/typings/ibas.utils";
import { IApprovalProcessView } from "../../../bsapp/approvalprocess/index";
import * as bo from "../../../3rdparty/initialfantasy/index";
/**
 * 视图-审批流程
 */
export class ApprovalProcessView extends ibas.BOResidentView implements IApprovalProcessView {
    /** 绘制工具条视图 */
    darwBar(): any {
        let that: this = this;
        // 不重复创建工具条钮
        if (ibas.objects.isNull(this.bar)) {
            this.bar = new sap.m.Button("", {
                icon: "sap-icon://approvals",
                type: sap.m.ButtonType.Transparent,
                press: function (): void {
                    that.fireViewEvents(that.showApprovalRequestListEvent);
                }
            });
        }
        return this.bar;
    }
    // private stepsWizard: sap.m.Wizard;
    // 页面事件
    showFullViewEvent: Function;
    fetchApprovalRequestEvent: Function;
    showApprovalRequestDetailEvent: Function;
    showApprovalRequestListEvent: Function;
    // 控件
    private bar: sap.m.Button;
    /** 绘制视图 */
    darw(): any {
    let form: sap.ui.layout.VerticalLayout = new sap.ui.layout.VerticalLayout("", {});
        return form;
    }
    showData(datas: bo.IApprovalRequest[], cri: ibas.ICriteria): void {
        //
    }


}