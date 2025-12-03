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
	public OperationResult<ApprovalRequest> fetchUserApprovalRequest(String user, ICriteria uCriteria, String token) {
		try {
			this.setUserToken(token);
			ICondition condition = null;
			ICriteria criteria = new Criteria();
			// 额外条件
			int index = criteria.getConditions().size();
			if (uCriteria != null) {
				if (uCriteria.getResultCount() > 0) {
					criteria.setResultCount(uCriteria.getResultCount());
				}
				for (ICondition item : uCriteria.getConditions()) {
					criteria.getConditions().add(item);
				}
			}
			if (criteria.getConditions().isEmpty() && (uCriteria != null && uCriteria.getChildCriterias().isEmpty())) {
				// 激活的
				condition = criteria.getConditions().create();
				condition.setAlias(ApprovalRequest.PROPERTY_ACTIVATED.getName());
				condition.setValue(emYesNo.YES);
				// 审批中的
				condition = criteria.getConditions().create();
				condition.setAlias(ApprovalRequest.PROPERTY_APPROVALSTATUS.getName());
				condition.setValue(emApprovalStatus.PROCESSING);
			}
			// 排序
			if (uCriteria != null && !uCriteria.getSorts().isEmpty()) {
				for (ISort item : uCriteria.getSorts()) {
					criteria.getSorts().add(item);
				}
			} else {
				ISort sort = criteria.getSorts().create();
				sort.setAlias(ApprovalRequest.PROPERTY_STARTEDTIME.getName());
				sort.setSortType(SortType.ASCENDING);
			}
			// 子项查询
			IChildCriteria childCriteria = criteria.getChildCriterias().create();
			childCriteria.setOnlyHasChilds(true);
			childCriteria.setNoChilds(false);
			childCriteria.setPropertyPath(ApprovalRequest.PROPERTY_APPROVALREQUESTSTEPS.getName());
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
			index = childCriteria.getConditions().size();
			if (uCriteria != null) {
				for (IChildCriteria item : uCriteria.getChildCriterias()) {
					if (childCriteria.getPropertyPath().equalsIgnoreCase(item.getPropertyPath())) {
						for (ICondition cItem : item.getConditions()) {
							childCriteria.getConditions().add(cItem);
						}
					}
				}
			}
			if (childCriteria.getConditions().size() > index + 2) {
				condition = childCriteria.getConditions().get(index);
				condition.setBracketOpen(condition.getBracketOpen() + 1);
				condition = childCriteria.getConditions().lastOrDefault();
				condition.setBracketClose(condition.getBracketClose() + 1);
			}
			if (childCriteria.getConditions().size() == index) {
				// 使用默认条件，审批中的
				condition = childCriteria.getConditions().create();
				condition.setAlias(ApprovalRequestStep.PROPERTY_STEPSTATUS.getName());
				condition.setValue(emApprovalStepStatus.PROCESSING);
			}
			// 先用子项查询查子项
			ICriteria cCriteria = childCriteria.clone();
			cCriteria.setNoChilds(true);
			cCriteria.setResultCount(criteria.getResultCount());
			if (uCriteria != null && !uCriteria.getSorts().isEmpty()) {
				for (ISort item : uCriteria.getSorts()) {
					if (!ApprovalRequestStep.PROPERTY_OBJECTKEY.getName().equalsIgnoreCase(item.getAlias())) {
						continue;
					}
					cCriteria.getSorts().add(item);
				}
			} else {
				ISort sort = cCriteria.getSorts().create();
				sort.setAlias(ApprovalRequestStep.PROPERTY_OBJECTKEY.getName());
				sort.setSortType(SortType.DESCENDING);
			}

			index = criteria.getConditions().size();
			OperationResult<ApprovalRequestStep> opRsltStep = null;
			OperationResult<ApprovalRequest> operationResult = new OperationResult<ApprovalRequest>();
			do {
				if (opRsltStep != null) {
					// 第二次执行，则从上次结果后取值
					if (cCriteria.getConditions().size() > childCriteria.getConditions().size()) {
						condition = cCriteria.getConditions().lastOrDefault();
					} else {
						// 创建分页条件
						condition = cCriteria.getConditions().create();
						condition.setAlias(ApprovalRequestStep.PROPERTY_OBJECTKEY.getName());
						for (ISort item : cCriteria.getSorts()) {
							if (condition.getAlias().equalsIgnoreCase(item.getAlias())) {
								if (item.getSortType() == SortType.ASCENDING) {
									condition.setOperation(ConditionOperation.GRATER_THAN);
								} else {
									condition.setOperation(ConditionOperation.LESS_THAN);
								}
							}
						}
					}
					if (!condition.getAlias().equalsIgnoreCase(ApprovalRequestStep.PROPERTY_OBJECTKEY.getName())) {
						throw new IndexOutOfBoundsException();
					}
					condition.setValue(opRsltStep.getResultObjects().lastOrDefault().getObjectKey());
				}
				opRsltStep = this.fetch(ApprovalRequestStep.class, cCriteria, token);
				if (opRsltStep.getError() != null) {
					throw opRsltStep.getError();
				}
				// 子查询无结果，则退出
				if (opRsltStep.getResultObjects().isEmpty()) {
					break;
				}
				// 清理上次结果
				for (int i = criteria.getConditions().size() - 1; i >= index; i--) {
					criteria.getConditions().remove(i);
				}
				// 主编号条件并去重
				for (ApprovalRequestStep item : opRsltStep.getResultObjects()) {
					if (criteria.getConditions().lastOrDefault(
							c -> c.getAlias().equalsIgnoreCase(ApprovalRequest.PROPERTY_OBJECTKEY.getName())
									&& c.getValue().equalsIgnoreCase(item.getObjectKey().toString())) != null) {
						continue;
					}
					condition = criteria.getConditions().create();
					condition.setAlias(ApprovalRequest.PROPERTY_OBJECTKEY.getName());
					condition.setValue(item.getObjectKey());
					if (criteria.getConditions().size() > index + 1) {
						condition.setRelationship(ConditionRelationship.OR);
					}
				}
				if (criteria.getConditions().size() > index + 2) {
					condition = criteria.getConditions().get(index);
					condition.setBracketOpen(condition.getBracketOpen() + 1);
					condition = criteria.getConditions().lastOrDefault();
					condition.setBracketClose(condition.getBracketClose() + 1);
				}
				// 查询主对象，并记录有效的
				IApprovalRequestStep step;
				IApprovalRequestStep subStep;
				Integer userId = Numbers.isNumeric(user) ? Integer.parseInt(user) : -1;

				for (ApprovalRequest request : this.fetchApprovalRequest(criteria, token).getResultObjects()) {
					// 额外查询有效，未指定则仅保留待审批的
					if (userId > 0 && (uCriteria == null || uCriteria.getChildCriterias().isEmpty())) {
						// 判断子步骤是否需要此用户审批
						for (int j = request.getApprovalRequestSteps().size() - 1; j >= 0; j--) {
							step = request.getApprovalRequestSteps().get(j);
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
									request.getApprovalRequestSteps().remove(j);
								}
							}
						}
						if (request.getApprovalRequestSteps().size() > 0) {
							if (request.isDirty()) {
								request.markOld();
							}
							operationResult.addResultObjects(request);
						}
					} else {
						operationResult.addResultObjects(request);
					}
				}
			} while (operationResult.getResultObjects().size() < criteria.getResultCount());
			return operationResult;
		} catch (Exception e) {
			return new OperationResult<ApprovalRequest>(e);
		}
	}

	@Override
	public IOperationResult<IApprovalRequest> fetchUserApprovalRequest(String user, ICriteria criteria) {
		return new OperationResult<IApprovalRequest>(
				this.fetchUserApprovalRequest(user, criteria, this.getUserToken()));
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
				if (approvalProcess.getStatus() == emApprovalStatus.CANCELLED) {
					throw new Exception(I18N.prop("msg_ap_approval_process_invaild", apRequestId));
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
