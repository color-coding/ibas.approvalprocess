/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as openui5 from "openui5/index";
import { IApprovalProcessView } from "../../../bsapp/approvalprocess/index";
import * as bo from "../../../borep/bo/index";
import { IBORepositoryInitialFantasy, BO_REPOSITORY_INITIALFANTASY, IUser } from "../../../3rdparty/initialfantasy/index";
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
            showCloseButton: true,
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
        if (diffDay <= 3) {
            return sap.ui.core.Priority.Low;
        } else if (diffDay <= 7) {
            return sap.ui.core.Priority.Medium;
        }
        return sap.ui.core.Priority.High;
    }

    showData(datas: bo.ApprovalRequest[]): void {
        this.bar.setText(datas.length.toString());
        if (!this.isDisplayed) {
            // 没有显示，退出。
            return;
        }
        this.form.destroyContent();
        let that: this = this;
        for (let apItem of datas) {
            let nlItem: sap.m.NotificationListItem = new sap.m.NotificationListItem("", {
                title: ibas.strings.format("#{1} · {0}", apItem.name, apItem.objectKey),
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
            });
            this.form.addContent(nlItem);
            // 增强描述内容
            this.descript(nlItem);
        }
    }

    private descript(nlItem: sap.m.NotificationListItem): void {
        try {
            if (nlItem.getAuthorName() === ibas.SYSTEM_USER_ID.toString()) {
                nlItem.setAuthorName(ibas.i18n.prop("shell_user_system"));
            } else if (nlItem.getAuthorName() === ibas.UNKNOWN_USER_ID.toString()) {
                nlItem.setAuthorName(ibas.i18n.prop("shell_user_unknown"));
            } else {
                let boRepository: IBORepositoryInitialFantasy = ibas.boFactory.create(BO_REPOSITORY_INITIALFANTASY);
                boRepository.fetchUser({
                    criteria: [
                        new ibas.Condition("DocEntry", ibas.emConditionOperation.EQUAL, nlItem.getAuthorName()),
                    ],
                    onCompleted(opRslt: ibas.IOperationResult<IUser>): void {
                        let user: IUser = opRslt.resultObjects.firstOrDefault();
                        if (!ibas.objects.isNull(user)) {
                            nlItem.setAuthorName(user.name);
                        }
                    }
                });
            }
        } catch (error) {
            ibas.logger.log(error);
        }
    }
}