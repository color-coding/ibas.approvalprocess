/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { IBORepositoryApprovalProcess, BO_REPOSITORY_APPROVALPROCESS } from "../api/index";
import { DataConverter4ap } from "./DataConverters";
import * as bo from "../3rdparty/initialfantasy/index";
/** 业务对象仓库 */
export class BORepositoryApprovalProcess extends ibas.BORepositoryApplication implements IBORepositoryApprovalProcess {

    /** 创建此模块的后端与前端数据的转换者 */
    protected createConverter(): ibas.IDataConverter {
        return new DataConverter4ap;
    }
    /**
     * 查询 审批请求
     * @param fetcher 查询者
     */
    fetchUserApprovalRequest(fetcher: ibas.FetchCaller<bo.IApprovalRequest>): void {
    let ifbo:bo.IBORepositoryInitialFantasy= ibas.boFactory.create<bo.IBORepositoryInitialFantasy>(bo.BO_REPOSITORY_INITIALFANTASY);
    ifbo.fetchApprovalRequest(fetcher);
    }
    /**
     * 保存 审批请求
     * @param saver 保存者
     */
    saveApprovalRequest(saver: ibas.SaveCaller<bo.IApprovalRequest>): void {
        let ifbo:bo.IBORepositoryInitialFantasy= ibas.boFactory.create<bo.IBORepositoryInitialFantasy>(bo.BO_REPOSITORY_INITIALFANTASY);
        ifbo.saveApprovalRequest(saver);
    }

}
// 注册业务对象仓库到工厂
ibas.boFactory.register(BO_REPOSITORY_APPROVALPROCESS, BORepositoryApprovalProcess);
