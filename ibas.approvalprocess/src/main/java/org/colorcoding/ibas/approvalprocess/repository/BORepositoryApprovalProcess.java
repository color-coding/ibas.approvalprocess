package org.colorcoding.ibas.approvalprocess.repository;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequestStep;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequestStep;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.ApprovalTemplate;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.IApprovalTemplate;
import org.colorcoding.ibas.approvalprocess.data.DataConvert;
import org.colorcoding.ibas.bobas.approval.IApprovalProcess;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStep;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepMultiOwner;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepSingleOwner;
import org.colorcoding.ibas.bobas.approval.initial.ApprovalProcess;
import org.colorcoding.ibas.bobas.approval.initial.ApprovalProcessManager;
import org.colorcoding.ibas.bobas.common.ConditionOperation;
import org.colorcoding.ibas.bobas.common.ConditionRelationship;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.ISort;
import org.colorcoding.ibas.bobas.common.OperationMessage;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.common.SortType;
import org.colorcoding.ibas.bobas.core.BORepositoryBase;
import org.colorcoding.ibas.bobas.core.IBORepository;
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
		return super.fetch(criteria, token, ApprovalTemplate.class);
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
	 * 查询-审批记录
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<ApprovalRequest> fetchApprovalRequest(ICriteria criteria, String token) {
		return super.fetch(criteria, token, ApprovalRequest.class);
	}

	/**
	 * 查询-审批记录（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<IApprovalRequest> fetchApprovalRequest(ICriteria criteria) {
		return new OperationResult<IApprovalRequest>(this.fetchApprovalRequest(criteria, this.getUserToken()));
	}

	/**
	 * 保存-审批记录
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<ApprovalRequest> saveApprovalRequest(ApprovalRequest bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-审批记录（提前设置用户口令）
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
			if (DataConvert.isNumeric(user)) {
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
		OperationMessage operationMessage = new OperationMessage();
		try {
			this.setUserToken(token);
			ApprovalProcessManager apManager = new ApprovalProcessManager();
			IApprovalProcess ap = apManager.loadApprovalProcess(apRequestId);
			if (ap == null) {
				throw new Exception(I18N.prop("msg_ap_not_exist_approval_request", apRequestId));
			}
			if (ap instanceof ApprovalProcess) {
				// 提前加载涉及的业务对象类型
				((ApprovalProcess) ap).loadClasses();
			}
			IBORepository repository = this.getRepository();
			if (repository instanceof BORepositoryBase) {
				repository = (IBORepository) ((BORepositoryBase) this.getRepository()).clone();
				repository.setCurrentUser(OrganizationFactory.SYSTEM_USER);
			}
			ap.setRepository(repository);
			ap.approval(apStepId, apResult, token, judgment);
			if (ap.getStatus() == emApprovalStatus.PROCESSING && apResult == emApprovalResult.APPROVED) {
				// 下个步骤，如果还是当前用户，则自动批准
				IApprovalProcessStep preStep = null;
				IApprovalProcessStep step = ap.currentStep();
				do {
					if (step instanceof IApprovalProcessStepSingleOwner) {
						// 单用户审批步骤
						IApprovalProcessStepSingleOwner sngSetp = (IApprovalProcessStepSingleOwner) step;
						if (sngSetp.getOwner() != this.getCurrentUser()) {
							break;
						}
						try {
							preStep = step;
							ap.approval(step.getId(), apResult, token, judgment);
							step = ap.currentStep();
						} catch (Exception e) {
							break;
						}
					} else if (step instanceof IApprovalProcessStepMultiOwner) {
						// 多用户审批步骤
						break;
					}
				} while (preStep != step && step != null);
			}
			ap.save();
		} catch (Exception e) {
			Logger.log(e);
			operationMessage.setError(e);
		}
		return operationMessage;
	}

}
