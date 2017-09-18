package org.colorcoding.ibas.approvalprocess.repository;

import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.initialfantasy.bo.approvalrequest.ApprovalRequest;
import org.colorcoding.ibas.initialfantasy.bo.approvalrequest.IApprovalRequest;
import org.colorcoding.ibas.initialfantasy.repository.BORepositoryInitialFantasy;

/**
 * ApprovalProcess仓库
 */
public class BORepositoryApprovalProcess extends BORepositoryInitialFantasy
		implements IBORepositoryApprovalProcessApp, IBORepositoryApprovalProcessSvc {

	@Override
	public OperationResult<ApprovalRequest> fetchUserApprovalRequest(String user, String token) {
		OperationResult<ApprovalRequest> opRslt = new OperationResult<>();
		try {
			this.setUserToken(token);
		} catch (Exception e) {
			opRslt.setError(e);
		}
		return opRslt;
	}

	@Override
	public IOperationResult<IApprovalRequest> fetchUserApprovalRequest(String user) {
		return new OperationResult<IApprovalRequest>(this.fetchUserApprovalRequest(user, this.getUserToken()));
	}

}
