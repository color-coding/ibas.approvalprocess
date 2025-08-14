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
             * 视图-ApprovalTemplate
             */
            export class ApprovalTemplateEditView extends ibas.BOEditView implements app.IApprovalTemplateEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 添加审批模板步骤事件 */
                addApprovalTemplateStepEvent: Function;
                /** 删除审批模板步骤事件 */
                removeApprovalTemplateStepEvent: Function;
                /** 编辑审批模板步骤条件事件 */
                editApprovalTemplateStepEvent: Function;
                /** 添加审批模板步骤条件事件 */
                addApprovalTemplateStepConditionEvent: Function;
                /** 删除审批模板步骤条件事件 */
                removeApprovalTemplateStepConditionEvent: Function;
                /** 选择业务对象类型 */
                chooseApprovalTemplateBOInformationEvent: Function;
                /** 选择业务对象属性 */
                chooseApprovalTemplateBOPropertyEvent: Function;
                /** 编辑审批模板步骤所有者事件 */
                editApprovalTemplateStepOwnersEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_name") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "name",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 30
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_approvalobjectcode") }),
                            new sap.extension.m.RepositoryInput("", {
                                showValueHelp: true,
                                repository: initialfantasy.bo.BORepositoryInitialFantasy,
                                dataInfo: {
                                    type: initialfantasy.bo.BOInformation,
                                    key: initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME,
                                    text: initialfantasy.bo.BOInformation.PROPERTY_DESCRIPTION_NAME
                                },
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseApprovalTemplateBOInformationEvent);
                                }
                            }).bindProperty("bindingValue", {
                                path: "approvalObjectCode",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 30
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_summary") }),
                            new sap.extension.m.TextArea("", {
                                rows: 4,
                            }).bindProperty("bindingValue", {
                                path: "summary",
                                type: new sap.extension.data.Alphanumeric()
                            }),
                            new sap.m.Label("", {}),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("approvalprocess_add_bo_property"),
                                press: function (): void {
                                    that.fireViewEvents(that.chooseApprovalTemplateBOPropertyEvent);
                                }
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_status") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_objectkey") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "objectKey",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_activated") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: ibas.emYesNo
                            }).bindProperty("bindingValue", {
                                path: "activated",
                                type: new sap.extension.data.YesNo()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_validdate") }),
                            new sap.extension.m.DatePicker("", {
                            }).bindProperty("bindingValue", {
                                path: "validDate",
                                type: new sap.extension.data.Date()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_invaliddate") }),
                            new sap.extension.m.DatePicker("", {
                            }).bindProperty("bindingValue", {
                                path: "invalidDate",
                                type: new sap.extension.data.Date()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_reentrant") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: ibas.emYesNo
                            }).bindProperty("bindingValue", {
                                path: "reentrant",
                                type: new sap.extension.data.YesNo(),
                            }),
                        ]
                    });
                    this.tableApprovalTemplateStep = new sap.extension.table.DataTable("", {
                        enableSelectAll: false,
                        visibleRowCount: sap.extension.table.visibleRowCount(8),
                        dataInfo: {
                            code: bo.ApprovalTemplate.BUSINESS_OBJECT_CODE,
                            name: bo.ApprovalTemplateStep.name
                        },
                        toolbar: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_add"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://add",
                                    press: function (): void {
                                        that.fireViewEvents(that.addApprovalTemplateStepEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_remove"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://less",
                                    press: function (): void {
                                        that.fireViewEvents(that.removeApprovalTemplateStepEvent, that.tableApprovalTemplateStep.getSelecteds());
                                    }
                                })
                            ]
                        }),
                        rows: "{/rows}",
                        rowActionCount: 1,
                        rowActionTemplate: new sap.ui.table.RowAction("", {
                            items: [
                                new sap.ui.table.RowActionItem("", {
                                    icon: "sap-icon://slim-arrow-right",
                                    press: function (oEvent: any): void {
                                        that.fireViewEvents(that.editApprovalTemplateStepEvent
                                            , this.getBindingContext().getObject()
                                        );
                                    },
                                }),
                            ]
                        }),
                        columns: [
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_steporder"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "stepOrder",
                                    type: new sap.extension.data.Numeric()
                                }),
                                width: "8rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_stepname"),
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
                                label: ibas.i18n.prop("bo_approvaltemplatestep_stepcanmodify"),
                                template: new sap.extension.m.EnumSelect("", {
                                    enumType: ibas.emYesNo
                                }).bindProperty("bindingValue", {
                                    path: "stepCanModify",
                                    type: new sap.extension.data.YesNo()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_approversrequired"),
                                template: new sap.extension.m.Input("", {
                                    type: sap.m.InputType.Number,
                                }).bindProperty("bindingValue", {
                                    path: "approversRequired",
                                    type: new sap.extension.data.Numeric(),
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_stepowner"),
                                template: new sap.extension.m.Input("", {
                                    showValueHelp: true,
                                    valueHelpIconSrc: "sap-icon://user-edit",
                                    valueHelpRequest: function (): void {
                                        that.fireViewEvents(that.editApprovalTemplateStepOwnersEvent, this.getBindingContext().getObject());
                                    },
                                }).bindProperty("bindingValue", {
                                    path: "approvalTemplateStepOwners",
                                    formatter(data: any): string {
                                        if (data instanceof Array && data.length > 0) {
                                            return ibas.i18n.prop("approvalprocess_step_owner_count", data.length);
                                        }
                                        return ibas.i18n.prop("approvalprocess_step_owner_none");
                                    }
                                }),
                                width: "14rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_remarks"),
                                template: new sap.extension.m.Input("", {
                                }).bindProperty("bindingValue", {
                                    path: "remarks",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "100%",
                            }),
                        ],
                        sortProperty: "stepOrder",
                        sortIntervalStep: 10,
                    });
                    this.tableApprovalTemplateStepCondition = new sap.extension.table.DataTable("", {
                        enableSelectAll: false,
                        visibleRowCount: sap.extension.table.visibleRowCount(8),
                        dataInfo: {
                            code: bo.ApprovalTemplate.BUSINESS_OBJECT_CODE,
                            name: bo.ApprovalTemplateStepCondition.name
                        },
                        toolbar: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_add"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://add",
                                    press: function (): void {
                                        that.fireViewEvents(that.addApprovalTemplateStepConditionEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_remove"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://less",
                                    press: function (): void {
                                        that.fireViewEvents(that.removeApprovalTemplateStepConditionEvent, that.tableApprovalTemplateStepCondition.getSelecteds());
                                    }
                                }),
                                new sap.m.ToolbarSpacer(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_back"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://nav-back",
                                    press: function (): void {
                                        that.fireViewEvents(that.editApprovalTemplateStepEvent);
                                    }
                                }),
                            ]
                        }),
                        rows: "{/rows}",
                        columns: [
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_relationship"),
                                template: new sap.extension.m.EnumSelect("", {
                                    enumType: initialfantasy.bo.emConditionRelationship
                                }).bindProperty("bindingValue", {
                                    path: "relationship",
                                    type: new sap.extension.data.Enum({
                                        enumType: initialfantasy.bo.emConditionRelationship
                                    })
                                })
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_bracketopen"),
                                template: new sap.extension.m.RepeatCharSelect("", {
                                    repeatText: "(",
                                    maxCount: 5,
                                }).bindProperty("bindingValue", {
                                    path: "bracketOpen",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_conditiontype"),
                                template: new sap.extension.m.EnumSelect("", {
                                    enumType: bo.emApprovalConditionType
                                }).bindProperty("bindingValue", {
                                    path: "conditionType",
                                    type: new sap.extension.data.Enum({
                                        enumType: bo.emApprovalConditionType
                                    })
                                })
                            }),
                            this.columnProperty = new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_propertyname"),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_operation"),
                                template: new sap.extension.m.EnumSelect("", {
                                    enumType: initialfantasy.bo.emConditionOperation
                                }).bindProperty("bindingValue", {
                                    path: "operation",
                                    type: new sap.extension.data.Enum({
                                        enumType: initialfantasy.bo.emConditionOperation
                                    })
                                })
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_conditionvalue"),
                                template: new sap.extension.m.Input("", {
                                }).bindProperty("bindingValue", {
                                    path: "conditionValue",
                                    type: new sap.extension.data.Alphanumeric({
                                        maxLength: 30
                                    })
                                })
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_bracketclose"),
                                template: new sap.extension.m.RepeatCharSelect("", {
                                    repeatText: ")",
                                    maxCount: 5,
                                }).bindProperty("bindingValue", {
                                    path: "bracketClose",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_remarks"),
                                template: new sap.extension.m.Input("", {
                                }).bindProperty("bindingValue", {
                                    path: "remarks",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "100%",
                            }),
                        ],
                        sortProperty: "visOrder",
                        sortIntervalStep: 1,
                    });
                    let formMiddle: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            this.tableTitle = new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_approvaltemplatestep") }),
                            this.container = new sap.m.NavContainer("", {
                                height: ibas.strings.format("{0}rem", sap.extension.table.visibleRowCount(8) * 3),
                                pages: [
                                    this.tableApprovalTemplateStep,
                                    this.tableApprovalTemplateStepCondition
                                ]
                            }),
                        ]
                    });
                    let formBottom: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_remarks") }),
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
                            code: bo.ApprovalTemplate.BUSINESS_OBJECT_CODE,
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
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent);
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.MenuButton("", {
                                    text: ibas.strings.format("{0}/{1}",
                                        ibas.i18n.prop("shell_data_new"), ibas.i18n.prop("shell_data_clone")),
                                    icon: "sap-icon://create",
                                    type: sap.m.ButtonType.Transparent,
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_new"),
                                                icon: "sap-icon://create",
                                                press: function (): void {
                                                    // 创建新的对象
                                                    that.fireViewEvents(that.createDataEvent, false);
                                                }
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_clone"),
                                                icon: "sap-icon://copy",
                                                press: function (): void {
                                                    // 复制当前对象
                                                    that.fireViewEvents(that.createDataEvent, true);
                                                }
                                            }),
                                        ],
                                    })
                                }),
                            ]
                        }),
                        content: [
                            formTop,
                            formMiddle,
                            formBottom,
                        ]
                    });
                }
                private page: sap.extension.m.Page;
                private tableApprovalTemplateStep: sap.extension.table.Table;
                private tableApprovalTemplateStepCondition: sap.extension.table.Table;
                private tableTitle: sap.ui.core.Title;
                private container: sap.m.NavContainer;
                private columnProperty: sap.extension.table.DataColumn;

                /** 显示数据 */
                showApprovalTemplate(data: bo.ApprovalTemplate): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    // 改变页面状态
                    sap.extension.pages.changeStatus(this.page);
                    // 加载可选项
                    let criteria: ibas.ICriteria = new ibas.Criteria();
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME;
                    condition.value = data.approvalObjectCode;
                    let boRepository: initialfantasy.bo.BORepositoryInitialFantasy = new initialfantasy.bo.BORepositoryInitialFantasy();
                    boRepository.fetchBOInformation({
                        criteria: criteria,
                        onCompleted: (opRslt) => {
                            // 属性选择
                            let propertySelect: sap.extension.m.Select = new sap.extension.m.Select("", {
                                width: "100%",
                                forceSelection: false,
                            }).bindProperty("bindingValue", {
                                path: "propertyName",
                                type: new sap.extension.data.Alphanumeric()
                            }).bindProperty("visible", {
                                path: "conditionType",
                                formatter(data: any): boolean {
                                    return data === bo.emApprovalConditionType.PROPERTY_VALUE ? true : false;
                                }
                            });
                            propertySelect.addItem(new sap.ui.core.ListItem("", {
                                key: "",
                                text: ibas.i18n.prop("shell_please_chooose_data", ""),
                            }));
                            for (let boItem of opRslt.resultObjects) {
                                for (let ptyItem of boItem.boPropertyInformations) {
                                    if (ptyItem.editSize < 0) {
                                        // 对象类型属性跳过
                                        continue;
                                    }
                                    propertySelect.addItem(new sap.ui.core.ListItem("", {
                                        key: ptyItem.mapped,
                                        text: ptyItem.description,
                                    }));
                                }
                            }
                            // 语句输入
                            let sqlsInput: sap.extension.m.Input = new sap.extension.m.Input("", {
                                width: "100%",
                                showValueHelp: true,
                                valueHelpOnly: false,
                                valueHelpRequest: function (event: sap.ui.base.Event): void {
                                    let source: any = event.getSource();
                                    if (!source) {
                                        return;
                                    }
                                    let data: bo.ApprovalTemplateStepCondition = source.getBindingContext().getObject();
                                    if (ibas.objects.isNull(data)) {
                                        return;
                                    }
                                    jQuery.sap.require("sap.ui.codeeditor.CodeEditor");
                                    let dialog: sap.m.Dialog = new sap.m.Dialog("", {
                                        title: ibas.i18n.prop("bo_approvaltemplatestepcondition_sqls") + ibas.i18n.prop("shell_data_edit"),
                                        type: sap.m.DialogType.Standard,
                                        state: sap.ui.core.ValueState.None,
                                        content: [
                                            new sap.ui.codeeditor.CodeEditor("", {
                                                height: ibas.strings.format("{0}px", window.innerHeight * 0.6),
                                                width: ibas.strings.format("{0}px", window.innerWidth * 0.6),
                                                type: "sql",
                                                colorTheme: "eclipse",
                                                value: {
                                                    path: "/propertyName",
                                                    type: new sap.extension.data.Unknown({
                                                        formatValue(oValue: any, sInternalType: string): any {
                                                            if (sInternalType === "string") {
                                                                return ibas.strings.valueOf(oValue);
                                                            }
                                                            return oValue;
                                                        },
                                                        parseValue(oValue: any, sInternalType: string): any {
                                                            if (sInternalType === "string") {
                                                                return ibas.strings.valueOf(oValue).replace(/\r\n/g, " ").replace(/\n/g, " ");
                                                            }
                                                            return oValue;
                                                        }
                                                    })
                                                }
                                            })
                                        ],
                                        buttons: [
                                            new sap.m.Button("", {
                                                text: ibas.i18n.prop("approvalprocess_code_pretty"),
                                                type: sap.m.ButtonType.Transparent,
                                                icon: "sap-icon://text-formatting",
                                                press: function (event: sap.ui.base.Event): void {
                                                    let content: any = dialog.getContent()[0];
                                                    if (content instanceof sap.ui.codeeditor.CodeEditor) {
                                                        content.prettyPrint();
                                                    }
                                                }
                                            }),
                                            new sap.m.Button("", {
                                                text: ibas.i18n.prop("shell_exit"),
                                                type: sap.m.ButtonType.Transparent,
                                                icon: "sap-icon://inspect-down",
                                                press: function (): void {
                                                    dialog.close();
                                                    dialog = null;
                                                }
                                            }),
                                        ]
                                    }).addStyleClass("sapUiNoContentPadding");
                                    dialog.setModel(new sap.extension.model.JSONModel(data));
                                    dialog.open();
                                    dialog.focus(undefined);
                                }
                            }).bindProperty("bindingValue", {
                                path: "propertyName",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 500
                                })
                            }).bindProperty("visible", {
                                path: "conditionType",
                                formatter(data: any): boolean {
                                    return data === bo.emApprovalConditionType.SQL_SCRIPT ? true : false;
                                }
                            });
                            this.columnProperty.setTemplate(new sap.m.FlexBox("", {
                                width: "auto",
                                fitContainer: true,
                                renderType: sap.m.FlexRendertype.Bare,
                                items: [
                                    propertySelect,
                                    sqlsInput,
                                ]
                            }));
                        }
                    });
                }
                /** 显示数据 */
                showApprovalTemplateSteps(datas: bo.ApprovalTemplateStep[]): void {
                    this.tableTitle.setText(ibas.i18n.prop("bo_approvaltemplatestep"));
                    this.container.backToTop();
                    this.tableApprovalTemplateStep.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
                /** 显示数据 */
                showApprovalTemplateStepConditions(datas: bo.ApprovalTemplateStepCondition[]): void {
                    this.tableTitle.setText(ibas.i18n.prop("bo_approvaltemplatestepcondition"));
                    this.container.to(this.tableApprovalTemplateStepCondition.getId());
                    this.tableApprovalTemplateStepCondition.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
            }

            /** 视图-编辑步骤所有者 */
            export class ApprovalTemplateStepOwnerEditView extends ibas.DialogView implements app.IApprovalTemplateStepOwnerEditView {
                /** 添加审批模板步骤所有者事件 */
                addApprovalTemplateStepOwnerEvent: Function;
                /** 删除审批模板步骤所有者事件 */
                removeApprovalTemplateStepOwnerEvent: Function;
                /** 审批步骤选择步骤所有者 */
                chooseApprovalTemplateStepUserEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.table = new sap.extension.table.DataTable("", {
                        enableSelectAll: false,
                        visibleRowCount: sap.extension.table.visibleRowCount(8),
                        dataInfo: {
                            code: bo.ApprovalTemplate.BUSINESS_OBJECT_CODE,
                            name: bo.ApprovalTemplateStepCondition.name
                        },
                        toolbar: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.MenuButton("", {
                                    text: ibas.i18n.prop("shell_data_add"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://add",
                                    menuPosition: sap.ui.core.Popup.Dock.EndBottom,
                                    useDefaultActionOnly: true,
                                    buttonMode: sap.m.MenuButtonMode.Split,
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("em_approvalstepownertype_user"),
                                                icon: "sap-icon://employee",
                                                press: function (): void {
                                                    that.fireViewEvents(that.addApprovalTemplateStepOwnerEvent, initialfantasy.bo.User.name);
                                                }
                                            }),
                                        ],
                                    }),
                                    defaultAction(): void {
                                        that.fireViewEvents(that.addApprovalTemplateStepOwnerEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_remove"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://less",
                                    press: function (): void {
                                        that.fireViewEvents(that.removeApprovalTemplateStepOwnerEvent, that.table.getSelecteds());
                                    }
                                }),
                            ]
                        }),
                        rows: "{/rows}",
                        columns: [
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepowner_visorder"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "visOrder",
                                    type: new sap.extension.data.Numeric(),
                                }),
                                width: "6rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepowner_stepownertype"),
                                template: new sap.extension.m.EnumSelect("", {
                                    enumType: bo.emApprovalStepOwnerType
                                }).bindProperty("bindingValue", {
                                    path: "stepOwnerType",
                                    type: new sap.extension.data.Enum({
                                        enumType: bo.emApprovalStepOwnerType
                                    })
                                }),
                                width: "14rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepowner_stepowner"),
                                template: new sap.extension.m.RepositoryInput("", {
                                    showValueHelp: true,
                                    repository: initialfantasy.bo.BORepositoryInitialFantasy,
                                    dataInfo: {
                                        type: initialfantasy.bo.User,
                                        key: initialfantasy.bo.User.PROPERTY_DOCENTRY_NAME,
                                        text: initialfantasy.bo.User.PROPERTY_NAME_NAME
                                    },
                                    valueHelpRequest: function (): void {
                                        that.fireViewEvents(that.chooseApprovalTemplateStepUserEvent,
                                            // 获取当前对象
                                            this.getBindingContext().getObject()
                                        );
                                    },
                                }).bindProperty("editable", {
                                    path: "stepOwnerType",
                                    formatter(data: any): any {
                                        if (data === bo.emApprovalStepOwnerType.USER) {
                                            return true;
                                        }
                                        return false;
                                    }
                                }).bindProperty("bindingValue", {
                                    path: "stepOwner",
                                    type: new sap.extension.data.Numeric()
                                }),
                                width: "12rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepowner_remarks"),
                                template: new sap.extension.m.Input("", {
                                }).bindProperty("bindingValue", {
                                    path: "remarks",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "100%",
                            }),
                        ],
                        sortProperty: "visOrder",
                        sortIntervalStep: 1,
                    });
                    return new sap.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretch: ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM) === ibas.emPlantform.PHONE ? true : false,
                        horizontalScrolling: true,
                        verticalScrolling: true,
                        contentWidth: "60%",
                        content: [
                            this.table
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                press(): void {
                                    that.fireViewEvents(that.closeEvent);
                                }
                            }),
                        ],
                    }).addStyleClass("sapUiNoContentPadding");
                }
                private table: sap.extension.table.Table;
                showApprovalTemplateStepOwners(datas: bo.ApprovalTemplateStepOwner[]): void {
                    this.table.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
            }
        }
    }
}