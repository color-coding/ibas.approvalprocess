package org.colorcoding.ibas.approvalprocess.service.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.colorcoding.ibas.approvalprocess.repository.BORepositoryApprovalProcess;
import org.colorcoding.ibas.bobas.common.OperationMessages;
import org.colorcoding.ibas.bobas.data.emApprovalResult;

/**
 * ApprovalProcess 数据服务JSON
 */
@Path("data")
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
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("approval")
	public OperationMessages approval(@QueryParam("apRequestId") int apRequestId, @QueryParam("apStepId") int apStepId,
			@QueryParam("apResult") String apResult, @QueryParam("judgment") String judgment,
			@QueryParam("token") String token) {
		emApprovalResult emApReslut = emApprovalResult.valueOf(apResult);
		return super.approval(apRequestId, apStepId, emApReslut, judgment, token);
	}

	// --------------------------------------------------------------------------------------------//

}
