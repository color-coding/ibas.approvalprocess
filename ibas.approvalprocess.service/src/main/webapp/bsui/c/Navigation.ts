/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as approvalrequestApps from "../../bsapp/approvalrequest/index";
import * as approvaltemplateApps from "../../bsapp/approvaltemplate/index";
import * as approvalprocessApps from "../../bsapp/approvalprocess/index";
import * as approvalrequestViews from "./approvalrequest/index";
import * as approvaltemplateViews from "./approvaltemplate/index";
import * as approvalprocessViews from "./approvalprocess/index";

/**
 * 视图导航
 */
export default class Navigation extends ibas.ViewNavigation {

    /**
     * 创建实例
     * @param id 应用id
     */
    protected newView(id: string): ibas.IView {
        let view: ibas.IView = null;
        switch (id) {
            case approvalrequestApps.ApprovalRequestListApp.APPLICATION_ID:
                view = new approvalrequestViews.ApprovalRequestListView();
                break;
            case approvalrequestApps.ApprovalRequestChooseApp.APPLICATION_ID:
                view = new approvalrequestViews.ApprovalRequestChooseView();
                break;
            case approvalrequestApps.ApprovalRequestViewApp.APPLICATION_ID:
                view = new approvalrequestViews.ApprovalRequestViewView();
                break;
            case approvalrequestApps.ApprovalRequestEditApp.APPLICATION_ID:
                view = new approvalrequestViews.ApprovalRequestEditView();
                break;
            case approvaltemplateApps.ApprovalTemplateListApp.APPLICATION_ID:
                view = new approvaltemplateViews.ApprovalTemplateListView();
                break;
            case approvaltemplateApps.ApprovalTemplateChooseApp.APPLICATION_ID:
                view = new approvaltemplateViews.ApprovalTemplateChooseView();
                break;
            case approvaltemplateApps.ApprovalTemplateEditApp.APPLICATION_ID:
                view = new approvaltemplateViews.ApprovalTemplateEditView();
                break;
            case approvalprocessApps.ApprovalProcessApp.APPLICATION_ID:
                view = new approvalprocessViews.ApprovalProcessView();
                break;
            default:
                break;
        }
        return view;
    }
}
