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
             * 视图-ApprovalRequest
             */
            export class ApprovalRequestEditView extends ibas.BOEditView implements app.IApprovalRequestEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 添加审批请求步骤事件 */
                addApprovalRequestStepEvent: Function;
                /** 删除审批请求步骤事件 */
                removeApprovalRequestStepEvent: Function;
                /** 选择审批步骤所有者 */
                chooseApprovalRequestStepOwnerEvent: Function;

                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.form = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_general") }),
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
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_bokeys") }),
                            new sap.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "boKeys",
                                formatter(data: any): any {
                                    return ibas.businessobjects.describe(data);
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_remarks") }),
                            new sap.m.TextArea("", {
                                rows: 3,
                            }).bindProperty("value", {
                                path: "remarks",
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalstatus") }),
                            new sap.m.Select("", {
                                enabled: false,
                                items: openui5.utils.createComboBoxItems(ibas.emApprovalStatus)
                            }).bindProperty("selectedKey", {
                                path: "approvalStatus",
                                type: "sap.ui.model.type.Integer"
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
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvaltemplate") }),
                            new sap.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "approvalTemplate",
                            }),
                        ]
                    });
                    this.form.addContent(new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_approvalrequeststep") }));
                    this.tableApprovalRequestStep = new sap.ui.table.Table("", {
                        toolbar: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_add"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://add",
                                    press: function (): void {
                                        that.fireViewEvents(that.addApprovalRequestStepEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_remove"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://less",
                                    press: function (): void {
                                        that.fireViewEvents(that.removeApprovalRequestStepEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.ApprovalRequestStep>(that.tableApprovalRequestStep)
                                        );
                                    }
                                })
                            ]
                        }),
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 10),
                        rows: "{/rows}",
                        columns: [
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvalrequeststep_lineid"),
                                template: new sap.m.Text("", {
                                    width: "100%",
                                }).bindProperty("text", {
                                    path: "lineId"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvalrequeststep_stepowner"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    showValueHelp: true,
                                    valueHelpRequest: function (): void {
                                        that.fireViewEvents(that.chooseApprovalRequestStepOwnerEvent,
                                            // 获取当前对象
                                            this.getBindingContext().getObject()
                                        );
                                    },
                                }).bindProperty("value", {
                                    path: "stepOwner",
                                }),
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvalrequeststep_stepname"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    type: sap.m.InputType.Text
                                }).bindProperty("value", {
                                    path: "stepName"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvalrequeststep_stepstatus"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    enabled: false,
                                    items: openui5.utils.createComboBoxItems(ibas.emApprovalStepStatus)
                                }).bindProperty("selectedKey", {
                                    path: "stepStatus",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvalrequeststep_judgment"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    editable: false,
                                }).bindProperty("value", {
                                    path: "judgment"
                                })
                            }),
                        ]
                    });
                    this.form.addContent(this.tableApprovalRequestStep);
                    this.page = new sap.m.Page("", {
                        showHeader: false,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_save"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://save",
                                    press: function (): void {
                                        that.fireViewEvents(that.saveDataEvent);
                                    }
                                }),
                                /*
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent);
                                    }
                                }),
                                */
                            ]
                        }),
                        content: [this.form]
                    });
                    this.id = this.page.getId();
                    return this.page;
                }
                private page: sap.m.Page;
                private form: sap.ui.layout.form.SimpleForm;
                /** 改变视图状态 */
                private changeViewStatus(data: bo.ApprovalRequest): void {
                    if (ibas.objects.isNull(data)) {
                        return;
                    }
                    // 新建时：禁用删除，
                    if (data.isNew) {
                        if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                            openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                        }
                    }
                    // 不可编辑：已批准，
                    if (data.approvalStatus === ibas.emApprovalStatus.APPROVED) {
                        if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                            openui5.utils.changeToolbarSavable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                            openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                        }
                        openui5.utils.changeFormEditable(this.form, false);
                    }
                }
                private tableApprovalRequestStep: sap.ui.table.Table;

                /** 显示数据 */
                showApprovalRequest(data: bo.ApprovalRequest): void {
                    this.form.setModel(new sap.ui.model.json.JSONModel(data));
                    this.form.bindObject("/");
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.form, data);
                    // 改变视图状态
                    this.changeViewStatus(data);
                }
                /** 显示数据 */
                showApprovalRequestSteps(datas: bo.ApprovalRequestStep[]): void {
                    this.tableApprovalRequestStep.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.tableApprovalRequestStep, datas);
                }
            }
        }
    }
}