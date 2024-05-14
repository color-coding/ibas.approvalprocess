package org.colorcoding.ibas.approvalprocess.service.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.colorcoding.ibas.approvalprocess.MyConfiguration;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.ApprovalTemplate;
import org.colorcoding.ibas.approvalprocess.repository.BORepositoryApprovalProcess;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.OperationMessage;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.data.DataConvert;
import org.colorcoding.ibas.bobas.data.emApprovalResult;

/**
 * ApprovalProcess 数据服务JSON
 */
@Path("data")
public class DataService extends BORepositoryApprovalProcess {
	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-审批模板
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchApprovalTemplate")
	public OperationResult<ApprovalTemplate> fetchApprovalTemplate(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchApprovalTemplate(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-审批模板
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveApprovalTemplate")
	public OperationResult<ApprovalTemplate> saveApprovalTemplate(ApprovalTemplate bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveApprovalTemplate(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-审批记录
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchApprovalRequest")
	public OperationResult<ApprovalRequest> fetchApprovalRequest(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchApprovalRequest(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-审批记录
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveApprovalRequest")
	public OperationResult<ApprovalRequest> saveApprovalRequest(ApprovalRequest bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveApprovalRequest(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 审批操作
	 * 
	 * @param apRequestId 审批请求编号
	 * @param apStepId    审批请求步骤编号
	 * @param apResult    审批的结果
	 * @param judgment    审批意见
	 * @param token       口令
	 * @return
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("approval")
	public OperationMessage approval(@QueryParam("apRequestId") int apRequestId, @QueryParam("apStepId") int apStepId,
			@QueryParam("apResult") String apResult, @QueryParam("judgment") String judgment,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		if (apResult != null && !apResult.isEmpty()) {
			emApprovalResult approvalResult = null;
			if (DataConvert.isNumeric(apResult)) {
				approvalResult = emApprovalResult.valueOf(Integer.valueOf(apResult));
			} else {
				approvalResult = emApprovalResult.valueOf(apResult);
			}
			return super.approval(apRequestId, apStepId, approvalResult, judgment,
					MyConfiguration.optToken(authorization, token));
		}
		return new OperationMessage(new ClassCastException("apResult"));
	}

	// --------------------------------------------------------------------------------------------//

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchUserApprovalRequest")
	public OperationResult<ApprovalRequest> fetchUserApprovalRequest(@QueryParam("user") String user,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchUserApprovalRequest(user, MyConfiguration.optToken(authorization, token));
	}
	// --------------------------------------------------------------------------------------------//
}
