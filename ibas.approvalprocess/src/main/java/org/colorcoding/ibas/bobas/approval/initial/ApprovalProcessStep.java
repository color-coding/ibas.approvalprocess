package org.colorcoding.ibas.bobas.approval.initial;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequestStep;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepCondition;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.organization.IUser;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;

/**
 * 审批步骤
 * 
 * @author Niuren.Zhu
 *
 */
public class ApprovalProcessStep extends org.colorcoding.ibas.bobas.approval.ApprovalProcessStep<IApprovalRequestStep> {

	public ApprovalProcessStep(IApprovalRequestStep stepData) {
		super(stepData);
	}

	public boolean isCanModify() {
		return this.getStepData().getStepCanModify() == emYesNo.YES ? true : false;
	}

	private IApprovalProcessStepCondition[] conditions;

	@Override
	public IApprovalProcessStepCondition[] getConditions() {
		if (this.conditions == null) {
			this.conditions = ApprovalProcessStepCondition.create(this.getStepData().getStepConditions());
		}
		return this.conditions;
	}

	@Override
	public IUser getOwner() {
		return OrganizationFactory.createManager().getUser(this.getStepData().getStepOwner());

	}

}
