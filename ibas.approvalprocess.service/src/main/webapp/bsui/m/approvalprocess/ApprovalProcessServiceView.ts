/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../c/approvalprocess/index.ts" />
namespace approvalprocess {
    export namespace ui {
        export namespace m {
            /**
             * 视图-审批流程
             */
            export class ApprovalProcessServiceView extends ibas.View implements app.IApprovalProcessServiceView {
                // 审批操作，参数1，审批请求；参数2，操作
                approvalEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    return this.page = new sap.extension.m.Page("", {
                        showHeader: false,
                        content: [
                            new sap.m.VBox("", {
                                justifyContent: sap.m.FlexJustifyContent.Start,
                                renderType: sap.m.FlexRendertype.Div,
                                items: [
                                    new sap.m.Panel("", {
                                        expandable: true,
                                        expanded: false,
                                        backgroundDesign: sap.m.BackgroundDesign.Transparent,
                                        headerToolbar: new sap.m.Toolbar("", {
                                            content: [
                                                new sap.m.Avatar("", {
                                                    src: "sap-icon://workflow-tasks",
                                                    displaySize: sap.m.AvatarSize.XS,
                                                    backgroundColor: {
                                                        path: "/approvalStatus",
                                                        type: new sap.extension.data.ApprovalStatus(),
                                                        formatter(status: ibas.emApprovalStatus): sap.m.AvatarColor {
                                                            if (status === ibas.emApprovalStatus.APPROVED) {
                                                                return sap.m.AvatarColor.Accent8;
                                                            } else if (status === ibas.emApprovalStatus.PROCESSING) {
                                                                return sap.m.AvatarColor.Accent1;
                                                            } else if (status === ibas.emApprovalStatus.RETURNED) {
                                                                return sap.m.AvatarColor.Accent3;
                                                            } else if (status === ibas.emApprovalStatus.REJECTED) {
                                                                return sap.m.AvatarColor.Accent3;
                                                            } else if (status === ibas.emApprovalStatus.CANCELLED) {
                                                                return sap.m.AvatarColor.Accent10;
                                                            }
                                                            return sap.m.AvatarColor.Accent6;
                                                        }
                                                    }
                                                }),
                                                new sap.m.Title("", {
                                                    text: {
                                                        parts: [
                                                            {
                                                                path: "/objectKey",
                                                                type: new sap.extension.data.Numeric(),
                                                            },
                                                            {
                                                                path: "/name",
                                                                type: new sap.extension.data.Alphanumeric(),
                                                            }
                                                        ],
                                                        formatter(objectKey: number, name: string): string {
                                                            return ibas.strings.format("#{0} · {1}", objectKey, name);
                                                        }
                                                    }
                                                }),
                                                new sap.m.ToolbarSpacer(),
                                                this.switch = new sap.m.Switch("", {
                                                    customTextOn: ibas.i18n.prop("shell_all"),
                                                    change(this: sap.m.Switch): void {
                                                        if (this.getState()) {
                                                            for (let item of that.list.getItems()) {
                                                                item.setVisible(true);
                                                            }
                                                        } else {
                                                            for (let item of that.list.getItems()) {
                                                                let data: any = (<any>item.getModel())?.getData();
                                                                if (data instanceof bo.ApprovalRequestStep) {
                                                                    if (data.stepStatus === ibas.emApprovalStepStatus.PROCESSING) {
                                                                        item.setVisible(true);
                                                                    } else {
                                                                        item.setVisible(false);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                })
                                            ]
                                        }),
                                        content: [
                                            new sap.m.VBox("", {
                                                width: "100%",
                                                height: "100%",
                                                justifyContent: sap.m.FlexJustifyContent.Start,
                                                renderType: sap.m.FlexRendertype.Bare,
                                                items: [
                                                    new sap.extension.m.UserObjectAttribute("", {
                                                        title: ibas.i18n.prop("bo_approvalrequest_approvalowner"),
                                                        bindingValue: {
                                                            path: "/approvalOwner",
                                                            type: new sap.extension.data.Numeric()
                                                        }
                                                    }),
                                                    new sap.extension.m.ObjectApprovalStatus("", {
                                                        title: ibas.i18n.prop("bo_approvalrequest_approvalstatus"),
                                                        enumValue: {
                                                            path: "/approvalStatus",
                                                            type: new sap.extension.data.ApprovalStatus(),
                                                        }
                                                    }),
                                                    new sap.extension.m.ObjectAttribute("", {
                                                        title: ibas.i18n.prop("bo_approvalrequest_startedtime"),
                                                        bindingValue: {
                                                            path: "/startedTime",
                                                            type: new sap.extension.data.Date()
                                                        }
                                                    }),
                                                    new sap.extension.m.ObjectAttribute("", {
                                                        title: ibas.i18n.prop("bo_approvalrequest_finishedtime"),
                                                        bindingValue: {
                                                            path: "/finishedTime",
                                                            type: new sap.extension.data.Date()
                                                        }
                                                    }),
                                                    new sap.extension.m.ObjectAttribute("", {
                                                        title: ibas.i18n.prop("bo_approvalrequest_remarks"),
                                                        bindingValue: {
                                                            path: "/remarks",
                                                            type: new sap.extension.data.Alphanumeric()
                                                        }
                                                    }),
                                                ]
                                            })
                                        ]
                                    }),
                                    new sap.m.MessageStrip("", {
                                        enableFormattedText: true,
                                        type: sap.ui.core.MessageType.Success,
                                        customIcon: "sap-icon://detail-view",
                                        showIcon: true,
                                        link:
                                            new sap.m.Link("", {
                                                width: "100%",
                                                text: {
                                                    path: "/boKeys",
                                                    type: new sap.extension.data.Alphanumeric(),
                                                    formatter(data: string): string {
                                                        return ibas.businessobjects.describe(data);
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
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }),
                                    }),
                                    new sap.m.MessageStrip("", {
                                        enableFormattedText: true,
                                        type: sap.ui.core.MessageType.Warning,
                                        visible: {
                                            path: "/summary",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data) ? false : true;
                                            }
                                        },
                                        text: {
                                            path: "/summary",
                                            type: new sap.extension.data.Alphanumeric(),
                                            formatter(data: string): string {
                                                return ibas.strings.format("<strong>{0}</strong>", data);
                                            }
                                        },
                                    }),
                                ]
                            }),
                            new sap.m.VBox("", {
                                justifyContent: sap.m.FlexJustifyContent.Start,
                                renderType: sap.m.FlexRendertype.Div,
                                items: [
                                    new sap.m.ScrollContainer("", {
                                        horizontal: false,
                                        vertical: true,
                                        focusable: true,
                                        content: [
                                            this.list = new sap.extension.m.List("", {
                                                backgroundDesign: sap.m.BackgroundDesign.Transparent,
                                            })
                                        ]
                                    })]
                            }),
                        ]
                    });
                }
                private page: sap.m.Page;
                private list: sap.m.List;
                private switch: sap.m.Switch;

                /** 显示数据 */
                showApprovalRequest(data: bo.ApprovalRequest): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    this.list.destroyItems();
                    this.list.addItem(new sap.m.CustomListItem("", {
                        content: [
                        ]
                    }).setModel(new sap.extension.model.JSONModel(data))
                    );
                }
                /** 显示数据 */
                showApprovalRequestSteps(datas: bo.ApprovalRequestStep[]): void {
                    let that: this = this;
                    for (let data of datas) {
                        // 跳过跳过的
                        if (data.stepStatus === ibas.emApprovalStepStatus.SKIPPED) {
                            continue;
                        }
                        this.list.addItem(new sap.m.CustomListItem("", {
                            visible: data.stepStatus === ibas.emApprovalStepStatus.PROCESSING ? true : this.switch.getState(),
                            content: [
                                new sap.m.Panel("", {
                                    expandable: true,
                                    expanded: data.stepStatus === ibas.emApprovalStepStatus.PROCESSING ? true : false,
                                    backgroundDesign: sap.m.BackgroundDesign.Transparent,
                                    headerToolbar: new sap.m.Toolbar("", {
                                        content: [
                                            new sap.m.Avatar("", {
                                                src: "sap-icon://customer-history",
                                                displaySize: sap.m.AvatarSize.XS,
                                                backgroundColor: {
                                                    path: "/stepStatus",
                                                    formatter(status: ibas.emApprovalStatus): sap.m.AvatarColor {
                                                        if (status === ibas.emApprovalStatus.APPROVED) {
                                                            return sap.m.AvatarColor.Accent8;
                                                        } else if (status === ibas.emApprovalStatus.PROCESSING) {
                                                            return sap.m.AvatarColor.Accent1;
                                                        } else if (status === ibas.emApprovalStatus.RETURNED) {
                                                            return sap.m.AvatarColor.Accent3;
                                                        } else if (status === ibas.emApprovalStatus.REJECTED) {
                                                            return sap.m.AvatarColor.Accent3;
                                                        } else if (status === ibas.emApprovalStatus.CANCELLED) {
                                                            return sap.m.AvatarColor.Accent10;
                                                        }
                                                        return sap.m.AvatarColor.Accent6;
                                                    }
                                                }
                                            }),
                                            new sap.m.Title("", {
                                                text: {
                                                    path: "/stepName",
                                                    type: new sap.extension.data.Alphanumeric(),
                                                }
                                            })
                                        ]
                                    }),
                                    content: [
                                        new sap.m.VBox("", {
                                            width: "100%",
                                            height: "100%",
                                            justifyContent: sap.m.FlexJustifyContent.Start,
                                            renderType: sap.m.FlexRendertype.Bare,
                                            items: [
                                                new sap.extension.m.UserObjectAttribute("", {
                                                    title: ibas.i18n.prop("bo_approvalrequeststep_stepowner"),
                                                    bindingValue: {
                                                        path: "/stepOwner",
                                                        type: new sap.extension.data.Numeric()
                                                    }
                                                }),
                                                new sap.extension.m.ObjectEnumStatus("", {
                                                    title: ibas.i18n.prop("bo_approvalrequeststep_stepstatus"),
                                                    enumType: ibas.emApprovalStepStatus,
                                                    enumValue: {
                                                        path: "/stepStatus",
                                                        type: new sap.extension.data.ApprovalStepStatus()
                                                    }
                                                }),
                                                new sap.extension.m.ObjectAttribute("", {
                                                    title: ibas.i18n.prop("bo_approvalrequeststep_startedtime"),
                                                    bindingValue: {
                                                        path: "/startedTime",
                                                        type: new sap.extension.data.Date()
                                                    }
                                                }),
                                                new sap.extension.m.ObjectAttribute("", {
                                                    title: ibas.i18n.prop("bo_approvalrequeststep_finishedtime"),
                                                    bindingValue: {
                                                        path: "/finishedTime",
                                                        type: new sap.extension.data.Date()
                                                    }
                                                }),
                                                new sap.extension.m.ObjectAttribute("", {
                                                    title: ibas.i18n.prop("bo_approvalrequeststep_judgment"),
                                                }),
                                                new sap.extension.m.TextArea("", {
                                                    editable: {
                                                        path: "/stepStatus",
                                                        formatter(data: any): boolean {
                                                            return data === ibas.emApprovalStepStatus.PROCESSING ? true : false;
                                                        }
                                                    },
                                                    rows: 2,
                                                }).bindProperty("bindingValue", {
                                                    path: "/judgment",
                                                    type: new sap.extension.data.Alphanumeric()
                                                }),
                                                new sap.m.Toolbar("", {
                                                    style: sap.m.ToolbarStyle.Clear,
                                                    content: [
                                                        new sap.m.Button("", {
                                                            width: "100%",
                                                            enabled: {
                                                                path: "/stepStatus",
                                                                formatter(data: any): boolean {
                                                                    return data === ibas.emApprovalStepStatus.PROCESSING
                                                                        || data === ibas.emApprovalStepStatus.APPROVED ? true : false;
                                                                }
                                                            },
                                                            type: sap.m.ButtonType.Accept,
                                                            text: {
                                                                path: "/stepStatus",
                                                                formatter(data: any): string {
                                                                    if (data === ibas.emApprovalStepStatus.APPROVED) {
                                                                        return ibas.i18n.prop("approvalprocess_reset");
                                                                    }
                                                                    return ibas.i18n.prop("approvalprocess_approve");
                                                                }
                                                            },
                                                            press(this: sap.m.Button): void {
                                                                let data: any = (<any>this.getModel()).getData();
                                                                if (data instanceof bo.ApprovalRequestStep) {
                                                                    if (data.stepStatus === ibas.emApprovalStepStatus.APPROVED) {
                                                                        that.fireViewEvents(that.approvalEvent, data, ibas.emApprovalResult.PROCESSING);
                                                                    } else {
                                                                        that.fireViewEvents(that.approvalEvent, data, ibas.emApprovalResult.APPROVED);
                                                                    }
                                                                }
                                                            },
                                                        }),
                                                        new sap.m.Button("", {
                                                            width: "100%",
                                                            enabled: {
                                                                path: "/stepStatus",
                                                                formatter(data: any): boolean {
                                                                    return data === ibas.emApprovalStepStatus.PROCESSING
                                                                        || data === ibas.emApprovalStepStatus.REJECTED ? true : false;
                                                                }
                                                            },
                                                            type: sap.m.ButtonType.Reject,
                                                            text: {
                                                                path: "/stepStatus",
                                                                formatter(data: any): string {
                                                                    if (data === ibas.emApprovalStepStatus.REJECTED) {
                                                                        return ibas.i18n.prop("approvalprocess_reset");
                                                                    }
                                                                    return ibas.i18n.prop("approvalprocess_reject");
                                                                }
                                                            },
                                                            press(this: sap.m.Button): void {
                                                                let data: any = (<any>this.getModel()).getData();
                                                                if (data instanceof bo.ApprovalRequestStep) {
                                                                    if (data.stepStatus === ibas.emApprovalStepStatus.REJECTED) {
                                                                        that.fireViewEvents(that.approvalEvent, data, ibas.emApprovalResult.PROCESSING);
                                                                    } else {
                                                                        that.fireViewEvents(that.approvalEvent, data, ibas.emApprovalResult.REJECTED);
                                                                    }
                                                                }
                                                            },
                                                        }),
                                                    ]
                                                }),
                                                new sap.m.Toolbar("", {
                                                    style: sap.m.ToolbarStyle.Clear,
                                                    content: [
                                                        new sap.m.Button("", {
                                                            width: "100%",
                                                            enabled: {
                                                                path: "/stepStatus",
                                                                formatter(data: any): boolean {
                                                                    return data === ibas.emApprovalStepStatus.PROCESSING ? true : false;
                                                                }
                                                            },
                                                            type: sap.m.ButtonType.Attention,
                                                            text: ibas.i18n.prop("approvalprocess_return"),
                                                            press: function (): void {
                                                                that.fireViewEvents(that.approvalEvent,
                                                                    (<any>this.getModel()).getData(), ibas.emApprovalResult.RETURNED
                                                                );
                                                            },
                                                        }),
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                            ]
                        }).setModel(new sap.extension.model.JSONModel(data)));
                    }
                }
            }
        }
    }
}