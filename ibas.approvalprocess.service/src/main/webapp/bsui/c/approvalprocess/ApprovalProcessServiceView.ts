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
            const PLANTFORM: ibas.emPlantform = ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM);
            /**
             * 视图-审批流程
             */
            export class ApprovalProcessServiceView extends ibas.View implements app.IApprovalProcessServiceView {
                // 审批操作，参数1，审批请求；参数2，操作
                approvalEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    return this.page = new sap.extension.m.Page("", {
                        showHeader: false,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                            ]
                        }),
                        content: [
                            new sap.m.IconTabBar("", {
                                expandable: false,
                                content: [
                                ]
                            })
                        ]
                    });
                }
                private page: sap.m.Page;
                /** 显示数据 */
                showApprovalRequest(data: bo.ApprovalRequest): void {
                    let pageBar: sap.m.Toolbar = <sap.m.Toolbar>this.page.getSubHeader();
                    pageBar.destroyContent();
                    pageBar.addContent(new sap.m.Title("", {
                        text: ibas.i18n.prop("bo_approvalrequest"),
                        visible: PLANTFORM !== ibas.emPlantform.PHONE ? true : false,
                    }));
                    pageBar.addContent(new sap.extension.m.Text("", {
                        wrapping: false,
                        text: data.name,
                        visible: PLANTFORM !== ibas.emPlantform.PHONE ? true : false,
                    }));
                    pageBar.addContent(new sap.m.ToolbarSeparator("", {
                        visible: PLANTFORM !== ibas.emPlantform.PHONE ? true : false,
                    }));
                    pageBar.addContent(new sap.m.Title("", {
                        text: ibas.i18n.prop("bo_approvalrequest_bokeys"),
                        visible: PLANTFORM !== ibas.emPlantform.PHONE ? true : false,
                    }));
                    pageBar.addContent(new sap.extension.m.Text("", {
                        wrapping: false,
                        text: ibas.businessobjects.describe(data.boKeys)
                    }));
                    pageBar.addContent(new sap.extension.m.Text("", {
                        wrapping: false,
                    }).setText(data.summary));
                    pageBar.addContent(new sap.m.ToolbarSpacer(""));
                    pageBar.addContent(new sap.m.Button("", {
                        text: PLANTFORM !== ibas.emPlantform.PHONE ? ibas.i18n.prop("approvalprocess_view_data") : "",
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://detail-view",
                        press: function (): void {
                            let boKeys: string = data.boKeys;
                            if (!ibas.strings.isEmpty(boKeys)) {
                                let criteria: ibas.ICriteria = ibas.criterias.valueOf(boKeys);
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
                    }));
                    let tabBar: sap.m.IconTabBar = <sap.m.IconTabBar>this.page.getContent()[0];
                    tabBar.destroyItems();
                    let that: this = this;
                    let tabFilter: sap.m.IconTabFilter = new sap.m.IconTabFilter("", {
                        icon: "sap-icon://workflow-tasks",
                        design: sap.m.IconTabFilterDesign.Horizontal,
                        iconColor: sap.ui.core.IconColor.Default,
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
                                        path: "name",
                                        type: new sap.extension.data.Alphanumeric()
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalowner") }),
                                    new sap.extension.m.UserInput("", {
                                        editable: false,
                                    }).bindProperty("bindingValue", {
                                        path: "approvalOwner",
                                        type: new sap.extension.data.Numeric()
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalstatus") }),
                                    new sap.extension.m.EnumSelect("", {
                                        enumType: ibas.emApprovalStatus,
                                    }).bindProperty("bindingValue", {
                                        path: "approvalStatus",
                                        type: new sap.extension.data.ApprovalStatus(),
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_bokeys") }),
                                    new sap.extension.m.Input("", {
                                        editable: false,
                                        type: sap.m.InputType.Text,
                                    }).bindProperty("bindingValue", {
                                        path: "boKeys",
                                        formatter(data: any): any {
                                            return ibas.businessobjects.describe(data);
                                        }
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_startedtime") }),
                                    new sap.extension.m.DatePicker("", {
                                        editable: false,
                                    }).bindProperty("bindingValue", {
                                        path: "startedTime",
                                        type: new sap.extension.data.Date()
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_finishedtime") }),
                                    new sap.extension.m.DatePicker("", {
                                        editable: false,
                                    }).bindProperty("bindingValue", {
                                        path: "finishedTime",
                                        type: new sap.extension.data.Date()
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_remarks") }),
                                    new sap.extension.m.TextArea("", {
                                        enabled: false,
                                        rows: 3,
                                    }).bindProperty("bindingValue", {
                                        path: "remarks",
                                        type: new sap.extension.data.Alphanumeric()
                                    }),
                                ]
                            })
                        ]
                    });
                    tabFilter.setModel(new sap.extension.model.JSONModel(data));
                    tabFilter.bindObject("/");
                    tabBar.addItem(tabFilter);
                    tabBar.addItem(new sap.m.IconTabSeparator(""));
                }
                /** 显示数据 */
                showApprovalRequestSteps(datas: bo.ApprovalRequestStep[]): void {
                    let that: this = this;
                    let tabBar: sap.m.IconTabBar = <sap.m.IconTabBar>this.page.getContent()[0];
                    for (let data of datas) {
                        // 跳过跳过的
                        if (data.stepStatus === ibas.emApprovalStepStatus.SKIPPED) {
                            continue;
                        }
                        if (tabBar.getItems().length > 1) {
                            tabBar.addItem(new sap.m.IconTabSeparator("", {
                                icon: "sap-icon://step",
                            }));
                        }
                        let tabFilter: sap.m.IconTabFilter = new sap.m.IconTabFilter("", {
                            key: data.lineId,
                            icon: "sap-icon://customer-history",
                            design: sap.m.IconTabFilterDesign.Horizontal,
                            iconColor: this.toIconColor(data.stepStatus),
                            count: data.stepName,
                            text: ibas.enums.describe(ibas.emApprovalStepStatus, data.stepStatus),
                            content: [
                                new sap.ui.layout.form.SimpleForm("", {
                                    editable: true,
                                    content: [
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_stepname") }),
                                        new sap.extension.m.Input("", {
                                            editable: false,
                                            type: sap.m.InputType.Text,
                                            visible: PLANTFORM !== ibas.emPlantform.PHONE ? true : false,
                                        }).bindProperty("bindingValue", {
                                            path: "stepName",
                                            type: new sap.extension.data.Alphanumeric()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_stepowner") }),
                                        new sap.extension.m.UserInput("", {
                                            editable: false,
                                        }).bindProperty("bindingValue", {
                                            path: "stepOwner",
                                            type: new sap.extension.data.Numeric()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_stepstatus") }),
                                        new sap.extension.m.EnumSelect("", {
                                            enabled: false,
                                            enumType: ibas.emApprovalStepStatus,
                                            visible: PLANTFORM !== ibas.emPlantform.PHONE ? true : false,
                                        }).bindProperty("bindingValue", {
                                            path: "stepStatus",
                                            type: new sap.extension.data.ApprovalStepStatus()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_startedtime") }),
                                        new sap.extension.m.DatePicker("", {
                                            editable: false,
                                        }).bindProperty("bindingValue", {
                                            path: "startedTime",
                                            type: new sap.extension.data.Date()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_finishedtime") }),
                                        new sap.extension.m.DatePicker("", {
                                            editable: false,
                                        }).bindProperty("bindingValue", {
                                            path: "finishedTime",
                                            type: new sap.extension.data.Date()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_judgment") }),
                                        new sap.extension.m.TextArea("", {
                                            editable: {
                                                path: "stepStatus",
                                                formatter(data: any): boolean {
                                                    return data === ibas.emApprovalStepStatus.PROCESSING ? true : false;
                                                }
                                            },
                                            rows: 3,
                                        }).bindProperty("bindingValue", {
                                            path: "judgment",
                                            type: new sap.extension.data.Alphanumeric()
                                        }),
                                        new sap.m.Label("", {}),
                                        new sap.m.VBox("", {
                                            fitContainer: true,
                                            items: [
                                                new sap.m.Toolbar("", {
                                                    style: sap.m.ToolbarStyle.Clear,
                                                    content: [
                                                        new sap.m.ToolbarSpacer("", {
                                                            visible: PLANTFORM === ibas.emPlantform.PHONE ? true : false,
                                                        }),
                                                        new sap.m.Button("", {
                                                            enabled: {
                                                                path: "stepStatus",
                                                                formatter(data: any): boolean {
                                                                    return data === ibas.emApprovalStepStatus.PROCESSING
                                                                        || data === ibas.emApprovalStepStatus.APPROVED ? true : false;
                                                                }
                                                            },
                                                            width: "5rem",
                                                            type: sap.m.ButtonType.Accept,
                                                            text: {
                                                                path: "stepStatus",
                                                                formatter(data: any): string {
                                                                    if (data === ibas.emApprovalStepStatus.APPROVED) {
                                                                        return ibas.i18n.prop("approvalprocess_reset");
                                                                    }
                                                                    return ibas.i18n.prop("approvalprocess_approve");
                                                                }
                                                            },
                                                            press(this: sap.m.Button): void {
                                                                let data: any = this.getBindingContext().getObject();
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
                                                                path: "stepStatus",
                                                                formatter(data: any): boolean {
                                                                    return data === ibas.emApprovalStepStatus.PROCESSING
                                                                        || data === ibas.emApprovalStepStatus.REJECTED ? true : false;
                                                                }
                                                            },
                                                            width: "5rem",
                                                            type: sap.m.ButtonType.Reject,
                                                            text: {
                                                                path: "stepStatus",
                                                                formatter(data: any): string {
                                                                    if (data === ibas.emApprovalStepStatus.REJECTED) {
                                                                        return ibas.i18n.prop("approvalprocess_reset");
                                                                    }
                                                                    return ibas.i18n.prop("approvalprocess_reject");
                                                                }
                                                            },
                                                            press(this: sap.m.Button): void {
                                                                let data: any = this.getBindingContext().getObject();
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
                                                        new sap.m.ToolbarSpacer("", {
                                                            visible: PLANTFORM === ibas.emPlantform.PHONE ? true : false,
                                                        }),
                                                        new sap.m.Button("", {
                                                            width: "10.5rem",
                                                            enabled: {
                                                                path: "stepStatus",
                                                                formatter(data: any): boolean {
                                                                    return data === ibas.emApprovalStepStatus.PROCESSING ? true : false;
                                                                }
                                                            },
                                                            type: sap.m.ButtonType.Attention,
                                                            text: ibas.i18n.prop("approvalprocess_return"),
                                                            press: function (): void {
                                                                that.fireViewEvents(that.approvalEvent,
                                                                    this.getBindingContext().getObject(), ibas.emApprovalResult.RETURNED
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
                        });
                        tabFilter.setModel(new sap.extension.model.JSONModel(data));
                        tabFilter.bindObject("/");
                        tabBar.addItem(tabFilter);
                        if (data.stepStatus === ibas.emApprovalStepStatus.PROCESSING && ibas.strings.isEmpty(tabBar.getSelectedKey())) {
                            tabBar.setSelectedKey(tabFilter.getKey());
                        }
                    }
                }

                private toIconColor(status: ibas.emApprovalStepStatus): sap.ui.core.IconColor {
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
            }
        }
    }
}