/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { utils } from "openui5/typings/ibas.utils";
import { IApprovalProcessView } from "../../../bsapp/approvalprocess/index";
import * as bo from "../../../3rdparty/initialfantasy/index";
/**
 * 视图-审批流程
 */
export class ApprovalProcessView extends ibas.BOResidentView implements IApprovalProcessView {
    /** 绘制工具条视图 */
    darwBar(): any {
        let that: this = this;
        // 不重复创建工具条钮
        if (ibas.objects.isNull(this.bar)) {
            this.bar = new sap.m.Button("", {
                icon: "sap-icon://bell",
                type: sap.m.ButtonType.Transparent,
                press: function (): void {

                    if (that.isDisplayed) {
                        that.list = null;
                        that.fireViewEvents(that.showFullViewEvent);
                    } else {
                        that.fireViewEvents(that.showFullViewEvent);
                    }
                }
            });
        }
        return this.bar;
    }
    // list页控件
    // 分页查询条件
    private lastCriteria: ibas.ICriteria;
    private bar: sap.m.Button;
    /** 激活完整视图事件 */
    private list: sap.m.List;
    private notificationListGroupTemplate: sap.m.NotificationListGroup;
    private notificationListItemTemplate: sap.m.NotificationListItem;

    // private stepsWizard: sap.m.Wizard;
    // 页面事件
    showFullViewEvent: Function;
    fetchApprovalRequestEvent: Function;
    showApprovalRequestDetailEvent: Function;
    showApprovalRequestListEvent: Function;
    /** 绘制视图 */
    darw(): any {
        let that: this = this;
        this.list = new sap.m.List("", {
            growing: false,
            class: "sapContrast sapContrastPlus",
            growingThreshold: 3,
            growingScrollToLoad: false,
        });

        this.notificationListItemTemplate = new sap.m.NotificationListItem("", {
            title: "{Name}",
            description: "",
            showCloseButton: false,
            authorPicture: "sap-icon://person-placeholder",
            authorName: "{ApprovalOwner}",
            buttons: [
                new sap.m.Button("", {
                    text: ibas.i18n.prop("ui_bobs_but_detail"),
                    type: sap.m.ButtonType.Default,
                    press(evt: any): void {

                        that.fireViewEvents(that.showApprovalRequestDetailEvent, this.getBindingContext().getObject());
                        that.fireViewEvents(that.showFullViewEvent);
                    }
                }),
                new sap.m.Button("", {
                    text: ibas.i18n.prop("ui_bobs_but_approval"),
                    type: sap.m.ButtonType.Accept,
                    press: function (evt: any): void {
                        //
                    }
                }),
                new sap.m.Button("", {
                    text: ibas.i18n.prop("ui_bobs_but_reject"),
                    type: sap.m.ButtonType.Reject
                })
            ]
        });
        this.notificationListItemTemplate.bindProperty("datetime", {
            path: "CreateDate",
            type: new sap.ui.model.type.Date({
                pattern: "yyyy-MM-dd ",
                strictParsing: true,

            }),
        });
        let form: sap.ui.layout.VerticalLayout = new sap.ui.layout.VerticalLayout("", {
            class: "sapUiContentPadding",
            width: "100%",
            content: [
                this.list,
                new sap.m.Toolbar("", {
                    content: [
                        new sap.m.ToolbarSpacer("", {}),
                        new sap.m.Link("", {
                            text:ibas.i18n.prop("ui_approvalrequest_link_seemore"),
                            press(evt: any): void {
                                that.fireViewEvents(that.showApprovalRequestListEvent);
                                that.fireViewEvents(that.showFullViewEvent);
                            }
                        })
                    ]
                })

            ]
        });
        utils.triggerNextResults({
            listener: this.list,
            next(data: any): void {
                if (ibas.objects.isNull(that.lastCriteria)) {
                    return;
                }
                let criteria: ibas.ICriteria = that.lastCriteria.next(data);
                if (ibas.objects.isNull(criteria)) {
                    return;
                }
                ibas.logger.log(ibas.emMessageLevel.DEBUG, "result: {0}", criteria.toString());
                that.fireViewEvents(that.fetchApprovalRequestEvent, criteria);
            }
        });
        return form;
    }

    showData(datas: bo.IApprovalRequest[], cri: ibas.ICriteria): void {
        if (ibas.objects.isNull(this.lastCriteria)) {
            this.lastCriteria = cri;
        }
        let done: boolean = false;
        let model: sap.ui.model.Model = this.list.getModel(undefined);
        if (!ibas.objects.isNull(model)) {
            // 已存在绑定数据，添加新的
            let hDatas: bo.IApprovalRequest[] = (<any>model).getData().modelData;
            if (!ibas.objects.isNull(hDatas) && hDatas instanceof Array) {
                for (let item of datas) {
                    hDatas.push(item);
                }
                // 重新绑定数据源会失去焦点，重新获取焦点避免弹出层关闭
                this.list.focus();
                (<any>model).updateBindings();
                // 重新绑定数据源会失去焦点，重新获取焦点避免弹出层关闭
                this.list.focus();
                // model.refresh(false);
                done = true;
            }
        }
        if (!done) {
            // 没有显示数据
            let oModel: sap.ui.model.json.JSONModel = new sap.ui.model.json.JSONModel({ modelData: datas });
            done = false;
            // sap.ui.getCore().setModel(oModel);
            this.list.setModel(null);
            this.list.setModel(oModel);
            this.list.bindItems({ path: "/modelData", template: this.notificationListItemTemplate });
            // this.list.setModel(new sap.ui.model.json.JSONModel({ modelData: datas }));
            // this.notificationListGroupTemplate.bindAggregation("items",{path:
            // "/ApprovalRequestSteps", template: this.notificationListItemTemplate})
        }
        this.list.setBusy(false);
    }
}