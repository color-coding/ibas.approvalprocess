package org.colorcoding.ibas.approvalprocess.service.soap;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

import org.colorcoding.ibas.approvalprocess.repository.BORepositoryApprovalProcess;
import org.colorcoding.ibas.bobas.common.OperationMessages;
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
	public OperationMessages approval(@WebParam(name = "apRequestId") int apRequestId,
			@WebParam(name = "apStepId") int apStepId, @WebParam(name = "apResult") String apResult,
			@WebParam(name = "judgment") String judgment, @WebParam(name = "token") String token) {
		emApprovalResult emApReslut = emApprovalResult.valueOf(apResult);
		return super.approval(apRequestId, apStepId, emApReslut, judgment, token);
	}

}
