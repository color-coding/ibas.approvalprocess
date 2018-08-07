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
                private page: sap.m.Page;
                private form: sap.ui.layout.form.SimpleForm;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.form = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("initialfantasy_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_name") }),
                            new sap.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "name",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalstatus") }),
                            new sap.m.Select("", {
                                enabled: false,
                                items: openui5.utils.createComboBoxItems(ibas.emApprovalStatus)
                            }).bindProperty("selectedKey", {
                                path: "approvalStatus",
                                type: "sap.ui.model.type.Integer"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalowner") }),
                            new sap.m.ex.DataOwnerInput("", {
                                editable: false,
                                bindingValue: {
                                    path: "approvalOwner"
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_bokeys") }),
                            new sap.m.Input("", {
                                valueHelpOnly: true,
                                type: sap.m.InputType.Text,
                                showValueHelp: true,
                                valueHelpRequest: function (oEvent: sap.ui.base.Event): void {
                                    let approvalRequest: bo.ApprovalRequest = this.getBindingContext().getObject();
                                    let boKeys: string = approvalRequest.boKeys;
                                    if (!ibas.strings.isEmpty(boKeys)) {
                                        boKeys = boKeys.replace(/{/g, "").replace(/}/g, "")
                                            .replace(/\[/g, "").replace(/\]/g, "");
                                        let splits: string[] = boKeys.split(".");
                                        if (splits.length === 2) {
                                            let boCode: string = splits[0];
                                            let value: string = splits[1];
                                            let criteria: ibas.Criteria = new ibas.Criteria();
                                            criteria.result = 1;
                                            for (let item of value.split("&")) {
                                                let tmps: string[] = item.split("=");
                                                if (tmps.length >= 2) {
                                                    let condition: ibas.ICondition = criteria.conditions.create();
                                                    condition.alias = tmps[0];
                                                    condition.value = tmps[1];
                                                }
                                            }
                                            ibas.servicesManager.runLinkService({
                                                boCode: boCode,
                                                linkValue: criteria
                                            });
                                        }
                                    }
                                }
                            }).bindProperty("value", {
                                path: "boKeys",
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("initialfantasy_title_others") }),
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
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_approvalrequeststep") })
                        ]
                    });
                    this.page = new sap.m.Page("", {
                        showHeader: false,
                        content: [this.form]
                    });
                    this.id = this.page.getId();
                    return this.page;
                }
                /** 显示数据 */
                showApprovalRequest(data: bo.ApprovalRequest): void {
                    this.form.setModel(new sap.ui.model.json.JSONModel(data));
                    this.form.bindObject("/");
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.form, data);
                }
                /** 显示数据 */
                showApprovalRequestSteps(datas: bo.ApprovalRequestStep[]): void {
                    let that: this = this;
                    let contents: sap.ui.core.Element[] = this.form.getContent();
                    if (contents.length > 0) {
                        let content: sap.ui.core.Element = contents[contents.length - 1];
                        if (content instanceof sap.m.Wizard) {
                            this.form.removeContent(content);
                        }
                    }
                    if (ibas.objects.isNull(datas) || datas.length === 0) {
                        return;
                    }
                    let wizardSteps: ibas.ArrayList<sap.m.WizardStep> = new ibas.ArrayList();
                    for (let data of datas) {
                        let enable: boolean = data.stepStatus === ibas.emApprovalStepStatus.PROCESSING;
                        let wizardStep: sap.m.WizardStep = new sap.m.WizardStep("", {
                            title: "{stepName}",
                            content: [
                                new sap.ui.layout.form.SimpleForm("", {
                                    editable: true,
                                    content: [
                                        new sap.m.Toolbar("", { visible: false }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequeststep_judgment") }),
                                        new sap.m.VBox("", {
                                            items: [
                                                new sap.m.TextArea("", {
                                                    width: "100%",
                                                    editable: true,
                                                }).bindProperty("value", {
                                                    path: "judgment"
                                                }),
                                                new sap.m.HBox("", {
                                                    items: [
                                                        new sap.m.Button("", {
                                                            enabled: !enable,
                                                            type: sap.m.ButtonType.Default,
                                                            text: ibas.i18n.prop("approvalprocess_reset"),
                                                            press: function (oEvent: sap.ui.base.Event): void {
                                                                that.fireViewEvents(that.approvalEvent,
                                                                    this.getBindingContext().getObject(),
                                                                    ibas.emApprovalResult.PROCESSING
                                                                );
                                                            },
                                                            layoutData: new sap.m.FlexItemData("", {
                                                                growFactor: 1,
                                                            })
                                                        }),
                                                        new sap.m.Button("", {
                                                            enabled: enable,
                                                            type: sap.m.ButtonType.Accept,
                                                            text: ibas.i18n.prop("approvalprocess_approve"),
                                                            press: function (oEvent: sap.ui.base.Event): void {
                                                                that.fireViewEvents(that.approvalEvent,
                                                                    this.getBindingContext().getObject(),
                                                                    ibas.emApprovalResult.APPROVED
                                                                );
                                                            },
                                                            layoutData: new sap.m.FlexItemData("", {
                                                                growFactor: 1,
                                                            })
                                                        }),
                                                        new sap.m.Button("", {
                                                            enabled: enable,
                                                            type: sap.m.ButtonType.Reject,
                                                            text: ibas.i18n.prop("approvalprocess_reject"),
                                                            press: function (oEvent: sap.ui.base.Event): void {
                                                                that.fireViewEvents(that.approvalEvent,
                                                                    this.getBindingContext().getObject(),
                                                                    ibas.emApprovalResult.REJECTED
                                                                );
                                                            },
                                                            layoutData: new sap.m.FlexItemData("", {
                                                                growFactor: 1,
                                                            })
                                                        }),
                                                    ]
                                                }),

                                            ]
                                        }),
                                        // new sap.m.Label("", { visible: false, text: "" }),
                                        new sap.m.Toolbar("", { visible: false }),
                                    ]
                                }),
                            ]
                        });
                        wizardStep.setModel(new sap.ui.model.json.JSONModel(data));
                        wizardStep.bindObject("/");
                        wizardSteps.add(wizardStep);
                    }
                    let wizard: sap.m.Wizard = new sap.m.Wizard("", {
                        showNextButton: false,
                        enableBranching: false,
                        width: "100%",
                        steps: wizardSteps
                    });
                    if (wizardSteps.length > 0) {
                        let wizardStep: sap.m.WizardStep = wizardSteps.lastOrDefault();
                        let onAfterRendering: Function = wizardStep.onAfterRendering;
                        wizardStep.onAfterRendering = function (...args: any[]): void {
                            onAfterRendering.apply(wizardStep, args);
                            for (let step of wizardSteps) {
                                let approvalRequestStep: bo.ApprovalRequestStep = step.getBindingContext().getObject();
                                if (!ibas.objects.isNull(approvalRequestStep)) {
                                    if (approvalRequestStep.stepStatus === ibas.emApprovalStepStatus.PROCESSING) {
                                        break;
                                    } else {
                                        wizard.nextStep();
                                    }
                                }
                            }
                        };
                    }
                    this.form.addContent(wizard);
                }
            }
        }
    }
}