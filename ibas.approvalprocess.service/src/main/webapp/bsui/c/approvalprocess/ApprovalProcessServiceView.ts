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
            export class ApprovalProcessServiceView extends ibas.View implements app.IApprovalProcessServiceView {
                // 审批操作，参数1，审批请求；参数2，操作
                approvalEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    return new sap.extension.m.Page("", {
                        showHeader: false,
                        // customHeader: this.titleBar = new sap.m.Toolbar("", {
                        subHeader: this.titleBar = new sap.m.Toolbar("", {
                            content: [
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
                                    },
                                }).addStyleClass("sapUiTinyMarginBegin"),
                                new sap.m.ToolbarSeparator("", {
                                }),
                                new sap.m.Title("", {
                                    text: {
                                        path: "/boKeys",
                                        type: new sap.extension.data.Alphanumeric(),
                                        formatter(boKeys: string): string {
                                            return ibas.businessobjects.describe(boKeys);
                                        }
                                    },
                                }),
                                new sap.m.ToolbarSeparator("", {
                                }),
                                new sap.m.ToolbarSpacer(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("approvalprocess_view_data"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://detail-view",
                                    press(this: sap.m.Button): void {
                                        let data: any = (<any>this.getModel()).getData();
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
                                })
                            ]
                        }),
                        content: [
                            this.messageStrip = new sap.m.MessageStrip("", {
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
                            this.stepBar = new sap.m.IconTabBar("", {
                                expandable: false,
                                content: [
                                ]
                            })
                        ]
                    });
                }
                private titleBar: sap.m.Toolbar;
                private stepBar: sap.m.IconTabBar;
                private messageStrip: sap.m.MessageStrip;

                /** 显示数据 */
                showApprovalRequest(data: bo.ApprovalRequest): void {
                    this.titleBar.setModel(new sap.extension.model.JSONModel(data));
                    this.messageStrip.setModel(new sap.extension.model.JSONModel(data));
                    this.stepBar.destroyItems();
                    this.stepBar.addItem(new sap.m.IconTabFilter("", {
                        icon: "sap-icon://workflow-tasks",
                        design: sap.m.IconTabFilterDesign.Horizontal,
                        iconColor: {
                            path: "/approvalStatus",
                            formatter(status: ibas.emApprovalStatus): sap.ui.core.IconColor {
                                if (status === ibas.emApprovalStatus.APPROVED) {
                                    return sap.ui.core.IconColor.Positive;
                                } else if (status === ibas.emApprovalStatus.RETURNED) {
                                    return sap.ui.core.IconColor.Neutral;
                                } else if (status === ibas.emApprovalStatus.PROCESSING) {
                                    return sap.ui.core.IconColor.Critical;
                                } else if (status === ibas.emApprovalStatus.REJECTED) {
                                    return sap.ui.core.IconColor.Negative;
                                } else if (status === ibas.emApprovalStatus.CANCELLED) {
                                    return sap.ui.core.IconColor.Default;
                                }
                                return sap.ui.core.IconColor.Default;
                            }
                        },
                        count: data.name,
                        text: ibas.enums.describe(ibas.emApprovalStatus, data.approvalStatus),
                        content: [
                            new sap.ui.layout.form.SimpleForm("", {
                                editable: true,
                                content: [
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_name") }),
                                    new sap.extension.m.Input("", {
                                        editable: false,
                                        type: sap.m.InputType.Text
                                    }).bindProperty("bindingValue", {
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
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalowner") }),
                                    new sap.extension.m.UserInput("", {
                                        editable: false,
                                    }).bindProperty("bindingValue", {
                                        path: "/approvalOwner",
                                        type: new sap.extension.data.Numeric()
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalstatus") }),
                                    new sap.extension.m.EnumSelect("", {
                                        editable: false,
                                        enumType: ibas.emApprovalStatus,
                                    }).bindProperty("bindingValue", {
                                        path: "/approvalStatus",
                                        type: new sap.extension.data.ApprovalStatus(),
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_bokeys") }),
                                    new sap.extension.m.Input("", {
                                        showValueHelp: true,
                                        editable: false,
                                        type: sap.m.InputType.Text,
                                        valueHelpRequest(this: sap.m.Input): void {
                                            let data: any = (<any>this.getModel()).getData();
                                            if (data instanceof bo.ApprovalRequest) {
                                                if (!ibas.strings.isEmpty(data.boKeys)) {
                                                    let criteria: ibas.ICriteria = ibas.criterias.valueOf(data.boKeys);
                                                    if (!ibas.objects.isNull(criteria)) {
                                                        ibas.servicesManager.runLinkService({
                                                            boCode: criteria.businessObject,
                                                            linkValue: criteria
                                                        });
                                                    }
                                                }
                                            }
                                        },
                                    }).bindProperty("bindingValue", {
                                        path: "/boKeys",
                                        type: new sap.extension.data.Alphanumeric(),
                                        formatter(data: any): any {
                                            return ibas.businessobjects.describe(data);
                                        }
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_startedtime") }),
                                    new sap.extension.m.DatePicker("", {
                                        editable: false,
                                    }).bindProperty("bindingValue", {
                                        path: "/startedTime",
                                        type: new sap.extension.data.Date()
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_finishedtime") }),
                                    new sap.extension.m.DatePicker("", {
                                        editable: false,
                                    }).bindProperty("bindingValue", {
                                        path: "/finishedTime",
                                        type: new sap.extension.data.Date()
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_remarks") }),
                                    new sap.extension.m.TextArea("", {
                                        enabled: false,
                                        rows: 3,
                                    }).bindProperty("bindingValue", {
                                        path: "/remarks",
                                        type: new sap.extension.data.Alphanumeric()
                                    }),
                                ]
                            })
                        ]
                    }).setModel(new sap.extension.model.JSONModel(data)));
                    this.stepBar.addItem(new sap.m.IconTabSeparator(""));
                }
                /** 显示数据 */
                showApprovalRequestSteps(datas: bo.ApprovalRequestStep[]): void {
                    let that: this = this;
                    for (let data of datas) {
                        // 跳过跳过的
                        if (data.stepStatus === ibas.emApprovalStepStatus.SKIPPED) {
                            continue;
                        }
                        if (this.stepBar.getItems().length > 1) {
                            this.stepBar.addItem(new sap.m.IconTabSeparator("", {
                                icon: "sap-icon://step",
                            }));
                        }
                        this.stepBar.addItem(new sap.m.IconTabFilter("", {
                            key: String(data.lineId),
                            count: data.stepName,
                            icon: "sap-icon://customer-history",
                            design: sap.m.IconTabFilterDesign.Horizontal,
                            text: ibas.enums.describe(ibas.emApprovalStepStatus, data.stepStatus),
                            iconColor: {
                                path: "/stepStatus",
                                formatter(status: ibas.emApprovalStepStatus): sap.ui.core.IconColor {
                                    if (status === ibas.emApprovalStepStatus.APPROVED) {
                                        return sap.ui.core.IconColor.Positive;
                                    } else if (status === ibas.emApprovalStepStatus.PENDING) {
                                        return sap.ui.core.IconColor.Neutral;
                                    } else if (status === ibas.emApprovalStepStatus.PROCESSING) {
                                        return sap.ui.core.IconColor.Critical;
                                    } else if (status === ibas.emApprovalStepStatus.REJECTED) {
                                        return sap.ui.core.IconColor.Negative;
                                    } else if (status === ibas.emApprovalStepStatus.SKIPPED) {
                                        return sap.ui.core.IconColor.Default;
                                    }
                                    return sap.ui.core.IconColor.Default;
                                }
                            },
                            content: [
                                new sap.ui.layout.form.SimpleForm("", {
                                    editable: true,
                                    content: [
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_stepname") }),
                                        new sap.extension.m.Input("", {
                                            editable: false,
                                            type: sap.m.InputType.Text,
                                        }).bindProperty("bindingValue", {
                                            path: "/stepName",
                                            type: new sap.extension.data.Alphanumeric()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_stepowner") }),
                                        new sap.extension.m.UserInput("", {
                                            editable: false,
                                        }).bindProperty("bindingValue", {
                                            path: "/stepOwner",
                                            type: new sap.extension.data.Numeric()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_stepstatus") }),
                                        new sap.extension.m.EnumSelect("", {
                                            editable: false,
                                            enumType: ibas.emApprovalStepStatus,
                                        }).bindProperty("bindingValue", {
                                            path: "/stepStatus",
                                            type: new sap.extension.data.ApprovalStepStatus()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_startedtime") }),
                                        new sap.extension.m.DatePicker("", {
                                            editable: false,
                                        }).bindProperty("bindingValue", {
                                            path: "/startedTime",
                                            type: new sap.extension.data.Date()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_finishedtime") }),
                                        new sap.extension.m.DatePicker("", {
                                            editable: false,
                                        }).bindProperty("bindingValue", {
                                            path: "/finishedTime",
                                            type: new sap.extension.data.Date()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_judgment") }),
                                        new sap.extension.m.TextArea("", {
                                            editable: {
                                                path: "/stepStatus",
                                                formatter(data: any): boolean {
                                                    return data === ibas.emApprovalStepStatus.PROCESSING ? true : false;
                                                }
                                            },
                                            rows: 3,
                                        }).bindProperty("bindingValue", {
                                            path: "/judgment",
                                            type: new sap.extension.data.Alphanumeric()
                                        }),
                                        new sap.m.Label("", {}),
                                        new sap.m.VBox("", {
                                            fitContainer: true,
                                            items: [
                                                new sap.m.Toolbar("", {
                                                    style: sap.m.ToolbarStyle.Clear,
                                                    content: [
                                                        new sap.m.Button("", {
                                                            enabled: {
                                                                path: "/stepStatus",
                                                                formatter(data: any): boolean {
                                                                    return data === ibas.emApprovalStepStatus.PROCESSING
                                                                        || data === ibas.emApprovalStepStatus.APPROVED ? true : false;
                                                                }
                                                            },
                                                            width: "5rem",
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
                                                            enabled: {
                                                                path: "/stepStatus",
                                                                formatter(data: any): boolean {
                                                                    return data === ibas.emApprovalStepStatus.PROCESSING
                                                                        || data === ibas.emApprovalStepStatus.REJECTED ? true : false;
                                                                }
                                                            },
                                                            width: "5rem",
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
                                                            width: "10.5rem",
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
                                        }),
                                    ]
                                })
                            ]
                        }).setModel(new sap.extension.model.JSONModel(data)));
                        if (data.stepStatus === ibas.emApprovalStepStatus.PROCESSING && ibas.strings.isEmpty(this.stepBar.getSelectedKey())) {
                            this.stepBar.setSelectedKey(String(data.lineId));
                        }
                    }
                }
            }
        }
    }
}