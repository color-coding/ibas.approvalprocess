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
                /** 审批步骤选择步骤所有者 */
                chooseApprovalTemplateStepUserEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.form = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_name") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/name",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_approvalobjectcode") }),
                            new sap.m.Input("", {
                                showValueHelp: true,
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseApprovalTemplateBOInformationEvent);
                                }
                            }).bindProperty("value", {
                                path: "/approvalObjectCode",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_activated") }),
                            new sap.m.Select("", {
                                items: openui5.utils.createComboBoxItems(ibas.emYesNo)
                            }).bindProperty("selectedKey", {
                                path: "/activated",
                                type: "sap.ui.model.type.Integer"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_validdate") }),
                            new sap.m.DatePicker("", {
                                valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                            }).bindProperty("dateValue", {
                                path: "/validDate"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_invaliddate") }),
                            new sap.m.DatePicker("", {
                                valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                            }).bindProperty("dateValue", {
                                path: "/invalidDate"
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("approvalprocess_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_objectkey") }),
                            new sap.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/objectKey",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvaltemplate_objectcode") }),
                            new sap.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/objectCode",
                            }),
                        ]
                    });
                    this.tableTitle = new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_approvaltemplatestep") });
                    this.form.addContent(this.tableTitle);
                    this.tableApprovalTemplateStep = new sap.ui.table.Table("", {
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
                                        that.fireViewEvents(that.removeApprovalTemplateStepEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.ApprovalTemplateStep>(that.tableApprovalTemplateStep)
                                        );
                                    }
                                })
                            ]
                        }),
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 10),
                        rows: "{/rows}",
                        rowActionCount: 1,
                        rowActionTemplate: new sap.ui.table.RowAction({
                            items: [
                                new sap.ui.table.RowActionItem({
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
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_steporder"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    type: sap.m.InputType.Number
                                }).bindProperty("value", {
                                    path: "stepOrder",
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_stepownertype"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: openui5.utils.createComboBoxItems(bo.emApprovalStepOwnerType)
                                }).bindProperty("selectedKey", {
                                    path: "stepOwnerType",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_stepowner"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    showValueHelp: true,
                                    valueHelpRequest: function (): void {
                                        that.fireViewEvents(that.chooseApprovalTemplateStepUserEvent,
                                            // 获取当前对象
                                            this.getBindingContext().getObject()
                                        );
                                    },
                                }).bindProperty("value", {
                                    path: "stepOwner",
                                }),
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_stepname"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    type: sap.m.InputType.Text
                                }).bindProperty("value", {
                                    path: "stepName",
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_stepcanmodify"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: openui5.utils.createComboBoxItems(ibas.emYesNo)
                                }).bindProperty("selectedKey", {
                                    path: "stepCanModify",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                        ]
                    });
                    let columnProperty: sap.ui.table.Column = new sap.ui.table.Column("", {
                        label: ibas.i18n.prop("bo_approvaltemplatestepcondition_propertyname"),
                        template: that.propertySelect = new sap.m.ex.BOChildSelect("", {
                            blank: true,
                            width: "100%",
                            boKey: "mapped",
                            boText: "description",
                            boCode: ibas.config.applyVariables(initialfantasy.bo.BO_CODE_BOINFORMATION),
                            repositoryName: initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY,
                            childPropertyName: "boPropertyInformations",
                            bindingValue: {
                                path: "propertyName"
                            },
                            onLoadItemsCompleted: function (oEvent: any): void {
                                columnProperty.setTemplate(that.propertySelect);
                            }
                        })
                    });
                    this.tableApprovalTemplateStepCondition = new sap.ui.table.Table("", {
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
                                        that.fireViewEvents(that.removeApprovalTemplateStepConditionEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.ApprovalTemplateStepCondition>(that.tableApprovalTemplateStepCondition)
                                        );
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
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 10),
                        rows: "{/rows}",
                        columns: [
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_relationship"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: openui5.utils.createComboBoxItems(ibas.emConditionRelationship)
                                }).bindProperty("selectedKey", {
                                    path: "relationship",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_bracketopen"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: this.getCharListItem("(")
                                }).bindProperty("selectedKey", {
                                    path: "bracketOpen",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_conditiontype"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: openui5.utils.createComboBoxItems(bo.emApprovalConditionType)
                                }).bindProperty("selectedKey", {
                                    path: "conditionType",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            columnProperty,
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_operation"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: openui5.utils.createComboBoxItems(ibas.emConditionOperation)
                                }).bindProperty("selectedKey", {
                                    path: "operation",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_conditionvalue"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    type: sap.m.InputType.Text
                                }).bindProperty("value", {
                                    path: "conditionValue",
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestepcondition_bracketclose"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: this.getCharListItem(")")
                                }).bindProperty("selectedKey", {
                                    path: "bracketClose",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                        ]
                    });

                    this.splitContainer = new sap.m.SplitContainer("", {
                        mode: sap.m.SplitAppMode.HideMode,
                        detailPages: [
                            this.tableApprovalTemplateStep,
                            this.tableApprovalTemplateStepCondition
                        ]
                    });
                    this.form.addContent(this.splitContainer);
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
                            this.form
                        ]
                    });
                    this.id = this.page.getId();
                    return this.page;
                }
                private page: sap.m.Page;
                private form: sap.ui.layout.form.SimpleForm;
                /** 改变视图状态 */
                private changeViewStatus(data: bo.ApprovalTemplate): void {
                    if (ibas.objects.isNull(data)) {
                        return;
                    }
                    // 新建时：禁用删除，
                    if (data.isNew) {
                        if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                            openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                        }
                    }
                }
                private tableTitle: sap.ui.core.Title;
                private splitContainer: sap.m.SplitContainer;
                private tableApprovalTemplateStep: sap.ui.table.Table;
                private tableApprovalTemplateStepCondition: sap.ui.table.Table;
                private propertySelect: sap.m.ex.BOChildSelect;

                protected getPropertyListItem(properies: initialfantasy.bo.IBOPropertyInformation[]): sap.ui.core.ListItem[] {
                    let items: Array<sap.ui.core.ListItem> = [];
                    items.push(new sap.ui.core.ListItem("", {
                        key: "",
                        text: ibas.i18n.prop("shell_please_chooose_data", ""),
                    }));
                    if (!ibas.objects.isNull(properies)) {
                        for (let property of properies) {
                            items.push(new sap.ui.core.ListItem("", {
                                key: property.property,
                                text: property.description,
                            }));
                        }
                    }
                    return items;
                }
                /** 获取重复的字符 */
                private getCharListItem(char: string): sap.ui.core.ListItem[] {
                    // 获取重复的字符
                    let count: number = 4;
                    let items: Array<sap.ui.core.ListItem> = [];
                    items.push(new sap.ui.core.ListItem("", {
                        key: 0,
                        text: "",
                    }));
                    let vChar: string = char;
                    for (let i: number = 1; i < count; i++) {
                        items.push(new sap.ui.core.ListItem("", {
                            key: i,
                            text: vChar,
                        }));
                        vChar = vChar + char;
                    }
                    return items;
                }
                /** 显示数据 */
                showApprovalTemplate(data: bo.ApprovalTemplate): void {
                    this.form.setModel(new sap.ui.model.json.JSONModel(data));
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.form, data);
                    // 改变视图状态
                    this.changeViewStatus(data);
                    this.propertySelect.setCriteria([
                        new ibas.Condition("Code", ibas.emConditionOperation.EQUAL, data.approvalObjectCode)
                    ]);
                }
                /** 显示数据 */
                showApprovalTemplateSteps(datas: bo.ApprovalTemplateStep[]): void {
                    this.tableTitle.setText(ibas.i18n.prop("bo_approvaltemplatestep"));
                    this.splitContainer.backToTopDetail(null, null);
                    this.tableApprovalTemplateStep.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.tableApprovalTemplateStep, datas);
                }
                /** 显示数据 */
                showApprovalTemplateStepConditions(datas: bo.ApprovalTemplateStepCondition[]): void {
                    this.tableTitle.setText(ibas.i18n.prop("bo_approvaltemplatestepcondition"));
                    this.splitContainer.toDetail(this.tableApprovalTemplateStepCondition.getId(), null, null, null);
                    this.tableApprovalTemplateStepCondition.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.tableApprovalTemplateStepCondition, datas);
                }
            }
        }
    }
}