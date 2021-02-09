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
            export class ApprovalProcessView extends ibas.ResidentView implements app.IApprovalProcessView {
                // 显示列表
                showListEvent: Function;
                // 审批操作，参数1，审批请求；参数2，操作
                approvalEvent: Function;
                // 查看详情
                viewDataEvent: Function;
                /** 绘制工具条视图 */
                drawBar(): any {
                    let that: this = this;
                    return this.bar = new sap.m.Button("", {
                        tooltip: this.title,
                        icon: "sap-icon://ui-notifications",
                        type: sap.m.ButtonType.Transparent,
                        press: function (): void {
                            that.fireViewEvents(that.showFullViewEvent);
                        }
                    });
                }
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.form = new sap.m.ResponsivePopover("", {
                        title: ibas.i18n.prop("approvalprocess_app_approvalprocess_title"),
                        contentWidth: "auto",
                        placement: sap.m.PlacementType.Bottom,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.SearchField("", {
                                    search(event: sap.ui.base.Event): void {
                                        let source: any = event.getSource();
                                        if (source instanceof sap.m.SearchField) {
                                            that.form.setBusy(true);
                                            let search: string = source.getValue();
                                            let content: string;
                                            if (search) {
                                                search = search.trim().toLowerCase();
                                            }
                                            for (let item of that.form.getContent()) {
                                                if (item instanceof sap.m.NotificationListItem) {
                                                    item.setVisible(true);
                                                    if (ibas.strings.isEmpty(search)) {
                                                        continue;
                                                    }
                                                    content = item.getTitle(); if (content && content.toLowerCase().indexOf(search) >= 0) {
                                                        continue;
                                                    }
                                                    content = item.getAuthorName(); if (content && content.toLowerCase().indexOf(search) >= 0) {
                                                        continue;
                                                    }
                                                    content = item.getDescription(); if (content && content.toLowerCase().indexOf(search) >= 0) {
                                                        continue;
                                                    }
                                                    item.setVisible(false);
                                                }
                                            }
                                            that.form.setBusy(false);
                                        }
                                    }
                                }),
                                new sap.m.Button("", {
                                    icon: "sap-icon://sort-ascending",
                                    press(event: sap.ui.base.Event): void {
                                        let source: any = event.getSource();
                                        if (source instanceof sap.m.Button) {
                                            let items: sap.ui.core.Control[] = that.form.getContent();
                                            if (source.getIcon() === "sap-icon://sort-ascending") {
                                                source.setIcon("sap-icon://sort-descending");
                                                items = items.sort((a, b) => {
                                                    if (a instanceof sap.m.NotificationListItem && b instanceof sap.m.NotificationListItem) {
                                                        return a.getDatetime().localeCompare(b.getDatetime());
                                                    }
                                                    return 0;
                                                });
                                            } else if (source.getIcon() === "sap-icon://sort-descending") {
                                                source.setIcon("sap-icon://sort-ascending");
                                                items = items.sort((a, b) => {
                                                    if (a instanceof sap.m.NotificationListItem && b instanceof sap.m.NotificationListItem) {
                                                        return b.getDatetime().localeCompare(a.getDatetime());
                                                    }
                                                    return 0;
                                                });
                                            }
                                            that.form.removeAllContent();
                                            for (let item of items) {
                                                that.form.addContent(item);
                                            }
                                        }
                                    }
                                })
                            ]
                        }),
                        endButton: new sap.m.Button("", {
                            text: ibas.i18n.prop("approvalprocess_app_approvalprocess_seemore"),
                            press: function (): void {
                                that.fireViewEvents(that.showListEvent);
                                that.fireViewEvents(that.closeEvent);
                            }
                        }),
                        content: [
                        ],
                    });
                    return this.form;
                }
                private bar: sap.m.Button;
                private form: sap.m.ResponsivePopover;

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
                    if (sap.m.BadgeCustomData) {
                        this.bar.addCustomData(new sap.m.BadgeCustomData("", {
                            key: "badge",
                            value: datas.length,
                        }));
                    } else {
                        this.bar.setText(datas.length.toString());
                    }
                    if (!this.isDisplayed) {
                        // 没有显示，退出。
                        return;
                    }
                    this.form.destroyContent();
                    let that: this = this;
                    for (let apItem of datas) {
                        let nlItem: sap.m.NotificationListItem = new sap.m.NotificationListItem("", {
                            title: ibas.strings.format("#{1} · {0}", apItem.name, apItem.objectKey),
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
                        this.form.addContent(nlItem.setDescription(
                            ibas.strings.format("{0}\n {1}",
                                ibas.businessobjects.describe(apItem.boKeys),
                                ibas.strings.isEmpty(apItem.summary) ? "" : apItem.summary)
                        ));
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