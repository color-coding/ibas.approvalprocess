package org.colorcoding.ibas.approvalprocess.bo.approvalrequest;

import jakarta.xml.bind.annotation.XmlSeeAlso;
import jakarta.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.approvalprocess.MyConfiguration;
import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ConditionOperation;
import org.colorcoding.ibas.bobas.common.ConditionRelationship;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;

/**
 * 审批请求步骤 集合
 */
@XmlType(name = ApprovalRequestSteps.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ ApprovalRequestStep.class })
public class ApprovalRequestSteps extends BusinessObjects<IApprovalRequestStep, IApprovalRequest>
		implements IApprovalRequestSteps {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "ApprovalRequestSteps";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = 3813998762277190536L;

	/**
	 * 构造方法
	 */
	public ApprovalRequestSteps() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public ApprovalRequestSteps(IApprovalRequest parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return ApprovalRequestStep.class;
	}

	/**
	 * 创建审批请求步骤
	 * 
	 * @return 审批请求步骤
	 */
	public IApprovalRequestStep create() {
		IApprovalRequestStep item = new ApprovalRequestStep();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(IApprovalRequestStep item) {
		super.afterAddItem(item);
		item.setParentId(0);
	}

	@Override
	public ICriteria getElementCriteria() {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(ApprovalRequestStep.PROPERTY_OBJECTKEY.getName());
		condition.setValue(this.getParent().getObjectKey());
		condition = criteria.getConditions().create();
		condition.setAlias(ApprovalRequestStep.PROPERTY_PARENTID.getName());
		condition.setValue(0);
		condition.setBracketOpen(1);
		condition = criteria.getConditions().create();
		condition.setAlias(ApprovalRequestStep.PROPERTY_PARENTID.getName());
		condition.setOperation(ConditionOperation.IS_NULL);
		condition.setRelationship(ConditionRelationship.OR);
		condition.setBracketClose(1);
		return criteria;
	}
}
