package org.colorcoding.ibas.approvalprocess.repository;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.IApprovalTemplate;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationMessages;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.data.emApprovalResult;
import org.colorcoding.ibas.bobas.repository.IBORepositoryApplication;

/**
 * ApprovalProcess仓库应用
 */
public interface IBORepositoryApprovalProcessApp extends IBORepositoryApplication {
	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-审批模板
	 * 
	 * @param criteria
	 *            查询
	 * @return 操作结果
	 */
	IOperationResult<IApprovalTemplate> fetchApprovalTemplate(ICriteria criteria);

	/**
	 * 保存-审批模板
	 * 
	 * @param bo
	 *            对象实例
	 * @return 操作结果
	 */
	IOperationResult<IApprovalTemplate> saveApprovalTemplate(IApprovalTemplate bo);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-审批记录
	 * 
	 * @param criteria
	 *            查询
	 * @return 操作结果
	 */
	IOperationResult<IApprovalRequest> fetchApprovalRequest(ICriteria criteria);

	/**
	 * 保存-审批记录
	 * 
	 * @param bo
	 *            对象实例
	 * @return 操作结果
	 */
	IOperationResult<IApprovalRequest> saveApprovalRequest(IApprovalRequest bo);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-用户审批请求
	 * 
	 * @param user
	 *            用户
	 * @return 操作结果
	 */
	IOperationResult<IApprovalRequest> fetchUserApprovalRequest(String user);

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
	IOperationMessages approval(int apRequestId, int apStepId, emApprovalResult apResult, String judgment,
			String token);

	// --------------------------------------------------------------------------------------------//

}
