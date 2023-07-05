package org.colorcoding.ibas.bobas.approval.initial;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequestStep;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepItem;
import org.colorcoding.ibas.bobas.data.ArrayList;
import org.colorcoding.ibas.bobas.data.List;

/**
 * 审批步骤（多用户）
 * 
 * @author Niuren.Zhu
 *
 */
public class ApprovalProcessStepMultiOwner extends ApprovalProcessStep
		implements org.colorcoding.ibas.bobas.approval.IApprovalProcessStepMultiOwner {

	public ApprovalProcessStepMultiOwner(IApprovalRequestStep apStep) {
		super(apStep);
	}

	@Override
	public int getApproversRequired() {
		return this.getApprovalRequestStep().getApproversRequired();
	}

	private IApprovalProcessStepItem[] items;

	@Override
	public IApprovalProcessStepItem[] getItems() {
		if (this.items == null) {
			List<IApprovalProcessStepItem> items = new ArrayList<>();
			for (IApprovalRequestStep item : this.getApprovalRequestStep().getApprovalRequestSubSteps()) {
				items.add(new ApprovalProcessStepItem(item, this));
			}
			this.items = items.toArray(new IApprovalProcessStepItem[] {});
		}
		return this.items;
	}

}
