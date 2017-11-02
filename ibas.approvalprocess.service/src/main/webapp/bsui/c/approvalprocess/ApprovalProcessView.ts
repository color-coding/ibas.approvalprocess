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
import * as bo from "../../../borep/bo/index";
/**
 * 视图-审批流程
 */
export class ApprovalProcessView extends ibas.BOResidentView implements IApprovalProcessView {
    // 显示列表
    showListEvent: Function;
    // 审批操作，参数1，审批请求；参数2，操作
    approvalEvent: Function;
    /** 绘制工具条视图 */
    darwBar(): any {
        let that: this = this;
        // 不重复创建工具条钮
        if (ibas.objects.isNull(this.bar)) {
            this.bar = new sap.m.Button("", {
                icon: "sap-icon://ui-notifications",
                type: sap.m.ButtonType.Transparent,
                press: function (): void {
                    that.fireViewEvents(that.showFullViewEvent);
                }
            });
        }
        return this.bar;
    }
    private bar: sap.m.Button;
    private form: sap.m.ResponsivePopover;
    /** 绘制视图 */
    darw(): any {
        let that: this = this;
        this.form = new sap.m.ResponsivePopover("", {
            title: ibas.i18n.prop("approvalprocess_app_approvalprocess_title"),
            contentWidth: "300px",
            endButton: new sap.m.Button({
                text: ibas.i18n.prop("approvalprocess_app_approvalprocess_seemore"),
                press: function (): void {
                    that.fireViewEvents(that.showListEvent);
                    that.fireViewEvents(that.closeEvent);
                }
            }),
            placement: sap.m.PlacementType.Bottom,
            content: [
            ],
        });
        return this.form;
    }

    private getPriority(ap: bo.ApprovalRequest): sap.ui.core.Priority {
        let diffDay: number = ibas.dates.difference(ibas.dates.emDifferenceType.DAY, ibas.dates.today(), ap.startedTime);
        if (diffDay < 3) {
            return sap.ui.core.Priority.Low;
        } else if (diffDay < 7) {
            return sap.ui.core.Priority.Medium;
        }
        return sap.ui.core.Priority.High;
    }

    showData(datas: bo.ApprovalRequest[]): void {
        this.form.destroyContent();
        let that: this = this;
        for (let apItem of datas) {
            this.form.addContent(new sap.m.NotificationListItem("", {
                title: apItem.name,
                width: "auto",
                description: apItem.remarks,
                priority: this.getPriority(apItem),
                showCloseButton: false,
                datetime: ibas.strings.format("{0}{1}",
                    ibas.dates.difference(ibas.dates.emDifferenceType.DAY, ibas.dates.today(), apItem.startedTime),
                    ibas.i18n.prop("approvalprocess_day")),
                authorName: apItem.approvalOwner,
                authorPicture: "sap-icon://customer-history",
                press: function (): void {
                    // 详情

                },
                buttons: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("approvalprocess_approve"),
                        type: sap.m.ButtonType.Accept,
                        press(): void {
                            that.fireViewEvents(that.approvalEvent, apItem, ibas.emApprovalResult.APPROVED);
                        }
                    }),
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("approvalprocess_reject"),
                        type: sap.m.ButtonType.Reject,
                        press(): void {
                            that.fireViewEvents(that.approvalEvent, apItem, ibas.emApprovalResult.REJECTED);
                        }
                    }),
                    /*
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("approvalprocess_reset"),
                        type: sap.m.ButtonType.Default,
                        press(): void {
                            that.fireViewEvents(that.approvalEvent, apItem, ibas.emApprovalResult.PROCESSING);
                        }
                    }),
                    */
                ]
            }));
        }
    }
}