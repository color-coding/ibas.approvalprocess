/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace bo {

        /** 业务仓库 */
        export interface IBORepositoryApprovalProcess extends ibas.IBORepositoryApplication {

            /**
             * 上传文件
             * @param caller 调用者
             */
            upload(caller: ibas.IUploadFileCaller<ibas.FileData>): void;
            /**
             * 下载文件
             * @param caller 调用者
             */
            download(caller: ibas.IDownloadFileCaller<Blob>): void;
            /**
             * 审批
             * @param caller 调用者
             */
            approval(caller: ApprovalMethodCaller): void;
            /**
             * 查询 用户审批请求
             * @param fetcher 查询者
             */
            fetchUserApprovalRequest(fetcher: UserMethodCaller<bo.IApprovalRequest>): void;
            /**
             * 查询 审批请求
             * @param fetcher 查询者
             */
            fetchApprovalRequest(fetcher: ibas.IFetchCaller<bo.IApprovalRequest>): void;
            /**
             * 保存 审批请求
             * @param saver 保存者
             */
            saveApprovalRequest(saver: ibas.ISaveCaller<bo.IApprovalRequest>): void;

            /**
             * 查询 审批模板
             * @param fetcher 查询者
             */
            fetchApprovalTemplate(fetcher: ibas.IFetchCaller<bo.IApprovalTemplate>): void;
            /**
             * 保存 审批模板
             * @param saver 保存者
             */
            saveApprovalTemplate(saver: ibas.ISaveCaller<bo.IApprovalTemplate>): void;


        }
        /**
         * 用户相关调用者
         */
        export interface UserMethodCaller<P> extends ibas.IMethodCaller<P> {
            /** 用户 */
            user: string;
            /** 平台 */
            platform?: string;
            /**
             * 调用完成
             * @param opRslt 结果
             */
            onCompleted(opRslt: ibas.IOperationResult<P>): void;
        }
        /**
         * 审批调用者
         */
        export interface ApprovalMethodCaller extends ibas.IMethodCaller<any> {
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
            onCompleted(opRslt: ibas.IOperationMessage): void;
        }
    }
}