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
                            new sap.ui.core.Title("", {}),
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
                                template: new sap.extension.m.Input("", {
                                    type: sap.m.InputType.Number
                                }).bindProperty("bindingValue", {
                                    path: "stepOrder",
                                    type: new sap.extension.data.Numeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_stepownertype"),
                                template: new sap.extension.m.EnumSelect("", {
                                    enumType: bo.emApprovalStepOwnerType
                                }).bindProperty("bindingValue", {
                                    path: "stepOwnerType",
                                    type: new sap.extension.data.Enum({
                                        enumType: bo.emApprovalStepOwnerType
                                    })
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvaltemplatestep_stepowner"),
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
                                        if (data === bo.emApprovalStepOwnerType.DATA_OWNER) {
                                            return false;
                                        } else if (data === bo.emApprovalStepOwnerType.PROJECT_MANAGER) {
                                            return false;
                                        }
                                        return true;
                                    }
                                }).bindProperty("bindingValue", {
                                    path: "stepOwner",
                                    type: new sap.extension.data.Numeric()
                                }),
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
                        ]
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
                                template: new sap.extension.m.Select("", {
                                    items: this.getCharListItem("(")
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
                                template: new sap.extension.m.Select("", {
                                }).bindProperty("bindingValue", {
                                    path: "propertyName",
                                    type: new sap.extension.data.Alphanumeric()
                                })
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
                                template: new sap.extension.m.Select("", {
                                    items: this.getCharListItem(")")
                                }).bindProperty("bindingValue", {
                                    path: "bracketClose",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                        ]
                    });
                    let formMiddle: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            this.tableTitle = new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_approvaltemplatestep") }),
                            this.splitContainer = new sap.m.SplitContainer("", {
                                mode: sap.m.SplitAppMode.HideMode,
                                detailPages: [
                                    this.tableApprovalTemplateStep,
                                    this.tableApprovalTemplateStepCondition
                                ]
                            }),
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
                        ]
                    });
                }
                private page: sap.extension.m.Page;
                private tableApprovalTemplateStep: sap.extension.table.Table;
                private tableApprovalTemplateStepCondition: sap.extension.table.Table;
                private tableTitle: sap.ui.core.Title;
                private splitContainer: sap.m.SplitContainer;
                private columnProperty: sap.extension.table.DataColumn;

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
                            let template: sap.extension.m.Select = new sap.extension.m.Select("", {
                                items: [
                                    new sap.ui.core.ListItem("", {
                                        key: "",
                                        text: ibas.i18n.prop("shell_please_chooose_data", ""),
                                    })
                                ]
                            }).bindProperty("bindingValue", {
                                path: "propertyName",
                                type: new sap.extension.data.Alphanumeric()
                            });
                            let boInfo: initialfantasy.bo.IBOInformation = opRslt.resultObjects.firstOrDefault();
                            if (boInfo && boInfo.boPropertyInformations instanceof Array) {
                                for (let property of boInfo.boPropertyInformations) {
                                    if (property.editSize < 0) {
                                        // 对象类型属性跳过
                                        continue;
                                    }
                                    template.addItem(new sap.ui.core.ListItem("", {
                                        key: property.mapped,
                                        text: property.description,
                                    }));
                                }
                            }
                            this.columnProperty.setTemplate(template);
                        }
                    });
                }
                /** 显示数据 */
                showApprovalTemplateSteps(datas: bo.ApprovalTemplateStep[]): void {
                    this.tableTitle.setText(ibas.i18n.prop("bo_approvaltemplatestep"));
                    this.splitContainer.backToTopDetail(null, null);
                    this.tableApprovalTemplateStep.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
                /** 显示数据 */
                showApprovalTemplateStepConditions(datas: bo.ApprovalTemplateStepCondition[]): void {
                    this.tableTitle.setText(ibas.i18n.prop("bo_approvaltemplatestepcondition"));
                    this.splitContainer.toDetail(this.tableApprovalTemplateStepCondition.getId(), null, null, null);
                    this.tableApprovalTemplateStepCondition.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
            }
        }
    }
}