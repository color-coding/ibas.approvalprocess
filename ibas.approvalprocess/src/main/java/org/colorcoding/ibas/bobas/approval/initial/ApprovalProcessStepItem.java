package org.colorcoding.ibas.bobas.approval.initial;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequestStep;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepCondition;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepMultiOwner;
import org.colorcoding.ibas.bobas.organization.IUser;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;

public class ApprovalProcessStepItem extends ApprovalProcessStep
		implements org.colorcoding.ibas.bobas.approval.IApprovalProcessStepItem {

	public ApprovalProcessStepItem(IApprovalRequestStep apStep, IApprovalProcessStepMultiOwner parent) {
		super(apStep);
		this.setParent(parent);
	}

	@Override
	public IApprovalProcessStepCondition[] getConditions() {
		return null;
	}

	private IApprovalProcessStepMultiOwner parent;

	@Override
	public IApprovalProcessStepMultiOwner getParent() {
		return this.parent;
	}

	void setParent(IApprovalProcessStepMultiOwner parent) {
		this.parent = parent;
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
