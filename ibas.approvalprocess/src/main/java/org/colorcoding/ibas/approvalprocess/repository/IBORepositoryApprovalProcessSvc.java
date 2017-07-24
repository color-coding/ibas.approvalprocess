package org.colorcoding.ibas.approvalprocess.repository;

import org.colorcoding.ibas.bobas.common.OperationMessages;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.data.emApprovalResult;
import org.colorcoding.ibas.bobas.repository.IBORepositorySmartService;
import org.colorcoding.ibas.initialfantasy.bo.approvalrequest.ApprovalRequest;

/**
 * ApprovalProcess仓库服务
 */
public interface IBORepositoryApprovalProcessSvc extends IBORepositorySmartService {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-用户审批请求
	 * 
	 * @param user
	 *            用户
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<ApprovalRequest> fetchUserApprovalRequest(String user, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 审批操作
	 * 
	 * @param apRequestId
	 *            审批请求编号
	 * @param apStepId
	 *            审批请求步骤编号
	 * @param apResult
	 *            审批的结果
	 * @param judgment
	 *            审批意见
	 * @param token
	 *            口令
	 * @return
	 */
	OperationMessages approval(int apRequestId, int apStepId, emApprovalResult apResult, String judgment, String token);

	// --------------------------------------------------------------------------------------------//

}
