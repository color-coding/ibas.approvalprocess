package org.colorcoding.ibas.bobas.approval.initial;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.colorcoding.ibas.accounting.bo.project.IProject;
import org.colorcoding.ibas.accounting.bo.project.Project;
import org.colorcoding.ibas.accounting.data.IProjectData;
import org.colorcoding.ibas.accounting.repository.BORepositoryAccounting;
import org.colorcoding.ibas.approvalprocess.MyConfiguration;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequestStep;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequestStep;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.ApprovalTemplate;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.IApprovalTemplate;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.IApprovalTemplateStep;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.IApprovalTemplateStepOwner;
import org.colorcoding.ibas.approvalprocess.data.DataConvert;
import org.colorcoding.ibas.approvalprocess.data.emApprovalStepOwnerType;
import org.colorcoding.ibas.approvalprocess.repository.BORepositoryApprovalProcess;
import org.colorcoding.ibas.bobas.approval.ApprovalDataProxy;
import org.colorcoding.ibas.bobas.approval.ApprovalProcessException;
import org.colorcoding.ibas.bobas.approval.IApprovalData;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStep;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepItem;
import org.colorcoding.ibas.bobas.bo.IBOStorageTag;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.core.BOFactory;
import org.colorcoding.ibas.bobas.core.fields.IFieldData;
import org.colorcoding.ibas.bobas.core.fields.IManagedFields;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.emApprovalStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.organization.IUser;
import org.colorcoding.ibas.bobas.ownership.IDataOwnership;
import org.colorcoding.ibas.initialfantasy.bo.organization.IOrganization;
import org.colorcoding.ibas.initialfantasy.bo.organization.Organization;
import org.colorcoding.ibas.initialfantasy.bo.shell.User;
import org.colorcoding.ibas.initialfantasy.repository.BORepositoryInitialFantasy;

/**
 * 审批流程
 * 
 * @author Niuren.Zhu
 *
 */
public class ApprovalProcess extends org.colorcoding.ibas.bobas.approval.ApprovalProcess {
	/**
	 * 步骤所有者类型组，-1000
	 */
	public static final int STEP_OWNER_TYPE_GROUP = -1000;

	public static ApprovalProcess create(IApprovalTemplate template) throws RuntimeException {
		ApprovalRequest aq = new ApprovalRequest();
		aq.setApprovalTemplate(template.getObjectKey());
		aq.setApprovalObjectCode(template.getApprovalObjectCode());
		aq.setName(template.getName());
		aq.setSummary(template.getSummary());
		for (IApprovalTemplateStep item : template.getApprovalTemplateSteps()) {
			ApprovalRequestStep aqStep = new ApprovalRequestStep();
			aqStep.setStepOrder(item.getStepOrder());
			aqStep.setStepName(item.getStepName());
			aqStep.setStepCanModify(item.getStepCanModify());
			aqStep.setStepConditions(ApprovalProcessStepCondition.serialize(item.getApprovalTemplateStepConditions()));
			if (item.getApprovalTemplateStepOwners().size() == 1) {
				// 单所有者
				IApprovalTemplateStepOwner owner = item.getApprovalTemplateStepOwners().firstOrDefault();
				if (owner.getStepOwnerType() == emApprovalStepOwnerType.USER) {
					// 明确用户，指定用户
					aqStep.setStepOwner(owner.getStepOwner());
				} else {
					// 非明确用户指向类型的反值
					aqStep.setStepOwner(STEP_OWNER_TYPE_GROUP - owner.getStepOwnerType().ordinal());
				}
			} else {
				// 多所有者
				aqStep.setApproversRequired(item.getApproversRequired());
				IApprovalRequestStep stepItem = null;
				for (IApprovalTemplateStepOwner owner : item.getApprovalTemplateStepOwners()) {
					stepItem = aqStep.getApprovalRequestSubSteps().create();
					if (owner.getStepOwnerType() == emApprovalStepOwnerType.USER) {
						// 明确用户，指定用户
						stepItem.setStepOwner(owner.getStepOwner());
					} else {
						// 非明确用户指向类型的反值
						stepItem.setStepOwner(STEP_OWNER_TYPE_GROUP - owner.getStepOwnerType().ordinal());
					}
				}
			}
			aq.getApprovalRequestSteps().add(aqStep);
		}
		return create(aq);
	}

	public static ApprovalProcess create(IApprovalRequest aq) {
		if (aq == null) {
			return null;
		}
		return new ApprovalProcess(aq);
	}

	public ApprovalProcess() {
	}

	public ApprovalProcess(IApprovalRequest approvalRequest) {
		this();
		this.setApprovalRequest(approvalRequest);
	}

	private IApprovalRequest approvalRequest;

	public IApprovalRequest getApprovalRequest() {
		return approvalRequest;
	}

	public void setApprovalRequest(IApprovalRequest approvalRequest) {
		this.approvalRequest = approvalRequest;
		// 设置代理数据
		ApprovalDataProxy data = new ApprovalDataProxy();
		data.setApprovalStatus(approvalRequest.getApprovalStatus());
		data.setDataOwner(approvalRequest.getApprovalOwner());
		data.setIdentifiers(approvalRequest.getBOKeys());
		data.setObjectCode(approvalRequest.getApprovalObjectCode());
		data.markOld();// 标记状态
		this.approvalData = data;
	}

	private IApprovalData approvalData;

	/**
	 * 审批数据
	 */
	@Override
	public IApprovalData getApprovalData() {
		return this.approvalData;
	}

	@Override
	public void setApprovalData(IApprovalData approvalData) {
		this.approvalData = approvalData;
	}

	@Override
	public boolean isNew() {
		if (this.getApprovalRequest() != null) {
			return this.getApprovalRequest().isNew();
		}
		return false;
	}

	@Override
	public String getName() {
		return this.getApprovalRequest().getName();
	}

	@Override
	public emApprovalStatus getStatus() {
		return this.getApprovalRequest().getApprovalStatus();
	}

	@Override
	protected void setStatus(emApprovalStatus value) {
		this.getApprovalRequest().setApprovalStatus(value);
	}

	@Override
	public DateTime getStartedTime() {
		return this.getApprovalRequest().getStartedTime();
	}

	@Override
	protected void setStartedTime(DateTime value) {
		this.getApprovalRequest().setStartedTime(value);
	}

	@Override
	public DateTime getFinishedTime() {
		return this.getApprovalRequest().getFinishedTime();
	}

	@Override
	protected void setFinishedTime(DateTime value) {
		this.getApprovalRequest().setFinishedTime(value);
	}

	/**
	 * 状态发生变化时调用
	 * 
	 * @param value 当前状态
	 */
	@Override
	protected void changeApprovalDataStatus(emApprovalStatus status) {
		super.changeApprovalDataStatus(status);
		if (status == emApprovalStatus.RETURNED) {
			// 退回时，审批流程不激活
			if (this.getApprovalRequest().getActivated() != emYesNo.NO) {
				this.getApprovalRequest().setActivated(emYesNo.NO);
			}
		} else {
			// 其他情况，审批为激活状态
			if (this.getApprovalRequest().getActivated() != emYesNo.YES) {
				this.getApprovalRequest().setActivated(emYesNo.YES);
			}
		}
	}

	private IApprovalProcessStep[] processSteps;

	@Override
	public IApprovalProcessStep[] getProcessSteps() {
		if (this.processSteps == null && this.getApprovalRequest() != null) {
			IApprovalProcessStep[] steps = new IApprovalProcessStep[this.getApprovalRequest().getApprovalRequestSteps()
					.size()];
			for (int i = 0; i < steps.length; i++) {
				IApprovalRequestStep item = this.getApprovalRequest().getApprovalRequestSteps().get(i);
				if (DataConvert.isNullOrEmpty(item.getStepOwners()) && item.getStepOwner() != 0) {
					// 单用户审批
					steps[i] = new ApprovalProcessStepSingleOwner(item);
				} else {
					// 多用户审批
					steps[i] = new ApprovalProcessStepMultiOwner(item);
				}
			}
			this.processSteps = steps;
		}
		return this.processSteps;
	}

	@Override
	public void saveProcess() throws ApprovalProcessException {
		try {
			if (this.getApprovalRequest().isNew()) {
				// 保存检索值
				this.getApprovalRequest().setBOKeys(this.getApprovalData().getIdentifiers());
				// 保存对象语言类型
				this.getApprovalRequest().setClassName(this.getApprovalData().getClass().getName());
				// 保存审批所有者
				this.getApprovalRequest().setApprovalOwner(this.getApprovalData().getDataOwner());
			}
			if (!this.getApprovalData().isDeleted() && this.getApprovalData() instanceof IBOStorageTag) {
				IBOStorageTag boTag = (IBOStorageTag) this.getApprovalData();
				// 新版业务对象，更新摘要
				if (this.getApprovalData().isNew() || boTag.getLogInst() > this.getApprovalRequest().getBOInst()) {
					ICriteria criteria = new Criteria();
					criteria.setResultCount(1);
					criteria.setNoChilds(true);
					ICondition condition = criteria.getConditions().create();
					condition.setAlias(ApprovalTemplate.PROPERTY_OBJECTKEY.getName());
					condition.setValue(this.getApprovalRequest().getApprovalTemplate());
					BORepositoryApprovalProcess apRepository = new BORepositoryApprovalProcess();
					apRepository.setRepository(this.getRepository());
					IOperationResult<IApprovalTemplate> opRslt = apRepository.fetchApprovalTemplate(criteria);
					if (!opRslt.getResultObjects().isEmpty()) {
						String summary = opRslt.getResultObjects().firstOrDefault().getSummary();
						if (!DataConvert.isNullOrEmpty(summary)) {
							// 替换摘要中的变量
							if (this.getApprovalData() instanceof IManagedFields) {
								IManagedFields boFields = (IManagedFields) this.getApprovalData();
								Matcher matcher = Pattern.compile(MyConfiguration.VARIABLE_PATTERN).matcher(summary);
								while (matcher.find()) {
									// 带格式名称${}
									String pName = matcher.group(0);
									IFieldData field = boFields.getField(pName.substring(2, pName.length() - 1));
									if (field != null) {
										summary = summary.replace(pName,
												String.valueOf(field.getValue() == null ? "" : field.getValue()));
									}
								}
								this.getApprovalRequest().setSummary(summary);
							}
						}
					}
				}
				// 设置版本号
				this.getApprovalRequest().setBOInst(boTag.getLogInst());
			}
			// 修正步骤所有者
			for (IApprovalRequestStep step : this.getApprovalRequest().getApprovalRequestSteps()) {
				if (step.getStepOwner() <= STEP_OWNER_TYPE_GROUP) {
					// 未明确步骤所有者
					step.setStepOwner(this.getStepOwner(step.getStepOwner()));
				}
				for (IApprovalRequestStep item : step.getApprovalRequestSubSteps()) {
					if (item.getStepOwner() <= STEP_OWNER_TYPE_GROUP) {
						// 未明确步骤所有者
						item.setStepOwner(this.getStepOwner(item.getStepOwner()));
					}
				}
			}
			BORepositoryApprovalProcess apRepository = new BORepositoryApprovalProcess();
			apRepository.setRefetchAfterSave(false);// 保存成功后，不重新获取副本
			apRepository.setRepository(this.getRepository());
			IOperationResult<IApprovalRequest> operationResult = apRepository
					.saveApprovalRequest(this.getApprovalRequest());
			if (operationResult.getError() != null) {
				throw operationResult.getError();
			}
		} catch (Exception e) {
			throw new ApprovalProcessException(e);
		}
	}

	protected Integer getStepOwner(Integer sign) throws ApprovalProcessException {
		// 未明确步骤所有者
		int value = Math.abs(sign - STEP_OWNER_TYPE_GROUP);
		if (value == emApprovalStepOwnerType.DATA_OWNER.ordinal()) {
			return this.getApprovalData().getDataOwner();
		} else if (value == emApprovalStepOwnerType.DATA_ORGANIZATION_MANAGER.ordinal()) {
			if (this.getApprovalData() instanceof IDataOwnership) {
				// 查询数据所属组织负责人
				IDataOwnership dataOwnership = (IDataOwnership) this.getApprovalData();
				ICriteria criteria = new Criteria();
				criteria.setResultCount(1);
				ICondition condition = criteria.getConditions().create();
				condition.setAlias(Organization.PROPERTY_CODE.getName());
				condition.setValue(dataOwnership.getOrganization());
				if (!DataConvert.isNullOrEmpty(condition.getValue())) {
					BORepositoryInitialFantasy ifRepository = new BORepositoryInitialFantasy();
					ifRepository.setRepository(this.getRepository());
					IOperationResult<IOrganization> opRsltOrg = ifRepository.fetchOrganization(criteria);
					if (!opRsltOrg.getResultObjects().isEmpty()) {
						return opRsltOrg.getResultObjects().firstOrDefault().getDataOwner();
					}
				}
			}
		} else if (value == emApprovalStepOwnerType.PROJECT_MANAGER.ordinal()) {
			if (this.getApprovalData() instanceof IProjectData) {
				// 查询项目经理
				IProjectData projectData = (IProjectData) this.getApprovalData();
				if (!DataConvert.isNullOrEmpty(projectData.getProject())) {
					ICriteria criteria = new Criteria();
					criteria.setResultCount(1);
					ICondition condition = criteria.getConditions().create();
					condition.setAlias(Project.PROPERTY_CODE.getName());
					condition.setValue(projectData.getProject());
					if (!DataConvert.isNullOrEmpty(condition.getValue())) {
						BORepositoryAccounting acRepository = new BORepositoryAccounting();
						acRepository.setRepository(this.getRepository());
						IOperationResult<IProject> opRsltPrj = acRepository.fetchProject(criteria);
						if (!opRsltPrj.getResultObjects().isEmpty()) {
							return opRsltPrj.getResultObjects().firstOrDefault().getManager();
						}
					}
				}
			}
		} else if (value == emApprovalStepOwnerType.PROJECT_ORGANIZATION_MANAGER.ordinal()) {
			if (this.getApprovalData() instanceof IProjectData) {
				// 查询项目所属组织负责人
				IProjectData projectData = (IProjectData) this.getApprovalData();
				if (!DataConvert.isNullOrEmpty(projectData.getProject())) {
					ICriteria criteria = new Criteria();
					criteria.setResultCount(1);
					ICondition condition = criteria.getConditions().create();
					condition.setAlias(Project.PROPERTY_CODE.getName());
					condition.setValue(projectData.getProject());
					if (!DataConvert.isNullOrEmpty(condition.getValue())) {
						BORepositoryAccounting acRepository = new BORepositoryAccounting();
						acRepository.setRepository(this.getRepository());
						IOperationResult<IProject> opRsltPrj = acRepository.fetchProject(criteria);
						if (!opRsltPrj.getResultObjects().isEmpty()) {
							criteria = new Criteria();
							criteria.setResultCount(1);
							condition = criteria.getConditions().create();
							condition.setAlias(Organization.PROPERTY_CODE.getName());
							condition.setValue(opRsltPrj.getResultObjects().firstOrDefault().getOrganization());
							if (!DataConvert.isNullOrEmpty(condition.getValue())) {
								BORepositoryInitialFantasy ifRepository = new BORepositoryInitialFantasy();
								ifRepository.setRepository(this.getRepository());
								IOperationResult<IOrganization> opRsltOrg = ifRepository.fetchOrganization(criteria);
								if (!opRsltOrg.getResultObjects().isEmpty()) {
									return opRsltOrg.getResultObjects().firstOrDefault().getDataOwner();
								}
							}
						}
					}
				}
			}
		}
		return sign;
	}

	@Override
	public void checkToSave(IUser user) throws ApprovalProcessException {
		// 超级用户允许修改审批数据
		if (user instanceof User) {
			User sUser = (User) user;
			if (sUser.isSuper()) {
				return;
			}
		}
		if (Integer.compare(this.getApprovalData().getDataOwner(), user.getId()) != 0) {
			// 修改用户不是数据所有者时
			IApprovalProcessStep tmpStep = this.currentStep();
			if (tmpStep instanceof ApprovalProcessStepSingleOwner) {
				// 单用户审批步骤
				ApprovalProcessStepSingleOwner curStep = (ApprovalProcessStepSingleOwner) tmpStep;
				if (curStep != null && curStep.getOwner() != null) {
					if (curStep.getApprovalRequestStep().getStepCanModify() == emYesNo.YES
							&& curStep.getOwner().equals(user)) {
						// 审批步骤允许此用户编辑
						return;
					}
				}
			} else if (tmpStep instanceof ApprovalProcessStepMultiOwner) {
				// 多用户步骤
				ApprovalProcessStepMultiOwner curStep = (ApprovalProcessStepMultiOwner) tmpStep;
				if (curStep.getApprovalRequestStep() != null
						&& curStep.getApprovalRequestStep().getStepCanModify() == emYesNo.YES) {
					for (IApprovalProcessStepItem itemStep : curStep.getItems()) {
						if (itemStep != null && itemStep.getOwner() != null && itemStep.getOwner().equals(user)) {
							// 审批步骤允许此用户编辑
							return;
						}
					}
				}
			}
		}
		super.checkToSave(user);
	}

	public void loadClasses() throws ClassNotFoundException {
		if (this.getApprovalRequest() == null) {
			return;
		}
		if (this.getApprovalRequest().getClassName() == null || this.getApprovalRequest().getClassName().isEmpty()) {
			return;
		}
		// 加载类
		Class<?> type = BOFactory.create().loadClass(this.getApprovalRequest().getClassName());
		BOFactory.create().register(this.getApprovalData().getObjectCode(), type);
	}

}
