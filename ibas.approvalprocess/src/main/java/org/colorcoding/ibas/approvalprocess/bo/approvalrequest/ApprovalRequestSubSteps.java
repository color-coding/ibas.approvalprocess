package org.colorcoding.ibas.approvalprocess.bo.approvalrequest;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.approvalprocess.MyConfiguration;
import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.bo.IBOLine;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;

/**
 * 审批请求步骤 集合
 */
@XmlType(name = ApprovalRequestSubSteps.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ ApprovalRequestStep.class })
public class ApprovalRequestSubSteps extends BusinessObjects<IApprovalRequestStep, IApprovalRequestStep>
		implements IApprovalRequestSubSteps {

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -6315689108426122282L;
	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "ApprovalRequestSteps";

	/**
	 * 构造方法
	 */
	public ApprovalRequestSubSteps() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public ApprovalRequestSubSteps(IApprovalRequestStep parent) {
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
		item.setParentId(this.getParent().getLineId());
	}

	@Override
	public ICriteria getElementCriteria() {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(ApprovalRequestStep.PROPERTY_OBJECTKEY.getName());
		condition.setValue(this.getParent().getObjectKey());
		condition = criteria.getConditions().create();
		condition.setAlias(ApprovalRequestStep.PROPERTY_PARENTID.getName());
		condition.setValue(this.getParent().getLineId());
		return criteria;
	}

	@Override
	protected void onParentPropertyChanged(PropertyChangeEvent arg0) {
		super.onParentPropertyChanged(arg0);
		if (arg0.getPropertyName().equals(IBOLine.SECONDARY_PRIMARY_KEY_NAME)) {
			for (IApprovalRequestStep item : this) {
				item.setParentId(this.getParent().getLineId());
			}
		}

	}
}
