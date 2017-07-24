/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    FetchCaller,
    SaveCaller
} from "ibas/index";
import * as bo from "../3rdparty/initialfantasy/index";

/** 业务仓库 */
export interface IBORepositoryApprovalProcess {

    /**
     * 查询 审批请求
     * @param fetcher 查询者
     */
    fetchUserApprovalRequest(fetcher: FetchCaller<bo.IApprovalRequest>);
}
