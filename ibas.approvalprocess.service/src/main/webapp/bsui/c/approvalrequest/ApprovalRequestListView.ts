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
                    this.table = new sap.extension.table.DataTable("", {
                        enableSelectAll: true,
                        visibleRowCount: sap.extension.table.visibleRowCount(15),
                        visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Interactive,
                        dataInfo: this.queryTarget,
                        rows: "{/rows}",
                        columns: [
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvalrequest_objectkey"),
                                template: new sap.extension.m.Link("", {
                                    press(this: sap.extension.m.Link): void {
                                        let data: any = this.getBindingContext().getObject();
                                        if (data instanceof bo.ApprovalRequest) {
                                            that.fireViewEvents(that.viewDataEvent, data);
                                        }
                                    }
                                }).bindProperty("bindingValue", {
                                    path: "objectKey",
                                    type: new sap.extension.data.Numeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvalrequest_name"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "name",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "12rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvalrequest_approvalstatus"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "approvalStatus",
                                    type: new sap.extension.data.ApprovalStatus(true)
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvalrequest_bokeys"),
                                template: new sap.extension.m.Link("", {
                                    press(this: sap.extension.m.Link): void {
                                        let data: any = this.getBindingContext().getObject();
                                        if (data instanceof bo.ApprovalRequest) {
                                            let criteria: ibas.ICriteria = ibas.criterias.valueOf(data.boKeys);
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
                                }).bindProperty("bindingValue", {
                                    path: "boKeys",
                                    formatter(data: any): any {
                                        return ibas.businessobjects.describe(data);
                                    }
                                }),
                                width: "16rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvalrequest_summary"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "summary",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "20rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvalrequest_approvalowner"),
                                template: new sap.extension.m.UserText("", {
                                }).bindProperty("bindingValue", {
                                    path: "approvalOwner",
                                    type: new sap.extension.data.Numeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvalrequest_startedtime"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "startedTime",
                                    type: new sap.extension.data.Date()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvalrequest_finishedtime"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "finishedTime",
                                    type: new sap.extension.data.Date()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_approvalrequest_remarks"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "remarks",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "20rem",
                            }),
                        ],
                        rowSettingsTemplate: new sap.ui.table.RowSettings("", {
                            highlight: {
                                parts: [
                                    {
                                        path: "approvalStatus",
                                        type: new sap.extension.data.ApprovalStatus(),
                                    },
                                    {
                                        path: "activated",
                                        type: new sap.extension.data.YesNo(),
                                    }
                                ],
                                formatter(approvalStatus: ibas.emApprovalStatus, activated: ibas.emYesNo): sap.ui.core.ValueState {
                                    // tslint:disable-next-line: triple-equals
                                    if (activated == ibas.emYesNo.NO) {
                                        return sap.ui.core.ValueState.Error;
                                    }
                                    // tslint:disable-next-line: triple-equals
                                    if (approvalStatus == ibas.emApprovalStatus.CANCELLED
                                        // tslint:disable-next-line: triple-equals
                                        || approvalStatus == ibas.emApprovalStatus.REJECTED
                                        // tslint:disable-next-line: triple-equals
                                        || approvalStatus == ibas.emApprovalStatus.RETURNED) {
                                        return sap.ui.core.ValueState.Error;
                                        // tslint:disable-next-line: triple-equals
                                    } else if (approvalStatus == ibas.emApprovalStatus.PROCESSING) {
                                        return sap.ui.core.ValueState.Warning;
                                        // tslint:disable-next-line: triple-equals
                                    } else if (approvalStatus == ibas.emApprovalStatus.APPROVED) {
                                        return sap.ui.core.ValueState.Success;
                                    }
                                }
                            }
                        }),
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
                    return new sap.extension.m.Page("", {
                        showHeader: false,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_view"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://display",
                                    press: function (): void {
                                        that.fireViewEvents(that.viewDataEvent, that.table.getSelecteds().firstOrDefault());
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_edit"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://edit",
                                    visible: ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_SUPER) === true ? true : false,
                                    press: function (): void {
                                        that.fireViewEvents(that.editDataEvent, that.table.getSelecteds().firstOrDefault());
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("approvalprocess_view_approval_data"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://detail-view",
                                    press: function (): void {
                                        that.fireViewEvents(that.viewApprovalDataEvent, that.table.getSelecteds().firstOrDefault());
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.extension.m.MenuButton("", {
                                    autoHide: true,
                                    text: ibas.i18n.prop("shell_quick_to"),
                                    icon: "sap-icon://generate-shortcut",
                                    type: sap.m.ButtonType.Transparent,
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop(["shell_batch", "approvalprocess_approve"]),
                                                icon: "sap-icon://message-success",
                                                press: function (): void {
                                                    that.fireViewEvents(that.approvalEvent, that.table.getSelecteds(), ibas.emApprovalResult.APPROVED);
                                                },
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop(["shell_batch", "approvalprocess_reject"]),
                                                icon: "sap-icon://message-error",
                                                press: function (): void {
                                                    that.fireViewEvents(that.approvalEvent, that.table.getSelecteds(), ibas.emApprovalResult.REJECTED);
                                                },
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop(["shell_batch", "approvalprocess_return"]),
                                                icon: "sap-icon://message-warning",
                                                press: function (): void {
                                                    that.fireViewEvents(that.approvalEvent, that.table.getSelecteds(), ibas.emApprovalResult.RETURNED);
                                                },
                                            }),
                                        ],
                                    })
                                }),
                                new sap.m.ToolbarSpacer(),
                                this.segmentedButton = new sap.m.SegmentedButton("", {
                                    width: "auto",
                                    visible: ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_SUPER) === true ? false : true,
                                    items: [
                                        new sap.m.SegmentedButtonItem("", {
                                            key: "participated",
                                            text: ibas.i18n.prop("approvalprocess_my_participated"),
                                        }),
                                        new sap.m.SegmentedButtonItem("", {
                                            key: "initiated",
                                            text: ibas.i18n.prop("approvalprocess_my_initiated"),
                                        }),
                                    ],
                                    selectionChange(this: sap.m.SearchField): void {
                                        let page: any = sap.ui.getCore().byId(that.id);
                                        if (page instanceof sap.m.Page) {
                                            if (page.getSubHeader() instanceof sap.m.Toolbar) {
                                                for (let item of (<sap.m.Toolbar>page.getSubHeader()).getContent()) {
                                                    if (item instanceof sap.m.SearchField) {
                                                        item.fireSearch({ query: item.getValue() });
                                                    }
                                                }
                                            }
                                        }

                                    }
                                }).addStyleClass("sapUiTinyMarginEnd")
                            ]
                        }),
                        content: [
                            this.table,
                        ]
                    });
                }
                private table: sap.extension.table.Table;
                private segmentedButton: sap.m.SegmentedButton;
                /** 显示数据 */
                showData(datas: bo.ApprovalRequest[]): void {
                    let model: sap.ui.model.Model = this.table.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        // 已绑定过数据
                        model.addData(datas);
                    } else {
                        // 未绑定过数据
                        this.table.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                    }
                    this.table.setBusy(false);
                }

                /** 查询数据 */
                query(criteria: ibas.ICriteria): void {
                    this.lastCriteria = criteria;
                    this.fireViewEvents(this.fetchDataEvent, criteria, this.segmentedButton?.getSelectedKey());
                    // 清除历史数据
                    if (this.isDisplayed) {
                        this.table.setBusy(true);
                        this.table.setFirstVisibleRow(0);
                        this.table.setModel(null);
                    }
                }

                smartMode(smart: boolean): void {
                    this.segmentedButton?.setVisible(smart);
                }
                private dataView: sap.ui.core.Control;
                /** 显示数据 */
                showDataView(request: bo.ApprovalRequest, view: ibas.IView): void {
                    if (this.dataView) {
                        this.dataView.destroy();
                        delete (this.dataView);
                    }
                    let that: this = this;
                    let page: any = view.draw();
                    if (page instanceof sap.m.Page) {
                        page.setShowSubHeader(false);
                    } else if (page instanceof sap.extension.uxap.DataObjectPageLayout) {
                        if (page.getHeaderTitle() instanceof sap.uxap.ObjectPageHeader) {
                            let bar: any = (<sap.uxap.ObjectPageHeader>page.getHeaderTitle()).getNavigationBar();
                            if (bar instanceof sap.m.Bar) {
                                bar.destroyContentLeft();
                                bar.destroyContentMiddle();
                                if (!(bar.getContentRight().length > 0)) {
                                    bar.setVisible(false);
                                }
                            }
                            // (<sap.uxap.ObjectPageHeader>page.getHeaderTitle()).getNavigationBar()?.setVisible(false);
                        }
                        // page.setAlwaysShowContentHeader(true);
                        // page.setToggleHeaderOnTitleClick(false);
                        // page.setHeight(ibas.strings.format("{0}px", window.innerHeight * 0.8));
                        // page.setPreserveHeaderStateOnScroll(true);
                    }
                    this.dataView = new sap.m.Dialog("", {
                        title: ibas.strings.format("#{0} · {1} - {2}", request.objectKey, request.name, ibas.businessobjects.describe(request.boKeys)),
                        type: sap.m.DialogType.Standard,
                        state: request.approvalStatus === ibas.emApprovalStatus.PROCESSING ? sap.ui.core.ValueState.Warning :
                            request.approvalStatus === ibas.emApprovalStatus.APPROVED ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error,
                        horizontalScrolling: false,
                        verticalScrolling: false,
                        contentHeight: ibas.strings.format("{0}px", window.innerHeight * 0.8),
                        contentWidth: ibas.strings.format("{0}px", window.innerWidth * 0.8),
                        content: [
                            page
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("approvalprocess_approve"),
                                type: sap.m.ButtonType.Accept,
                                press: function (): void {
                                    that.fireViewEvents(that.approvalEvent, request, ibas.emApprovalResult.APPROVED);
                                },
                                visible: request.approvalStatus === ibas.emApprovalStatus.PROCESSING ? true : false,
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("approvalprocess_reject"),
                                type: sap.m.ButtonType.Reject,
                                press: function (): void {
                                    that.fireViewEvents(that.approvalEvent, request, ibas.emApprovalResult.REJECTED);
                                },
                                visible: request.approvalStatus === ibas.emApprovalStatus.PROCESSING ? true : false,
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("approvalprocess_return"),
                                type: sap.m.ButtonType.Attention,
                                press: function (): void {
                                    that.fireViewEvents(that.approvalEvent, request, ibas.emApprovalResult.RETURNED);
                                },
                                visible: request.approvalStatus === ibas.emApprovalStatus.PROCESSING ? true : false,
                            }),
                            /*
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("approvalprocess_reset"),
                                type: sap.m.ButtonType.Attention,
                                press: function (): void {
                                    that.fireViewEvents(that.approvalEvent, request, ibas.emApprovalResult.PROCESSING);
                                },
                                visible: request.approvalStatus === ibas.emApprovalStatus.PROCESSING ? false : true,
                            }),
                            */
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Emphasized,
                                press: function (): void {
                                    if (view instanceof ibas.View) {
                                        view.closeEvent.apply(view.application);
                                    }
                                }
                            }),
                        ]
                    }).addStyleClass("sapUiNoContentPadding").open();
                }
                /** 显示数据 */
                destroyDataView(view: ibas.IView): void {
                    if (this.dataView) {
                        this.dataView.destroy();
                        delete (this.dataView);
                    }
                }
                /** 显示数据 */
                busyDataView(busy: boolean, msg: string): void {
                    if (this.dataView instanceof sap.ui.core.Control) {
                        this.dataView.setBusy(busy);
                    }
                }
            }
        }
    }
}