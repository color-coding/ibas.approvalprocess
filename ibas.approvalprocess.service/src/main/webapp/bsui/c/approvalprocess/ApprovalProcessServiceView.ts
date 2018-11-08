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
                    return this.page = new sap.m.Page("", {
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
                    pageBar.addContent(new sap.m.ToolbarSeparator(""));
                    pageBar.addContent(new sap.m.Title("", {
                        text: ibas.i18n.prop("bo_approvalrequest"),
                    }));
                    pageBar.addContent(new sap.m.Text("", {
                        wrapping: false,
                        text: data.name,
                    }));
                    pageBar.addContent(new sap.m.ToolbarSeparator(""));
                    pageBar.addContent(new sap.m.Title("", {
                        text: ibas.i18n.prop("bo_approvalrequest_bokeys"),
                    }));
                    pageBar.addContent(new sap.m.Text("", {
                        wrapping: false,
                        text: ibas.businessobjects.describe(data.boKeys)
                    }));
                    pageBar.addContent(new sap.m.ToolbarSpacer(""));
                    pageBar.addContent(new sap.m.Button("", {
                        text: ibas.i18n.prop("approvalprocess_view_data"),
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
                                    new sap.m.Input("", {
                                        editable: false,
                                        type: sap.m.InputType.Text
                                    }).bindProperty("value", {
                                        path: "name",
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalowner") }),
                                    new sap.m.ex.BOInput("", {
                                        editable: false,
                                        boText: "name",
                                        boKey: "docEntry",
                                        boCode: ibas.config.applyVariables(initialfantasy.bo.BO_CODE_USER),
                                        repositoryName: initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY,
                                        bindingValue: {
                                            path: "approvalOwner"
                                        }
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalstatus") }),
                                    new sap.m.Select("", {
                                        enabled: false,
                                        items: openui5.utils.createComboBoxItems(ibas.emApprovalStatus)
                                    }).bindProperty("selectedKey", {
                                        path: "approvalStatus",
                                        type: "sap.ui.model.type.Integer"
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_bokeys") }),
                                    new sap.m.Input("", {
                                        editable: false,
                                        type: sap.m.InputType.Text,
                                    }).bindProperty("value", {
                                        path: "boKeys",
                                        formatter(data: any): any {
                                            return ibas.businessobjects.describe(data);
                                        }
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_startedtime") }),
                                    new sap.m.DatePicker("", {
                                        editable: false,
                                        valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                        displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                    }).bindProperty("dateValue", {
                                        path: "startedTime",
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_finishedtime") }),
                                    new sap.m.DatePicker("", {
                                        editable: false,
                                        valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                        displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                    }).bindProperty("dateValue", {
                                        path: "finishedTime",
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_remarks") }),
                                    new sap.m.TextArea("", {
                                        enabled: false,
                                        rows: 3,
                                    }).bindProperty("value", {
                                        path: "remarks",
                                    }),
                                ]
                            })
                        ]
                    });
                    tabFilter.setModel(new sap.ui.model.json.JSONModel(data));
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
                        let enabled: boolean = data.stepStatus === ibas.emApprovalStepStatus.PROCESSING;
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
                                        new sap.m.Input("", {
                                            editable: false,
                                            type: sap.m.InputType.Text
                                        }).bindProperty("value", {
                                            path: "stepName",
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_stepowner") }),
                                        new sap.m.ex.BOInput("", {
                                            editable: false,
                                            boText: "name",
                                            boKey: "docEntry",
                                            boCode: ibas.config.applyVariables(initialfantasy.bo.BO_CODE_USER),
                                            repositoryName: initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY,
                                            bindingValue: {
                                                path: "stepOwner"
                                            }
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_stepstatus") }),
                                        new sap.m.Select("", {
                                            enabled: false,
                                            items: openui5.utils.createComboBoxItems(ibas.emApprovalStatus)
                                        }).bindProperty("selectedKey", {
                                            path: "steplStatus",
                                            type: "sap.ui.model.type.Integer"
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_startedtime") }),
                                        new sap.m.DatePicker("", {
                                            editable: false,
                                            valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                            displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                        }).bindProperty("dateValue", {
                                            path: "startedTime",
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_finishedtime") }),
                                        new sap.m.DatePicker("", {
                                            editable: false,
                                            valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                            displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                        }).bindProperty("dateValue", {
                                            path: "finishedTime",
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_judgment") }),
                                        new sap.m.TextArea("", {
                                            editable: enabled,
                                            rows: 3,
                                        }).bindProperty("value", {
                                            path: "judgment"
                                        }),
                                        new sap.m.Button("", {
                                            enabled: enabled,
                                            type: sap.m.ButtonType.Accept,
                                            text: ibas.i18n.prop("approvalprocess_approve"),
                                            press: function (): void {
                                                that.fireViewEvents(that.approvalEvent,
                                                    this.getBindingContext().getObject(), ibas.emApprovalResult.APPROVED
                                                );
                                            },
                                        }),
                                        new sap.m.Button("", {
                                            enabled: enabled,
                                            type: sap.m.ButtonType.Reject,
                                            text: ibas.i18n.prop("approvalprocess_reject"),
                                            press: function (): void {
                                                that.fireViewEvents(that.approvalEvent,
                                                    this.getBindingContext().getObject(), ibas.emApprovalResult.REJECTED
                                                );
                                            },
                                        }),
                                        new sap.m.Button("", {
                                            enabled: data.stepStatus === ibas.emApprovalStepStatus.PENDING ? false : !enabled,
                                            type: sap.m.ButtonType.Emphasized,
                                            text: ibas.i18n.prop("approvalprocess_reset"),
                                            press: function (): void {
                                                that.fireViewEvents(that.approvalEvent,
                                                    this.getBindingContext().getObject(), ibas.emApprovalResult.PROCESSING
                                                );
                                            },
                                        }),
                                    ]
                                })
                            ]
                        });
                        tabFilter.setModel(new sap.ui.model.json.JSONModel(data));
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