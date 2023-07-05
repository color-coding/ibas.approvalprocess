package org.colorcoding.ibas.bobas.approval.initial;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequestStep;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepCondition;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.emApprovalStepStatus;

/**
 * 审批步骤
 * 
 * @author Niuren.Zhu
 *
 */
public abstract class ApprovalProcessStep extends org.colorcoding.ibas.bobas.approval.ApprovalProcessStep {

	public ApprovalProcessStep(IApprovalRequestStep apStep) {
		this.setApprovalRequestStep(apStep);
	}

	private IApprovalRequestStep approvalRequestStep;

	public IApprovalRequestStep getApprovalRequestStep() {
		return approvalRequestStep;
	}

	public void setApprovalRequestStep(IApprovalRequestStep approvalRequestStep) {
		this.approvalRequestStep = approvalRequestStep;
	}

	@Override
	public int getId() {
		return this.getApprovalRequestStep().getLineId();
	}

	@Override
	protected void setId(int value) {
		this.getApprovalRequestStep().setLineId(value);
	}

	@Override
	public DateTime getStartedTime() {
		return this.getApprovalRequestStep().getStartedTime();
	}

	@Override
	protected void setStartedTime(DateTime value) {
		this.getApprovalRequestStep().setStartedTime(value);
	}

	@Override
	public DateTime getFinishedTime() {
		return this.getApprovalRequestStep().getFinishedTime();
	}

	@Override
	protected void setFinishedTime(DateTime value) {
		this.getApprovalRequestStep().setFinishedTime(value);
	}

	@Override
	public String getJudgment() {
		return this.getApprovalRequestStep().getJudgment();
	}

	@Override
	protected void setJudgment(String value) {
		this.getApprovalRequestStep().setJudgment(value);
	}

	@Override
	public emApprovalStepStatus getStatus() {
		return this.getApprovalRequestStep().getStepStatus();
	}

	@Override
	protected void setStatus(emApprovalStepStatus value) {
		this.getApprovalRequestStep().setStepStatus(value);
	}

	private IApprovalProcessStepCondition[] conditions;

	@Override
	public IApprovalProcessStepCondition[] getConditions() {
		if (this.conditions == null && this.getApprovalRequestStep() != null) {
			this.conditions = ApprovalProcessStepCondition.create(this.getApprovalRequestStep().getStepConditions());
		}
		return this.conditions;
	}
}
