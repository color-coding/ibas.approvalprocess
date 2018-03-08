/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace approvalprocess {
    export namespace bo {

        /** 业务对象仓库 */
        export class BORepositoryApprovalProcess extends ibas.BORepositoryApplication implements IBORepositoryApprovalProcess {

            /** 创建此模块的后端与前端数据的转换者 */
            protected createConverter(): ibas.IDataConverter {
                return new DataConverter;
            }
            /**
             * 查询 用户审批请求
             * @param fetcher 查询者
             */
            fetchUserApprovalRequest(fetcher: UserMethodCaller<bo.ApprovalRequest>): void {
                let boRepository: ibas.BORepositoryAjax = new ibas.BORepositoryAjax();
                boRepository.address = this.address;
                boRepository.token = this.token;
                boRepository.converter = this.createConverter();
                let method: string =
                    ibas.strings.format("fetchUserApprovalRequest?user={0}&token={1}",
                        fetcher.user, this.token);
                boRepository.callRemoteMethod(method, undefined, fetcher);
            }
            /**
             * 审批
             * @param caller 调用者
             */
            approval(caller: ApprovalMethodCaller): void {
                let boRepository: ibas.BORepositoryAjax = new ibas.BORepositoryAjax();
                boRepository.address = this.address;
                boRepository.token = this.token;
                boRepository.converter = this.createConverter();
                let method: string =
                    ibas.strings.format("approval?apRequestId={0}&apStepId={1}&apResult={2}&judgment={3}&token={4}",
                        caller.apRequestId, caller.apStepId, caller.apResult, caller.judgment, this.token);
                boRepository.callRemoteMethod(method, undefined, caller);
            }

            /**
             * 上传文件
             * @param caller 调用者
             */
            upload(caller: ibas.IUploadFileCaller<ibas.FileData>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryUploadAjax = new ibas.FileRepositoryUploadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.upload("upload", caller);
            }
            /**
             * 下载文件
             * @param caller 调用者
             */
            download(caller: ibas.IDownloadFileCaller<Blob>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryDownloadAjax = new ibas.FileRepositoryDownloadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.download("download", caller);
            }
            /**
             * 查询 审批请求
             * @param fetcher 查询者
             */
            fetchApprovalRequest(fetcher: ibas.IFetchCaller<bo.ApprovalRequest>): void {
                super.fetch(bo.ApprovalRequest.name, fetcher);
            }
            /**
             * 保存 审批请求
             * @param saver 保存者
             */
            saveApprovalRequest(saver: ibas.ISaveCaller<bo.ApprovalRequest>): void {
                super.save(bo.ApprovalRequest.name, saver);
            }

            /**
             * 查询 审批模板
             * @param fetcher 查询者
             */
            fetchApprovalTemplate(fetcher: ibas.IFetchCaller<bo.ApprovalTemplate>): void {
                super.fetch(bo.ApprovalTemplate.name, fetcher);
            }
            /**
             * 保存 审批模板
             * @param saver 保存者
             */
            saveApprovalTemplate(saver: ibas.ISaveCaller<bo.ApprovalTemplate>): void {
                super.save(bo.ApprovalTemplate.name, saver);
            }

        }
    }
}