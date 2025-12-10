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
import org.colorcoding.ibas.approvalprocess.data.emApprovalStepOwnerType;
import org.colorcoding.ibas.approvalprocess.repository.BORepositoryApprovalProcess;
import org.colorcoding.ibas.bobas.approval.ApprovalException;
import org.colorcoding.ibas.bobas.approval.IApprovalData;
import org.colorcoding.ibas.bobas.approval.IApprovalProcessStepItem;
import org.colorcoding.ibas.bobas.bo.BOFactory;
import org.colorcoding.ibas.bobas.bo.IBOStorageTag;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.Strings;
import org.colorcoding.ibas.bobas.core.fields.IFieldData;
import org.colorcoding.ibas.bobas.core.fields.IManagedFields;
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
public class ApprovalProcess extends org.colorcoding.ibas.bobas.approval.ApprovalProcess<IApprovalRequest> {

	public ApprovalProcess(IApprovalRequest processData) {
		super(processData);
	}

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
		aq.setReentrant(template.getReentrant());
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
		return new ApprovalProcess(aq);
	}

	/**
	 * 状态发生变化时调用
	 * 
	 * @param value 当前状态
	 */
	@Override
	protected void changeApprovalDataStatus(emApprovalStatus status) {
		super.changeApprovalDataStatus(status);
		if (status == emApprovalStatus.RETURNED || status == emApprovalStatus.CANCELLED) {
			// 退回时，审批流程不激活
			if (this.getProcessData().getActivated() != emYesNo.NO) {
				this.getProcessData().setActivated(emYesNo.NO);
			}
		} else {
			// 其他情况，审批为激活状态
			if (this.getProcessData().getActivated() != emYesNo.YES) {
				this.getProcessData().setActivated(emYesNo.YES);
			}
		}
	}

	private ApprovalProcessStep[] processSteps;

	@Override
	public ApprovalProcessStep[] getProcessSteps() {
		if (this.processSteps == null && this.getProcessData() != null) {
			ApprovalProcessStep[] steps = new ApprovalProcessStep[this.getProcessData().getApprovalRequestSteps()
					.size()];
			for (int i = 0; i < steps.length; i++) {
				IApprovalRequestStep item = this.getProcessData().getApprovalRequestSteps().get(i);
				if (Strings.isNullOrEmpty(item.getStepOwners()) && item.getStepOwner() != 0) {
					// 单用户审批
					steps[i] = new ApprovalProcessStep(item);
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
	protected IApprovalData fetchApprovalData() throws ApprovalException {
		if (this.getProcessData() != null && !Strings.isNullOrEmpty(this.getProcessData().getClassName())) {
			// 加载类
			Class<?> type = BOFactory.loadClass(this.getProcessData().getClassName());
			// 注册类
			BOFactory.register(this.getApprovalData().getObjectCode(), type);
		}
		return super.fetchApprovalData();
	}

	@Override
	public void save() throws ApprovalException {
		if (this.getProcessData().isNew()) {
			// 保存检索值
			this.getProcessData().setBOKeys(this.getApprovalData().getIdentifiers());
			// 保存对象语言类型
			this.getProcessData().setClassName(this.getApprovalData().getClass().getName());
		}
		if (!this.getApprovalData().isDeleted() && this.getApprovalData() instanceof IBOStorageTag) {
			IBOStorageTag boTag = (IBOStorageTag) this.getApprovalData();
			// 新版业务对象，更新摘要
			if (this.getApprovalData().isNew() || boTag.getLogInst() > this.getProcessData().getBOInst()) {
				ICriteria criteria = new Criteria();
				criteria.setResultCount(1);
				criteria.setNoChilds(true);
				ICondition condition = criteria.getConditions().create();
				condition.setAlias(ApprovalTemplate.PROPERTY_OBJECTKEY.getName());
				condition.setValue(this.getProcessData().getApprovalTemplate());
				try (BORepositoryApprovalProcess apRepository = new BORepositoryApprovalProcess()) {
					apRepository.setTransaction(this.getTransaction());
					IOperationResult<IApprovalTemplate> opRslt = apRepository.fetchApprovalTemplate(criteria);
					if (!opRslt.getResultObjects().isEmpty()) {
						String summary = opRslt.getResultObjects().firstOrDefault().getSummary();
						if (!Strings.isNullOrEmpty(summary)) {
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
								this.getProcessData().setSummary(summary);
							}
						}
					}
				}
			}
			// 设置版本号
			this.getProcessData().setBOInst(boTag.getLogInst());
		}
		// 修正步骤所有者
		for (IApprovalRequestStep step : this.getProcessData().getApprovalRequestSteps()) {
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
		super.save();
	}

	protected Integer getStepOwner(Integer sign) throws ApprovalException {
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
				if (!Strings.isNullOrEmpty(condition.getValue())) {
					try (BORepositoryInitialFantasy ifRepository = new BORepositoryInitialFantasy()) {
						ifRepository.setTransaction(this.getTransaction());
						IOperationResult<IOrganization> opRsltOrg = ifRepository.fetchOrganization(criteria);
						if (!opRsltOrg.getResultObjects().isEmpty()) {
							return opRsltOrg.getResultObjects().firstOrDefault().getDataOwner();
						}
					}
				}
			}
		} else if (value == emApprovalStepOwnerType.PROJECT_MANAGER.ordinal()) {
			if (this.getApprovalData() instanceof IProjectData) {
				// 查询项目经理
				IProjectData projectData = (IProjectData) this.getApprovalData();
				if (!Strings.isNullOrEmpty(projectData.getProject())) {
					ICriteria criteria = new Criteria();
					criteria.setResultCount(1);
					ICondition condition = criteria.getConditions().create();
					condition.setAlias(Project.PROPERTY_CODE.getName());
					condition.setValue(projectData.getProject());
					if (!Strings.isNullOrEmpty(condition.getValue())) {
						try (BORepositoryAccounting acRepository = new BORepositoryAccounting()) {
							acRepository.setTransaction(this.getTransaction());
							IOperationResult<IProject> opRsltPrj = acRepository.fetchProject(criteria);
							if (!opRsltPrj.getResultObjects().isEmpty()) {
								return opRsltPrj.getResultObjects().firstOrDefault().getManager();
							}
						}
					}
				}
			}
		} else if (value == emApprovalStepOwnerType.PROJECT_ORGANIZATION_MANAGER.ordinal()) {
			if (this.getApprovalData() instanceof IProjectData) {
				// 查询项目所属组织负责人
				IProjectData projectData = (IProjectData) this.getApprovalData();
				if (!Strings.isNullOrEmpty(projectData.getProject())) {
					ICriteria criteria = new Criteria();
					criteria.setResultCount(1);
					ICondition condition = criteria.getConditions().create();
					condition.setAlias(Project.PROPERTY_CODE.getName());
					condition.setValue(projectData.getProject());
					if (!Strings.isNullOrEmpty(condition.getValue())) {
						try (BORepositoryAccounting acRepository = new BORepositoryAccounting()) {
							acRepository.setTransaction(this.getTransaction());
							IOperationResult<IProject> opRsltPrj = acRepository.fetchProject(criteria);
							if (!opRsltPrj.getResultObjects().isEmpty()) {
								criteria = new Criteria();
								criteria.setResultCount(1);
								condition = criteria.getConditions().create();
								condition.setAlias(Organization.PROPERTY_CODE.getName());
								condition.setValue(opRsltPrj.getResultObjects().firstOrDefault().getOrganization());
								if (!Strings.isNullOrEmpty(condition.getValue())) {
									try (BORepositoryInitialFantasy ifRepository = new BORepositoryInitialFantasy()) {
										ifRepository.setTransaction(this.getTransaction());
										IOperationResult<IOrganization> opRsltOrg = ifRepository
												.fetchOrganization(criteria);
										if (!opRsltOrg.getResultObjects().isEmpty()) {
											return opRsltOrg.getResultObjects().firstOrDefault().getDataOwner();
										}
									}
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
	public void checkToSave(IUser user) throws ApprovalException {
		// 超级用户允许修改审批数据
		if (user instanceof User) {
			User sUser = (User) user;
			if (sUser.isSuper()) {
				return;
			}
		}
		// 审批新建状态，可修改数据
		if (this.getProcessData().isNew()) {
			return;
		}
		// 步骤是否设置可修改
		if (Integer.compare(this.getOwner().getId(), user.getId()) != 0) {
			// 修改用户不是数据所有者时
			ApprovalProcessStep tmpStep = (ApprovalProcessStep) this.currentStep();
			if (tmpStep instanceof ApprovalProcessStepMultiOwner) {
				// 多用户步骤
				ApprovalProcessStepMultiOwner curStep = (ApprovalProcessStepMultiOwner) tmpStep;
				if (curStep.isCanModify()) {
					ApprovalProcessStepItem tmpItem;
					for (IApprovalProcessStepItem itemStep : curStep.getItems()) {
						if (itemStep instanceof ApprovalProcessStepItem) {
							tmpItem = (ApprovalProcessStepItem) itemStep;
							if (tmpItem.getOwner() != null && tmpItem.getOwner().equals(user)) {
								// 审批步骤允许此用户编辑
								return;
							}
						}
					}
				}
			} else if (!(tmpStep instanceof ApprovalProcessStepItem)) {
				// 单用户审批步骤
				ApprovalProcessStep curStep = (ApprovalProcessStep) tmpStep;
				if (curStep != null && curStep.getOwner() != null) {
					if (curStep.isCanModify() && curStep.getOwner().equals(user)) {
						// 审批步骤允许此用户编辑
						return;
					}
				}
			}
		}
		super.checkToSave(user);
	}
}
