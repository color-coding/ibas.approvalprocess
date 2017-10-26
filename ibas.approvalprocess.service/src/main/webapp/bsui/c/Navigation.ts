/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as approvalprocessApps from "../../bsapp/approvalprocess/index";
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
            case approvalprocessApps.ApprovalProcessApp.APPLICATION_ID:
                view = new approvalprocessViews.ApprovalProcessView();
                break;
            case approvalprocessApps.ApprovalProcessViewApp.APPLICATION_ID:
                view = new approvalprocessViews.ApprovalProcessViewView();
                break;
            case approvalprocessApps.ApprovalRequestProcessListApp.APPLICATION_ID:
                view = new approvalprocessViews.ApprovalRequestProcessListView();
                break;
            default:
                break;
        }
        return view;
    }
}
