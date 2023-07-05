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
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_name") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "name",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalowner") }),
                            new sap.extension.m.UserInput("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "approvalOwner",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_bokeys") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "boKeys",
                                formatter(data: any): any {
                                    return ibas.businessobjects.describe(data);
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_summary") }),
                            new sap.extension.m.TextArea("", {
                                rows: 3,
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "summary",
                                type: new sap.extension.data.Alphanumeric()
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_objectkey") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "objectKey",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalstatus") }),
                            new sap.extension.m.EnumSelect("", {
                                editable: false,
                                enumType: ibas.emApprovalStatus
                            }).bindProperty("bindingValue", {
                                path: "approvalStatus",
                                type: new sap.extension.data.ApprovalStatus()
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
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvaltemplate") }),
                            new sap.extension.m.RepositoryInput("", {
                                editable: false,
                                type: sap.m.InputType.Text,
                                repository: bo.BORepositoryApprovalProcess,
                                dataInfo: {
                                    type: bo.ApprovalTemplate,
                                    key: bo.ApprovalTemplate.PROPERTY_OBJECTKEY_NAME,
                                    text: bo.ApprovalTemplate.PROPERTY_NAME_NAME
                                },
                            }).bindProperty("bindingValue", {
                                path: "approvalTemplate",
                                type: new sap.extension.data.Numeric()
                            }),
                        ]
                    });
                    let formApprovalRequestStep: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_approvalrequeststep") }),
                            this.tableApprovalRequestStep = new sap.extension.table.DataTreeTable("", {
                                enableSelectAll: false,
                                visibleRowCount: sap.extension.table.visibleRowCount(8),
                                dataInfo: {
                                    code: bo.ApprovalRequest.BUSINESS_OBJECT_CODE,
                                    name: bo.ApprovalRequestStep.name
                                },
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
                                                that.fireViewEvents(that.removeApprovalRequestStepEvent, that.tableApprovalRequestStep.getSelecteds());
                                            }
                                        })
                                    ]
                                }),
                                rows: {
                                    path: "/rows",
                                    parameters: {
                                        arrayNames: [
                                            "approvalRequestSubSteps"
                                        ]
                                    }
                                },
                                columns: [
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_approvalrequeststep_lineid"),
                                        template: new sap.extension.m.Text("", {
                                        }).bindProperty("bindingValue", {
                                            path: "lineId",
                                            type: new sap.extension.data.Numeric()
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_approvalrequeststep_stepname"),
                                        template: new sap.extension.m.Input("", {
                                        }).bindProperty("bindingValue", {
                                            path: "stepName",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 30
                                            })
                                        }),
                                        width: "16rem",
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_approvalrequeststep_stepstatus"),
                                        template: new sap.extension.m.EnumSelect("", {
                                            enumType: ibas.emApprovalStepStatus,
                                        }).bindProperty("bindingValue", {
                                            path: "stepStatus",
                                            type: new sap.extension.data.ApprovalStepStatus(),
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_approvalrequeststep_stepowner"),
                                        template: new sap.extension.m.RepositoryInput("", {
                                            showValueHelp: true,
                                            showValueLink: false,
                                            repository: initialfantasy.bo.BORepositoryInitialFantasy,
                                            dataInfo: {
                                                type: initialfantasy.bo.User,
                                                key: initialfantasy.bo.User.PROPERTY_DOCENTRY_NAME,
                                                text: initialfantasy.bo.User.PROPERTY_NAME_NAME
                                            },
                                            valueHelpRequest: function (): void {
                                                that.fireViewEvents(that.chooseApprovalRequestStepOwnerEvent,
                                                    // 获取当前对象
                                                    this.getBindingContext().getObject()
                                                );
                                            },
                                            editable: {
                                                path: "approvalRequestSubSteps",
                                                formatter(stepItems: bo.IApprovalRequestSteps): boolean {
                                                    return stepItems?.length > 0 ? false : true;
                                                }
                                            }
                                        }).bindProperty("bindingValue", {
                                            path: "stepOwner",
                                            type: new sap.extension.data.Numeric(),
                                        }),
                                        width: "100%",
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_approvalrequeststep_judgment"),
                                        template: new sap.extension.m.Input("", {
                                        }).bindProperty("bindingValue", {
                                            path: "judgment",
                                            type: new sap.extension.data.Alphanumeric()
                                        }),
                                        width: "16rem",
                                    }),
                                ]
                            }),
                        ]
                    });
                    let formBottom: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_remarks") }),
                            new sap.extension.m.TextArea("", {
                                rows: 3,
                            }).bindProperty("bindingValue", {
                                path: "remarks",
                                type: new sap.extension.data.Alphanumeric()
                            }),
                            new sap.ui.core.Title("", {}),
                        ]
                    });
                    return this.page = new sap.extension.m.DataPage("", {
                        showHeader: false,
                        dataInfo: {
                            code: bo.ApprovalRequest.BUSINESS_OBJECT_CODE,
                        },
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
                                new sap.m.ToolbarSpacer(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("approvalprocess_view_data"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://detail-view",
                                    press: function (): void {
                                        let model: any = that.page.getModel();
                                        if (model instanceof sap.extension.model.JSONModel) {
                                            let data: any = model.getData();
                                            if (data instanceof bo.ApprovalRequest) {
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
                                        }
                                    }
                                })
                            ]
                        }),
                        content: [
                            formTop,
                            formApprovalRequestStep,
                            formBottom,
                        ]
                    });
                }
                private page: sap.extension.m.Page;
                private tableApprovalRequestStep: sap.extension.table.DataTreeTable;

                /** 显示数据 */
                showApprovalRequest(data: bo.ApprovalRequest): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    // 改变页面状态
                    sap.extension.pages.changeStatus(this.page);
                }
                /** 显示数据 */
                showApprovalRequestSteps(datas: bo.ApprovalRequestStep[]): void {
                    this.tableApprovalRequestStep.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
            }
        }
    }
}