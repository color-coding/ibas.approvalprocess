/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace ui {
        export namespace c {
            /**
             * 视图-审批流程
             */
            export class ApprovalProcessView extends ibas.BOResidentView implements app.IApprovalProcessView {
                // 显示列表
                showListEvent: Function;
                // 审批操作，参数1，审批请求；参数2，操作
                approvalEvent: Function;
                // 查看详情
                viewDataEvent: Function;
                /** 绘制工具条视图 */
                drawBar(): any {
                    let that: this = this;
                    // 不重复创建工具条钮
                    if (ibas.objects.isNull(this.bar)) {
                        this.bar = new sap.m.Button("", {
                            tooltip: this.title,
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
                draw(): any {
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
                            description: ibas.strings.format("{0}\n {1}",
                                ibas.businessobjects.describe(apItem.boKeys),
                                ibas.strings.isEmpty(apItem.remarks) ? "" : apItem.remarks),
                            priority: this.getPriority(apItem),
                            showCloseButton: false,
                            datetime: ibas.strings.format("{0}{1}",
                                ibas.dates.difference(ibas.dates.emDifferenceType.DAY, ibas.dates.today(), apItem.startedTime),
                                ibas.i18n.prop("approvalprocess_day")),
                            authorName: apItem.approvalOwner,
                            authorPicture: "sap-icon://customer-history",
                            press: function (): void {
                                // 详情
                                that.fireViewEvents(that.viewDataEvent, apItem);
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
                            let boRepository: initialfantasy.bo.IBORepositoryInitialFantasy = ibas.boFactory.create(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                            boRepository.fetchUser({
                                criteria: [
                                    new ibas.Condition("DocEntry", ibas.emConditionOperation.EQUAL, nlItem.getAuthorName()),
                                ],
                                onCompleted(opRslt: ibas.IOperationResult<initialfantasy.bo.IUser>): void {
                                    let user: initialfantasy.bo.IUser = opRslt.resultObjects.firstOrDefault();
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
        }
    }
}