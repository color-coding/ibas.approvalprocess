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
                    return new sap.m.ResponsivePopover("", {
                        contentWidth: "auto",
                        showCloseButton: true,
                        title: ibas.i18n.prop("approvalprocess_app_approvalprocess_title"),
                        placement: sap.m.PlacementType.Bottom,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.SearchField("", {
                                    search(event: sap.ui.base.Event): void {
                                        let source: any = event.getSource();
                                        if (source instanceof sap.m.SearchField) {
                                            that.list.setBusy(true);
                                            let search: string = source.getValue();
                                            if (search) {
                                                search = search.trim().toLowerCase();
                                            }
                                            let done: boolean;
                                            for (let item of that.list.getItems()) {
                                                if (item instanceof sap.m.CustomListItem) {
                                                    item.setVisible(true);
                                                    if (ibas.strings.isEmpty(search)) {
                                                        continue;
                                                    }
                                                    done = false;
                                                    for (let text of that.getTextData(item)) {
                                                        if (text && text.toLowerCase().indexOf(search) >= 0) {
                                                            done = true;
                                                            break;
                                                        }
                                                    }
                                                    if (!done) {
                                                        item.setVisible(false);
                                                    }
                                                }
                                            }
                                            that.list.setBusy(false);
                                        }
                                    }
                                }),
                                new sap.m.Button("", {
                                    icon: "sap-icon://sort-ascending",
                                    press(event: sap.ui.base.Event): void {
                                        let source: any = event.getSource();
                                        if (source instanceof sap.m.Button) {
                                            let aData: any, bData: any;
                                            let items: sap.m.ListItemBase[] = that.list.getItems();
                                            if (source.getIcon() === "sap-icon://sort-ascending") {
                                                source.setIcon("sap-icon://sort-descending");
                                                items = items.sort((a, b) => {
                                                    aData = a.getBindingContext()?.getObject();
                                                    bData = b.getBindingContext()?.getObject();
                                                    if (aData instanceof bo.ApprovalRequest && bData instanceof bo.ApprovalRequest) {
                                                        return ibas.dates.compare(aData.startedTime, bData.startedTime);
                                                    }
                                                    return 0;
                                                });
                                            } else if (source.getIcon() === "sap-icon://sort-descending") {
                                                source.setIcon("sap-icon://sort-ascending");
                                                items = items.sort((a, b) => {
                                                    aData = a.getBindingContext()?.getObject();
                                                    bData = b.getBindingContext()?.getObject();
                                                    if (aData instanceof bo.ApprovalRequest && bData instanceof bo.ApprovalRequest) {
                                                        return ibas.dates.compare(bData.startedTime, aData.startedTime);
                                                    }
                                                    return 0;
                                                });
                                            }
                                            that.list.removeAllItems();
                                            for (let item of items) {
                                                that.list.addItem(item);
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
                            this.list = new sap.m.List("", {
                                mode: sap.m.ListMode.None,
                                items: {
                                    path: "/",
                                    template: new sap.m.CustomListItem("", {
                                        content: [
                                            new sap.m.HBox("", {
                                                width: "100%",
                                                alignContent: sap.m.FlexAlignContent.Center,
                                                alignItems: sap.m.FlexAlignItems.Start,
                                                items: [
                                                    new sap.m.VBox("", {
                                                        width: "100%",
                                                        alignContent: sap.m.FlexAlignContent.Center,
                                                        alignItems: sap.m.FlexAlignItems.Start,
                                                        items: [
                                                            new sap.m.Title("", {
                                                                width: "100%",
                                                                text: {
                                                                    parts: [
                                                                        {
                                                                            path: "objectKey",
                                                                        },
                                                                        {
                                                                            path: "name",
                                                                        }
                                                                    ],
                                                                    formatter(objectKey: number, name: string): string {
                                                                        return ibas.strings.format("#{1} · {0}", name, objectKey);
                                                                    }
                                                                }
                                                            }),
                                                            new sap.m.Link("", {
                                                                width: "100%",
                                                                text: {
                                                                    path: "boKeys",
                                                                    formatter(boKeys: string): string {
                                                                        return ibas.businessobjects.describe(boKeys);
                                                                    }
                                                                },
                                                                press(this: sap.m.Link, event: sap.ui.base.Event): void {
                                                                    let data: any = this.getBindingContext().getObject();
                                                                    if (data instanceof bo.ApprovalRequest) {
                                                                        if (!ibas.strings.isEmpty(data.boKeys)) {
                                                                            let criteria: ibas.ICriteria = ibas.criterias.valueOf(data.boKeys);
                                                                            if (!ibas.objects.isNull(criteria)) {
                                                                                let done: boolean = ibas.servicesManager.runLinkService({
                                                                                    boCode: criteria.businessObject,
                                                                                    linkValue: criteria
                                                                                });
                                                                                if (!done) {
                                                                                    that.application.viewShower.proceeding(
                                                                                        that,
                                                                                        ibas.emMessageType.WARNING,
                                                                                        ibas.i18n.prop("approvalprocess_not_found_businessojbect_link_service",
                                                                                            ibas.businessobjects.describe(criteria.businessObject))
                                                                                    );
                                                                                } else {
                                                                                    setTimeout(() => {
                                                                                        that.fireViewEvents(that.closeEvent);
                                                                                    }, 300);
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }),
                                                            new sap.m.Text("", {
                                                                width: "100%",
                                                                text: {
                                                                    path: "summary",
                                                                },
                                                                visible: {
                                                                    path: "summary",
                                                                    formatter(summary: string): boolean {
                                                                        return summary ? true : false;
                                                                    }
                                                                }
                                                            }),
                                                            new sap.m.HBox("", {
                                                                width: "100%",
                                                                alignItems: sap.m.FlexAlignItems.Center,
                                                                justifyContent: sap.m.FlexJustifyContent.Start,
                                                                items: [
                                                                    new sap.extension.m.UserText("", {
                                                                        bindingValue: {
                                                                            path: "approvalOwner"
                                                                        }
                                                                    }).addStyleClass("sapUiTinyMarginEnd"),
                                                                    new sap.extension.m.Text("", {
                                                                        bindingValue: "-",
                                                                    }).addStyleClass("sapUiTinyMarginEnd"),
                                                                    new sap.extension.m.Text("", {
                                                                        bindingValue: {
                                                                            path: "startedTime",
                                                                            formatter(startedTime: Date): string {
                                                                                return ibas.strings.format("{0}{1}",
                                                                                    ibas.dates.difference(ibas.dates.emDifferenceType.DAY, ibas.dates.today(), startedTime),
                                                                                    ibas.i18n.prop("approvalprocess_day"));
                                                                            }
                                                                        }
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    new sap.m.VBox("", {
                                                        width: "auto",
                                                        alignContent: sap.m.FlexAlignContent.Center,
                                                        alignItems: sap.m.FlexAlignItems.End,
                                                        items: [
                                                            new sap.m.Button("", {
                                                                tooltip: ibas.i18n.prop("approvalprocess_approve"),
                                                                type: sap.m.ButtonType.Accept,
                                                                icon: "sap-icon://accept",
                                                                press(this: sap.m.Button): void {
                                                                    that.fireViewEvents(that.approvalEvent, this.getBindingContext().getObject(), ibas.emApprovalResult.APPROVED);
                                                                }
                                                            }),
                                                            new sap.m.Button("", {
                                                                tooltip: ibas.i18n.prop("approvalprocess_reject"),
                                                                type: sap.m.ButtonType.Reject,
                                                                icon: "sap-icon://decline",
                                                                press(this: sap.m.Button): void {
                                                                    that.fireViewEvents(that.approvalEvent, this.getBindingContext().getObject(), ibas.emApprovalResult.REJECTED);
                                                                }
                                                            }),
                                                        ]
                                                    }).addStyleClass("sapUiTinyMarginBegin"),
                                                ]
                                            }).addStyleClass("sapUiForceWidthAuto sapUiTinyMargin"),
                                        ],
                                        highlight: {
                                            path: "startedTime",
                                            formatter(startedTime: Date): sap.ui.core.MessageType {
                                                let diffDay: number = ibas.dates.difference(ibas.dates.emDifferenceType.DAY, ibas.dates.today(), startedTime);
                                                if (diffDay <= 7) {
                                                    return sap.ui.core.MessageType.Success;
                                                } else if (diffDay <= 14) {
                                                    return sap.ui.core.MessageType.Warning;
                                                }
                                                return sap.ui.core.MessageType.Error;
                                            }
                                        },
                                        type: sap.m.ListType.Active,
                                        press(this: sap.m.CustomListItem, event: sap.ui.base.Event): void {
                                            that.fireViewEvents(that.viewDataEvent, this.getBindingContext().getObject());
                                        },
                                    })
                                },
                            })
                        ],
                    }).addStyleClass("sapUiNoContentPadding");
                }
                private bar: sap.m.Button;
                private list: sap.m.List;

                private getTextData(control: any): Array<string> {
                    let texts: Array<string> = new Array<string>();
                    let func: Function = function (control: any) {
                        if (control instanceof sap.m.FlexBox) {
                            for (let item of control.getItems()) {
                                func(item);
                            }
                        } else if (control instanceof sap.m.Text) {
                            texts.push(control.getText(true));
                        } else if (control instanceof sap.m.Title) {
                            texts.push(control.getText());
                        } else if (control instanceof sap.m.CustomListItem) {
                            for (let item of control.getContent()) {
                                func(item);
                            }
                        }
                    };
                    func(control);
                    return texts;
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
                    this.list.setModel(new sap.extension.model.JSONModel(datas));
                }
            }
        }
    }
}