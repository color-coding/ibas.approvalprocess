/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    FetchCaller,
    SaveCaller,
    MethodCaller,
    IOperationResult,
    IOperationMessage,
    UploadFileCaller,
    DownloadFileCaller,
    FileData,
    IBORepositoryApplication,
} from "ibas/index";
import * as bo from "./bo/index"

/** 业务仓库 */
export interface IBORepositoryApprovalProcess extends IBORepositoryApplication {

    /**
     * 上传文件
     * @param caller 调用者
     */
    upload(caller: UploadFileCaller<FileData>);
    /**
     * 下载文件
     * @param caller 调用者
     */
    download(caller: DownloadFileCaller<Blob>);
    /**
     * 审批
     * @param caller 调用者
     */
    approval(caller: ApprovalMethodCaller);
    /**
     * 查询 用户审批请求
     * @param fetcher 查询者
     */
    fetchUserApprovalRequest(fetcher: UserMethodCaller<bo.IApprovalRequest>);
    /**
     * 查询 审批请求
     * @param fetcher 查询者
     */
    fetchApprovalRequest(fetcher: FetchCaller<bo.IApprovalRequest>);
    /**
     * 保存 审批请求
     * @param saver 保存者
     */
    saveApprovalRequest(saver: SaveCaller<bo.IApprovalRequest>);

    /**
     * 查询 审批模板
     * @param fetcher 查询者
     */
    fetchApprovalTemplate(fetcher: FetchCaller<bo.IApprovalTemplate>);
    /**
     * 保存 审批模板
     * @param saver 保存者
     */
    saveApprovalTemplate(saver: SaveCaller<bo.IApprovalTemplate>);


}
/**
 * 用户相关调用者
 */
export interface UserMethodCaller<P> extends MethodCaller {
    /** 用户 */
    user: string;
    /** 平台 */
    platform?: string;
    /**
     * 调用完成
     * @param opRslt 结果
     */
    onCompleted(opRslt: IOperationResult<P>);
}
/**
 * 审批调用者
 */
export interface ApprovalMethodCaller extends MethodCaller {
    /** 审批请求编号 */
    apRequestId: number;
    /** 审批请求步骤编号 */
    apStepId: number;
    /** 审批的结果 */
    apResult: number;
    /** 审批意见 */
    judgment: string;
    /**
     * 调用完成
     * @param opRslt 结果
     */
    onCompleted(opRslt: IOperationMessage);
}