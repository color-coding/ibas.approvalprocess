package org.colorcoding.ibas.bobas.approval.initial;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequestStep;
import org.colorcoding.ibas.bobas.organization.IUser;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;

/**
 * 审批步骤（单用户）
 * 
 * @author Niuren.Zhu
 *
 */
public class ApprovalProcessStepSingleOwner extends ApprovalProcessStep
		implements org.colorcoding.ibas.bobas.approval.IApprovalProcessStepSingleOwner {

	public ApprovalProcessStepSingleOwner(IApprovalRequestStep apStep) {
		super(apStep);
	}

	private IUser owner;

	@Override
	public IUser getOwner() {
		if (this.owner == null) {
			this.owner = OrganizationFactory.create().createManager()
					.getUser(this.getApprovalRequestStep().getStepOwner());
		}
		if (this.owner == null) {
			this.owner = OrganizationFactory.UNKNOWN_USER;
		}
		return owner;
	}

}
