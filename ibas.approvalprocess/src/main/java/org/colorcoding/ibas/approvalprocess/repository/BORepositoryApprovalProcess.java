package org.colorcoding.ibas.approvalprocess.repository;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequestStep;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequestStep;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.ApprovalTemplate;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.IApprovalTemplate;
import org.colorcoding.ibas.bobas.approval.ApprovalFactory;
import org.colorcoding.ibas.bobas.approval.ApprovalProcess;
import org.colorcoding.ibas.bobas.common.ConditionOperation;
import org.colorcoding.ibas.bobas.common.ConditionRelationship;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.ISort;
import org.colorcoding.ibas.bobas.common.Numbers;
import org.colorcoding.ibas.bobas.common.OperationMessage;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.common.SortType;
import org.colorcoding.ibas.bobas.data.emApprovalResult;
import org.colorcoding.ibas.bobas.data.emApprovalStatus;
import org.colorcoding.ibas.bobas.data.emApprovalStepStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;
import org.colorcoding.ibas.bobas.repository.BORepositoryServiceApplication;

/**
 * ApprovalProcess仓库
 */
public class BORepositoryApprovalProcess extends BORepositoryServiceApplication
		implements IBORepositoryApprovalProcessApp, IBORepositoryApprovalProcessSvc {
	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-审批模板
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<ApprovalTemplate> fetchApprovalTemplate(ICriteria criteria, String token) {
		return super.fetch(ApprovalTemplate.class, criteria, token);
	}

	/**
	 * 查询-审批模板（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<IApprovalTemplate> fetchApprovalTemplate(ICriteria criteria) {
		return new OperationResult<IApprovalTemplate>(this.fetchApprovalTemplate(criteria, this.getUserToken()));
	}

	/**
	 * 保存-审批模板
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<ApprovalTemplate> saveApprovalTemplate(ApprovalTemplate bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-审批模板（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<IApprovalTemplate> saveApprovalTemplate(IApprovalTemplate bo) {
		return new OperationResult<IApprovalTemplate>(
				this.saveApprovalTemplate((ApprovalTemplate) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-审批请求
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<ApprovalRequest> fetchApprovalRequest(ICriteria criteria, String token) {
		return super.fetch(ApprovalRequest.class, criteria, token);
	}

	/**
	 * 查询-审批请求（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<IApprovalRequest> fetchApprovalRequest(ICriteria criteria) {
		return new OperationResult<IApprovalRequest>(this.fetchApprovalRequest(criteria, this.getUserToken()));
	}

	/**
	 * 保存-审批请求
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<ApprovalRequest> saveApprovalRequest(ApprovalRequest bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-审批请求（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<IApprovalRequest> saveApprovalRequest(IApprovalRequest bo) {
		return new OperationResult<IApprovalRequest>(
				this.saveApprovalRequest((ApprovalRequest) bo, this.getUserToken()));
	}

	@Override
	public OperationResult<ApprovalRequest> fetchUserApprovalRequest(String user, String token) {
		try {
			this.setUserToken(token);
			ICriteria criteria = new Criteria();
			// 激活的
			ICondition condition = criteria.getConditions().create();
			condition.setAlias(ApprovalRequest.PROPERTY_ACTIVATED.getName());
			condition.setValue(emYesNo.YES);
			// 审批中的
			condition = criteria.getConditions().create();
			condition.setAlias(ApprovalRequest.PROPERTY_APPROVALSTATUS.getName());
			condition.setValue(emApprovalStatus.PROCESSING);
			// 排序
			ISort sort = criteria.getSorts().create();
			sort.setAlias(ApprovalRequest.PROPERTY_STARTEDTIME.getName());
			sort.setSortType(SortType.ASCENDING);
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
			condition.setValue(user);
			condition.setBracketOpen(1);
			condition = childCriteria.getConditions().create();
			condition.setAlias(ApprovalRequestStep.PROPERTY_STEPOWNERS.getName());
			condition.setValue(String.format("!%s,", user));
			condition.setOperation(ConditionOperation.CONTAIN);
			condition.setRelationship(ConditionRelationship.OR);
			condition.setBracketClose(1);
			if (Numbers.isNumeric(user)) {
				IApprovalRequestStep step;
				IApprovalRequestStep subStep;
				Integer userId = Integer.parseInt(user);
				OperationResult<ApprovalRequest> operationResult = new OperationResult<ApprovalRequest>();
				for (ApprovalRequest apItem : this.fetchApprovalRequest(criteria, token).getResultObjects()) {
					// 判断子步骤是否需要此用户审批
					for (int j = apItem.getApprovalRequestSteps().size() - 1; j >= 0; j--) {
						step = apItem.getApprovalRequestSteps().get(j);
						if (userId.compareTo(step.getStepOwner()) != 0) {
							for (int i = step.getApprovalRequestSubSteps().size() - 1; i >= 0; i--) {
								subStep = step.getApprovalRequestSubSteps().get(i);
								if (subStep.getStepStatus() != emApprovalStepStatus.PROCESSING) {
									step.getApprovalRequestSubSteps().remove(i);
								} else if (userId.compareTo(subStep.getStepOwner()) != 0) {
									step.getApprovalRequestSubSteps().remove(i);
								}
							}
							if (step.getApprovalRequestSubSteps().size() == 0) {
								apItem.getApprovalRequestSteps().remove(j);
							}
						}
					}
					if (apItem.getApprovalRequestSteps().size() > 0) {
						if (apItem.isDirty()) {
							apItem.markOld();
						}
						operationResult.addResultObjects(apItem);
					}
				}
				return operationResult;
			} else {
				return new OperationResult<ApprovalRequest>(this.fetchApprovalRequest(criteria));
			}
		} catch (Exception e) {
			return new OperationResult<ApprovalRequest>(e);
		}
	}

	@Override
	public IOperationResult<IApprovalRequest> fetchUserApprovalRequest(String user) {
		return new OperationResult<IApprovalRequest>(this.fetchUserApprovalRequest(user, this.getUserToken()));
	}

	@Override
	public OperationMessage approval(int apRequestId, int apStepId, emApprovalResult apResult, String judgment,
			String token) {
		try {
			this.setUserToken(token);
			Criteria criteria = new Criteria();
			criteria.setResultCount(1);
			ICondition condition = criteria.getConditions().create();
			condition.setAlias(ApprovalRequest.PROPERTY_OBJECTKEY);
			condition.setValue(apRequestId);
			boolean trans = this.beginTransaction();
			try (BORepositoryApprovalProcess boRepository = new BORepositoryApprovalProcess()) {
				boRepository.setTransaction(this.getTransaction());
				boRepository.setUserToken(OrganizationFactory.SYSTEM_USER);
				IOperationResult<IApprovalRequest> operationResult = boRepository.fetchApprovalRequest(criteria);
				if (operationResult.getError() != null) {
					throw operationResult.getError();
				}
				if (operationResult.getResultObjects().isEmpty()) {
					throw new Exception(I18N.prop("msg_ap_not_found_approval_request", apRequestId));
				}
				ApprovalProcess<?> approvalProcess = ApprovalFactory.createManager(this.getTransaction())
						.startProcess(operationResult.getResultObjects().firstOrDefault());
				if (approvalProcess == null) {
					throw new Exception(I18N.prop("msg_ap_not_found_approval_process", apRequestId));
				}
				approvalProcess.approval(apStepId, apResult, token, judgment);
				approvalProcess.save();
				if (trans) {
					this.commitTransaction();
				}
			} catch (Exception e) {
				if (trans) {
					this.rollbackTransaction();
				}
				throw e;
			}
			return new OperationMessage();
		} catch (Exception e) {
			Logger.log(e);
			return new OperationMessage(e);
		}
	}

}
