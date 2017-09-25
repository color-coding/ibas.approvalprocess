import * as ibas from "ibas/index";
import { utils } from "openui5/typings/ibas.utils";
import { IApprovalProcessViewView } from "../../../bsapp/approvalprocess/index";
import * as bo from "../../../3rdparty/initialfantasy/index";
/**
 * 视图-Customer
 */
export class ApprovalProcessViewView extends ibas.BOViewView implements IApprovalProcessViewView {
      // detail页面控件
      private mainlayout: sap.ui.layout.VerticalLayout;
      private page: sap.m.Page;
      private form: sap.ui.layout.form.SimpleForm;
      private stepMizard: sap.m.Wizard;
      returnSteps(steps: bo.IApprovalRequestSteps): sap.m.Wizard {
            let myMizard: sap.m.Wizard = new sap.m.Wizard("", {
                  showNextButton: false,
                  height: "400px"
            });
            for (let i: number = 0; i < steps.length; i++) {
                  let stepContent: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
                        singleContainerFullSize: false,
                        adjustLabelSpan: false,
                        labelSpanL: 0,
                        labelSpanM: 0,
                        labelSpanS: 0,
                        columnsXL: 1,
                        columnsL: 1,
                        columnsM: 1,
                        columnsS: 1,
                        content: [
                              new sap.m.TextArea("", {
                                    editable: steps[i].stepStatus === ibas.emApprovalStepStatus.PROCESSING ? true : false,
                                    width: "100%",
                                    tooltip: ibas.i18n.prop("bo_approvalrequeststep_judgment"),
                              }).bindProperty("value", {
                                    path: "Judgment",
                              }),
                              new sap.m.Toolbar("", {
                                    content: [

                                          new sap.m.Button("", {
                                                enabled: steps[i].stepStatus === ibas.emApprovalStepStatus.PROCESSING ? false : true,
                                                width: "100%",
                                                text: ibas.i18n.prop("ui_bobs_but_reset"),
                                                press(oEvent: any): void {
                                                      // myView.onApprovalRequestStepEvent(this.getBindingContext().getObject(),
                                                      // apborep.data.emApprovalResult.Processing);
                                                }
                                          }),

                                          new sap.m.Button("", {
                                                enabled: steps[i].stepStatus === ibas.emApprovalStepStatus.PROCESSING ? true : false,
                                                width: "100%",
                                                text: ibas.i18n.prop("ui_bobs_but_approval"),
                                                press (oEvent: any):void {
                                                      // myView.onApprovalRequestStepEvent(this.getBindingContext().
                                                      // getObject(), apborep.data.emApprovalResult.Approved);
                                                }
                                          })
                                          ,
                                          new sap.m.Button("", {
                                                enabled: steps[i].stepStatus === ibas.emApprovalStepStatus.PROCESSING ? true : false,
                                                width: "100%",
                                                text: ibas.i18n.prop("ui_bobs_but_reject"),
                                                press (oEvent:any):void {
                                                      // myView.onApprovalRequestStepEvent(this.getBindingContext().
                                                      // getObject(), apborep.data.emApprovalResult.Rejected);
                                                }
                                          }),
                                    ]
                              }),
                        ]
                  });
                  let step: sap.m.WizardStep = new sap.m.WizardStep("", {
                        content: stepContent
                  });
                  step.bindProperty("title", {
                        path: "StepName",
                  });

                  let uiDatas: sap.ui.model.json.JSONModel = new sap.ui.model.json.JSONModel({ modelData: steps[i] });
                  // uiDatas.setData({ modelData: steps[i] });
                  step.setModel(uiDatas);
                  step.bindObject("/modelData");
                  // step.bindingStep = steps[i];
                  myMizard.addStep(step);
            }
            return myMizard;
      }
      /** 绘制视图 */
      darw(): any {
            let that: this = this;
            this.form = new sap.ui.layout.form.SimpleForm("", {
                  editable: false,
                  layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
                  singleContainerFullSize: false,
                  adjustLabelSpan: false,
                  labelSpanL: 2,
                  labelSpanM: 2,
                  labelSpanS: 12,
                  columnsXL: 2,
                  columnsL: 2,
                  columnsM: 1,
                  columnsS: 1,
                  content: [
                        new sap.ui.core.Title("", { text: ibas.i18n.prop("ui_title_approvalrequest_infor") }),
                        //  绘制视图
                        //   new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_name") }),
                        //   new sap.m.Text("", {
                        //   }).bindProperty("text", {
                        //   path: "/Name"
                        //  }),
                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalowner") }),
                        new sap.m.Text("", {

                        }).bindProperty("text", {
                              path: "/ApprovalOwner"
                        }),
                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvalstatus") }),
                        new sap.m.Text("", {
                        }).bindProperty("text", {
                              path: "/ApprovalStatus",
                              formatter(data: any): any {
                                    return ibas.enums.describe(ibas.emApprovalStatus, data);
                              }
                        }),
                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_approvaltemplate") }),
                        new sap.m.Text("", {
                        }).bindProperty("text", {
                              path: "/ApprovalTemplate"
                        }),
                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_objectkey") }),
                        new sap.m.Text("", {

                        }).bindProperty("text", {
                              path: "/ObjectKey"
                        }),
                        new sap.ui.core.Title("", { text: ibas.i18n.prop("ui_title_approvalrequest_orderinfor") }),
                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_bokeys") }),
                        new sap.m.Text("", {

                        }).bindProperty("text", {
                              path: "/BOKeys"
                        }),
                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_startedtime") }),
                        new sap.m.Text("", {

                        }).bindProperty("text", {
                              path: "/StartedTime",
                              type: new sap.ui.model.type.Date({
                                    pattern: "yyyy-MM-dd",
                                    strictParsing: true,
                              })
                        }),
                        new sap.m.Label("", { text: ibas.i18n.prop("bo_approvalrequest_finishedtime") }),
                        new sap.m.Text("", {

                        }).bindProperty("text", {
                              path: "/FinishedTime",
                              type: new sap.ui.model.type.Date({
                                    pattern: "yyyy-MM-dd",
                                    strictParsing: true,
                              })
                        }),
                  ]
            });
            this.mainlayout = new sap.ui.layout.VerticalLayout("", {
                  class: "sapUiContentPadding",
                  width: "100%",
                  content: [
                        this.form,
                        this.stepMizard
                  ]
            });
            this.page = new sap.m.Page("", {
                  showHeader: false,
                  subHeader: new sap.m.Bar("", {
                        contentLeft: [
                              new sap.m.Text("", {

                              }).bindProperty("text", {
                                    path: "/Name"
                              }),
                        ],
                        contentRight: [
                              new sap.m.Button("", {
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://action",
                                    press: function (event: any): void {
                                          that.fireViewEvents(that.callServicesEvent, {
                                                displayServices(services: ibas.IServiceAgent[]): void {
                                                      if (ibas.objects.isNull(services) || services.length === 0) {
                                                            return;
                                                      }
                                                      let popover: sap.m.Popover = new sap.m.Popover("", {
                                                            showHeader: false,
                                                            placement: sap.m.PlacementType.Bottom,
                                                      });
                                                      for (let service of services) {
                                                            popover.addContent(new sap.m.Button({
                                                                  text: ibas.i18n.prop(service.name),
                                                                  type: sap.m.ButtonType.Transparent,
                                                                  icon: service.icon,
                                                                  press: function (): void {
                                                                        service.run();
                                                                        popover.close();
                                                                  }
                                                            }));
                                                      }
                                                      (<any>popover).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
                                                      popover.openBy(event.getSource(), true);
                                                }
                                          });
                                    }
                              })
                        ]
                  }),
                  content: [this.mainlayout]
            });
            this.id = this.page.getId();
            return this.page;
      }

      /** 显示数据 */
      showApprovalRequest(data: bo.IApprovalRequest): void {
            this.page.setModel(new sap.ui.model.json.JSONModel(data));
            this.mainlayout.removeContent(this.stepMizard);
            this.stepMizard = this.returnSteps(data.approvalRequestSteps);
            this.mainlayout.addContent(this.stepMizard
            );
      }
}