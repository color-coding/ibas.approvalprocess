/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace ui {
        export namespace m {
            /**
             * 视图-ApprovalRequest
             */
            export class ApprovalRequestListView extends ibas.BOListView implements app.IApprovalRequestListView {
                /** 返回查询的对象 */
                get queryTarget(): any {
                    return bo.ApprovalRequest;
                }
                /** 编辑数据，参数：目标数据 */
                editDataEvent: Function;
                /** 删除数据事件，参数：删除对象集合 */
                deleteDataEvent: Function;
                // 审批操作，参数1，审批请求；参数2，操作
                approvalEvent: Function;
                /** 查看待审批数据 */
                viewApprovalDataEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.list = new sap.extension.m.List("", {
                        mode: sap.m.ListMode.None,
                        items: {
                            path: "/rows",
                            template: new sap.m.ObjectListItem("", {
                                title: "# {objectKey} · {name}",
                                number: {
                                    path: "approvalStatus",
                                    type: new sap.extension.data.ApprovalStatus(true)
                                },
                                numberState: {
                                    path: "approvalStatus",
                                    formatter(data: ibas.emApprovalStatus): sap.ui.core.ValueState {
                                        if (data === ibas.emApprovalStatus.APPROVED) {
                                            return sap.ui.core.ValueState.Success;
                                        } else if (data === ibas.emApprovalStatus.PROCESSING) {
                                            return sap.ui.core.ValueState.Warning;
                                        } else if (data === ibas.emApprovalStatus.REJECTED) {
                                            return sap.ui.core.ValueState.Error;
                                        } else if (data === ibas.emApprovalStatus.RETURNED) {
                                            return sap.ui.core.ValueState.Error;
                                        } else if (data === ibas.emApprovalStatus.CANCELLED) {
                                            return sap.ui.core.ValueState.None;
                                        }
                                        return sap.ui.core.ValueState.None;
                                    }
                                },
                                attributes: [
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_approvalrequest_bokeys"),
                                        bindingValue: {
                                            path: "boKeys",
                                            formatter(data: any): any {
                                                return ibas.businessobjects.describe(data);
                                            }
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_approvalrequest_approvalowner"),
                                        bindingValue: {
                                            path: "summary",
                                            type: new sap.extension.data.Alphanumeric()
                                        },
                                        visible: {
                                            path: "summary",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data) ? false : true;
                                            }
                                        }
                                    }),
                                    new sap.extension.m.UserObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_approvalrequest_approvalowner"),
                                        bindingValue: {
                                            path: "approvalOwner",
                                            type: new sap.extension.data.Numeric()
                                        },
                                        visible: {
                                            path: "approvalOwner",
                                            formatter(data: number): boolean {
                                                return data > 0 ? true : false;
                                            }
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_approvalrequest_startedtime"),
                                        bindingValue: {
                                            path: "startedTime",
                                            type: new sap.extension.data.Date(),
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_approvalrequest_finishedtime"),
                                        bindingValue: {
                                            path: "finishedTime",
                                            type: new sap.extension.data.Date(),
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_approvalrequest_remarks"),
                                        bindingValue: {
                                            path: "remarks",
                                            type: new sap.extension.data.Alphanumeric(),
                                        },
                                    }),
                                ],
                                type: sap.m.ListType.Active,
                                press: function (oEvent: sap.ui.base.Event): void {
                                    that.fireViewEvents(that.viewDataEvent, this.getBindingContext().getObject());
                                },
                            })
                        },
                        nextDataSet(event: sap.ui.base.Event): void {
                            // 查询下一个数据集
                            let data: any = event.getParameter("data");
                            if (ibas.objects.isNull(data)) {
                                return;
                            }
                            if (ibas.objects.isNull(that.lastCriteria)) {
                                return;
                            }
                            let criteria: ibas.ICriteria = that.lastCriteria.next(data);
                            if (ibas.objects.isNull(criteria)) {
                                return;
                            }
                            ibas.logger.log(ibas.emMessageLevel.DEBUG, "result: {0}", criteria.toString());
                            that.fireViewEvents(that.fetchDataEvent, criteria);
                        }
                    });
                    return this.page = new sap.m.Page("", {
                        showHeader: false,
                        showSubHeader: false,
                        floatingFooter: true,
                        content: [
                            this.list
                        ],
                    });
                }
                private page: sap.m.Page;
                private list: sap.extension.m.List;
                /** 显示数据 */
                showData(datas: bo.ApprovalRequest[]): void {
                    if (!ibas.objects.isNull(this.pullToRefresh)) {
                        this.pullToRefresh.hide();
                    }
                    let model: sap.ui.model.Model = this.list.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        // 已绑定过数据
                        model.addData(datas);
                    } else {
                        // 未绑定过数据
                        this.list.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                    }
                    this.list.setBusy(false);
                }
                /** 查询数据 */
                query(criteria: ibas.ICriteria): void {
                    super.query(criteria);
                    // 清除历史数据
                    if (this.isDisplayed) {
                        this.list.setBusy(true);
                        this.list.setModel(null);
                    }
                }
                private pullToRefresh: sap.m.PullToRefresh;
                /** 嵌入下拉条 */
                embeddedPuller(view: any): void {
                    if (view instanceof sap.m.PullToRefresh) {
                        if (!ibas.objects.isNull(this.page)) {
                            this.page.insertContent(view, 0);
                            this.pullToRefresh = view;
                        }
                    }
                }
                smartMode(smart: boolean): void {
                }
            }
        }
    }
}