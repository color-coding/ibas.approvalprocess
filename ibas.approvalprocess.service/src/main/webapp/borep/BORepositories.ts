/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "./bo/index";
import { IBORepositoryApprovalProcess, BO_REPOSITORY_APPROVALPROCESS } from "../api/index";
import { DataConverter4ap } from "./DataConverters";

/** 业务对象仓库 */
export class BORepositoryApprovalProcess extends ibas.BORepositoryApplication implements IBORepositoryApprovalProcess {

    /** 创建此模块的后端与前端数据的转换者 */
    protected createConverter(): ibas.IDataConverter {
        return new DataConverter4ap;
    }
    /**
     * 查询 用户审批请求
     * @param fetcher 查询者
     */
    fetchUserApprovalRequest(fetcher: ibas.FetchCaller<bo.ApprovalRequest>): void {
        super.fetch(bo.ApprovalRequest.name, fetcher);
    }

    /**
     * 查询 审批请求
     * @param fetcher 查询者
     */
    fetchApprovalRequest(fetcher: ibas.FetchCaller<bo.ApprovalRequest>): void {
        super.fetch(bo.ApprovalRequest.name, fetcher);
    }
    /**
     * 保存 审批请求
     * @param saver 保存者
     */
    saveApprovalRequest(saver: ibas.SaveCaller<bo.ApprovalRequest>): void {
        super.save(bo.ApprovalRequest.name, saver);
    }

    /**
     * 查询 审批模板
     * @param fetcher 查询者
     */
    fetchApprovalTemplate(fetcher: ibas.FetchCaller<bo.ApprovalTemplate>): void {
        super.fetch(bo.ApprovalTemplate.name, fetcher);
    }
    /**
     * 保存 审批模板
     * @param saver 保存者
     */
    saveApprovalTemplate(saver: ibas.SaveCaller<bo.ApprovalTemplate>): void {
        super.save(bo.ApprovalTemplate.name, saver);
    }

}
// 注册业务对象仓库到工厂
ibas.boFactory.register(BO_REPOSITORY_APPROVALPROCESS, BORepositoryApprovalProcess);
