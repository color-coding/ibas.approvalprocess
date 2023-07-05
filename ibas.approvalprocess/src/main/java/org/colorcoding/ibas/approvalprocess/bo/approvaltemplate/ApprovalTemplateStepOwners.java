package org.colorcoding.ibas.approvalprocess.bo.approvaltemplate;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.approvalprocess.MyConfiguration;
import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.bo.IBOLine;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.ISort;
import org.colorcoding.ibas.bobas.common.SortType;

/**
 * 审批模板步骤所有者 集合
 */
@XmlType(name = ApprovalTemplateStepOwners.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ ApprovalTemplateStepOwner.class })
public class ApprovalTemplateStepOwners extends BusinessObjects<IApprovalTemplateStepOwner, IApprovalTemplateStep>
		implements IApprovalTemplateStepOwners {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "ApprovalTemplateStepOwners";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -6089416143641872449L;

	/**
	 * 构造方法
	 */
	public ApprovalTemplateStepOwners() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public ApprovalTemplateStepOwners(IApprovalTemplateStep parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return ApprovalTemplateStepOwner.class;
	}

	/**
	 * 创建审批模板步骤所有者
	 * 
	 * @return 审批模板步骤所有者
	 */
	public IApprovalTemplateStepOwner create() {
		IApprovalTemplateStepOwner item = new ApprovalTemplateStepOwner();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(IApprovalTemplateStepOwner item) {
		super.afterAddItem(item);
		item.setStepLineId(this.getParent().getLineId());
	}

	@Override
	public ICriteria getElementCriteria() {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(ApprovalTemplateStepOwner.PROPERTY_OBJECTKEY.getName());
		condition.setValue(this.getParent().getObjectKey());
		condition = criteria.getConditions().create();
		condition.setAlias(ApprovalTemplateStepOwner.PROPERTY_STEPLINEID.getName());
		condition.setValue(this.getParent().getLineId());
		ISort sort = criteria.getSorts().create();
		sort.setAlias(ApprovalTemplateStepOwner.PROPERTY_OBJECTKEY.getName());
		sort.setSortType(SortType.ASCENDING);
		sort = criteria.getSorts().create();
		sort.setAlias(ApprovalTemplateStepOwner.PROPERTY_VISORDER.getName());
		sort.setSortType(SortType.ASCENDING);
		sort = criteria.getSorts().create();
		sort.setAlias(ApprovalTemplateStepOwner.PROPERTY_LINEID.getName());
		sort.setSortType(SortType.ASCENDING);
		return criteria;
	}

	@Override
	protected void onParentPropertyChanged(PropertyChangeEvent arg0) {
		super.onParentPropertyChanged(arg0);
		if (arg0.getPropertyName().equals(IBOLine.SECONDARY_PRIMARY_KEY_NAME)) {
			for (IApprovalTemplateStepOwner item : this) {
				item.setStepLineId(this.getParent().getLineId());
			}
		}

	}
}
