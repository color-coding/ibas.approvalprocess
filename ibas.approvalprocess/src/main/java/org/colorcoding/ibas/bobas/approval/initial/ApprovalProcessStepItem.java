package org.colorcoding.ibas.bobas.approval.initial;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequestStep;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepMultiOwner;

public class ApprovalProcessStepItem extends ApprovalProcessStep
		implements org.colorcoding.ibas.bobas.approval.IApprovalProcessStepItem {

	public ApprovalProcessStepItem(IApprovalRequestStep stepData, IApprovalProcessStepMultiOwner parent) {
		super(stepData);
		this.parent = parent;
	}

	private IApprovalProcessStepMultiOwner parent;

	@Override
	public IApprovalProcessStepMultiOwner getParent() {
		return this.parent;
	}

}
