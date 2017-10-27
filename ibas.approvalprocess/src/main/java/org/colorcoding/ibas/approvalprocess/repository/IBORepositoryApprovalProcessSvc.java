package org.colorcoding.ibas.approvalprocess.repository;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.ApprovalTemplate;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.OperationMessage;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.data.emApprovalResult;
import org.colorcoding.ibas.bobas.repository.IBORepositorySmartService;

/**
 * ApprovalProcess仓库服务
 */
public interface IBORepositoryApprovalProcessSvc extends IBORepositorySmartService {
	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-审批模板
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<ApprovalTemplate> fetchApprovalTemplate(ICriteria criteria, String token);

	/**
	 * 保存-审批模板
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<ApprovalTemplate> saveApprovalTemplate(ApprovalTemplate bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-审批记录
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<ApprovalRequest> fetchApprovalRequest(ICriteria criteria, String token);

	/**
	 * 保存-审批记录
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<ApprovalRequest> saveApprovalRequest(ApprovalRequest bo, String token);

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
	OperationMessage approval(int apRequestId, int apStepId, emApprovalResult apResult, String judgment, String token);

	// --------------------------------------------------------------------------------------------//

}
