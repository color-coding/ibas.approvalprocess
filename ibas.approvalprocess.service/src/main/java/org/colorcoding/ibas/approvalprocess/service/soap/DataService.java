package org.colorcoding.ibas.approvalprocess.service.soap;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.ApprovalTemplate;
import org.colorcoding.ibas.approvalprocess.repository.BORepositoryApprovalProcess;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.OperationMessage;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.cxf.WebServicePath;
import org.colorcoding.ibas.bobas.data.emApprovalResult;

/**
 * ApprovalProcess 数据服务JSON
 */
@WebService
@WebServicePath("data")
public class DataService extends BORepositoryApprovalProcess {
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
	@WebMethod
	public OperationResult<ApprovalTemplate> fetchApprovalTemplate(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
		return super.fetchApprovalTemplate(criteria, token);
	}

	/**
	 * 保存-审批模板
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<ApprovalTemplate> saveApprovalTemplate(@WebParam(name = "bo") ApprovalTemplate bo,
			@WebParam(name = "token") String token) {
		return super.saveApprovalTemplate(bo, token);
	}

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
	@WebMethod
	public OperationResult<ApprovalRequest> fetchApprovalRequest(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
		return super.fetchApprovalRequest(criteria, token);
	}

	/**
	 * 保存-审批记录
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<ApprovalRequest> saveApprovalRequest(@WebParam(name = "bo") ApprovalRequest bo,
			@WebParam(name = "token") String token) {
		return super.saveApprovalRequest(bo, token);
	}

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
	@WebMethod
	public OperationMessage approval(@WebParam(name = "apRequestId") int apRequestId,
			@WebParam(name = "apStepId") int apStepId, @WebParam(name = "apResult") String apResult,
			@WebParam(name = "judgment") String judgment, @WebParam(name = "token") String token) {
		emApprovalResult emApReslut = emApprovalResult.valueOf(apResult);
		return super.approval(apRequestId, apStepId, emApReslut, judgment, token);
	}

}
