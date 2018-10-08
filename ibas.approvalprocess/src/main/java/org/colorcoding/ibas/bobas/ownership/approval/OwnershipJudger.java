package org.colorcoding.ibas.bobas.ownership.approval;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequestStep;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequest;
import org.colorcoding.ibas.approvalprocess.repository.BORepositoryApprovalProcess;
import org.colorcoding.ibas.approvalprocess.repository.IBORepositoryApprovalProcessApp;
import org.colorcoding.ibas.bobas.approval.IApprovalData;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.data.emApprovalStatus;
import org.colorcoding.ibas.bobas.data.emApprovalStepStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.bobas.organization.IUser;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;
import org.colorcoding.ibas.bobas.ownership.IDataOwnership;

/**
 * 数据所有者，审批实现
 * 
 * @author Niuren.Zhu
 *
 */
public class OwnershipJudger extends org.colorcoding.ibas.bobas.ownership.initial.OwnershipJudger {

	@Override
	public boolean canRead(IDataOwnership data, IUser user) {
		try {
			if (data == null || user == null) {
				return false;
			}
			boolean result = this.filtering(data, user);
			if (!result && data instanceof IApprovalData) {
				// 数据不可读，检查是否存在审批流程，存在则可读
				IApprovalData apData = (IApprovalData) data;
				if (apData.getApprovalStatus() == emApprovalStatus.PROCESSING) {
					ICriteria criteria = new Criteria();
					criteria.setResultCount(1);
					// 激活的
					ICondition condition = criteria.getConditions().create();
					condition.setAlias(ApprovalRequest.PROPERTY_ACTIVATED.getName());
					condition.setValue(emYesNo.YES);
					// 审批中的
					condition = criteria.getConditions().create();
					condition.setAlias(ApprovalRequest.PROPERTY_APPROVALSTATUS.getName());
					condition.setValue(emApprovalStatus.PROCESSING);
					// 此数据
					condition = criteria.getConditions().create();
					condition.setAlias(ApprovalRequest.PROPERTY_BOKEYS.getName());
					condition.setValue(apData.getIdentifiers());
					// 子项查询
					IChildCriteria childCriteria = criteria.getChildCriterias().create();
					childCriteria.setOnlyHasChilds(true);
					childCriteria.setNoChilds(false);
					childCriteria.setPropertyPath(ApprovalRequest.PROPERTY_APPROVALREQUESTSTEPS.getName());
					// 审批中的
					condition = childCriteria.getConditions().create();
					condition.setAlias(ApprovalRequestStep.PROPERTY_STEPSTATUS.getName());
					condition.setValue(emApprovalStepStatus.PROCESSING);
					// 此人的
					condition = childCriteria.getConditions().create();
					condition.setAlias(ApprovalRequestStep.PROPERTY_STEPOWNER.getName());
					condition.setValue(user.getId());
					// 查询审批请求
					IBORepositoryApprovalProcessApp boRepository = new BORepositoryApprovalProcess();
					boRepository.setUserToken(OrganizationFactory.SYSTEM_USER.getToken());
					IOperationResult<IApprovalRequest> operationResult = boRepository.fetchApprovalRequest(criteria);
					if (!operationResult.getResultObjects().isEmpty()) {
						// 有记录，则可以查看数据
						result = true;
					}
				}
			}
			return result;
		} catch (Exception e) {
			Logger.log(e);
			throw new RuntimeException(e);
		}
	}
}
