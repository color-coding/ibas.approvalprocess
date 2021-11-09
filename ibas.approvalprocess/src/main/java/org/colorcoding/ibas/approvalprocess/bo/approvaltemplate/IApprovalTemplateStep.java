package org.colorcoding.ibas.approvalprocess.bo.approvaltemplate;

import org.colorcoding.ibas.approvalprocess.data.emApprovalStepOwnerType;
import org.colorcoding.ibas.bobas.bo.IBOSimpleLine;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.emYesNo;

/**
 * 审批模板步骤 接口
 * 
 */
public interface IApprovalTemplateStep extends IBOSimpleLine {

	/**
	 * 获取-编号
	 * 
	 * @return 值
	 */
	Integer getObjectKey();

	/**
	 * 设置-编号
	 * 
	 * @param value 值
	 */
	void setObjectKey(Integer value);

	/**
	 * 获取-类型
	 * 
	 * @return 值
	 */
	String getObjectCode();

	/**
	 * 设置-类型
	 * 
	 * @param value 值
	 */
	void setObjectCode(String value);

	/**
	 * 获取-行号
	 * 
	 * @return 值
	 */
	Integer getLineId();

	/**
	 * 设置-行号
	 * 
	 * @param value 值
	 */
	void setLineId(Integer value);

	/**
	 * 获取-实例号（版本）
	 * 
	 * @return 值
	 */
	Integer getLogInst();

	/**
	 * 设置-实例号（版本）
	 * 
	 * @param value 值
	 */
	void setLogInst(Integer value);

	/**
	 * 获取-数据源
	 * 
	 * @return 值
	 */
	String getDataSource();

	/**
	 * 设置-数据源
	 * 
	 * @param value 值
	 */
	void setDataSource(String value);

	/**
	 * 获取-创建日期
	 * 
	 * @return 值
	 */
	DateTime getCreateDate();

	/**
	 * 设置-创建日期
	 * 
	 * @param value 值
	 */
	void setCreateDate(DateTime value);

	/**
	 * 获取-创建时间
	 * 
	 * @return 值
	 */
	Short getCreateTime();

	/**
	 * 设置-创建时间
	 * 
	 * @param value 值
	 */
	void setCreateTime(Short value);

	/**
	 * 获取-修改日期
	 * 
	 * @return 值
	 */
	DateTime getUpdateDate();

	/**
	 * 设置-修改日期
	 * 
	 * @param value 值
	 */
	void setUpdateDate(DateTime value);

	/**
	 * 获取-修改时间
	 * 
	 * @return 值
	 */
	Short getUpdateTime();

	/**
	 * 设置-修改时间
	 * 
	 * @param value 值
	 */
	void setUpdateTime(Short value);

	/**
	 * 获取-创建动作标识
	 * 
	 * @return 值
	 */
	String getCreateActionId();

	/**
	 * 设置-创建动作标识
	 * 
	 * @param value 值
	 */
	void setCreateActionId(String value);

	/**
	 * 获取-更新动作标识
	 * 
	 * @return 值
	 */
	String getUpdateActionId();

	/**
	 * 设置-更新动作标识
	 * 
	 * @param value 值
	 */
	void setUpdateActionId(String value);

	/**
	 * 获取-创建用户
	 * 
	 * @return 值
	 */
	Integer getCreateUserSign();

	/**
	 * 设置-创建用户
	 * 
	 * @param value 值
	 */
	void setCreateUserSign(Integer value);

	/**
	 * 获取-修改用户
	 * 
	 * @return 值
	 */
	Integer getUpdateUserSign();

	/**
	 * 设置-修改用户
	 * 
	 * @param value 值
	 */
	void setUpdateUserSign(Integer value);

	/**
	 * 获取-备注
	 * 
	 * @return 值
	 */
	String getRemarks();

	/**
	 * 设置-备注
	 * 
	 * @param value 值
	 */
	void setRemarks(String value);

	/**
	 * 获取-步骤名称
	 * 
	 * @return 值
	 */
	String getStepName();

	/**
	 * 设置-步骤名称
	 * 
	 * @param value 值
	 */
	void setStepName(String value);

	/**
	 * 获取-步骤所有者类型
	 * 
	 * @return 值
	 */
	emApprovalStepOwnerType getStepOwnerType();

	/**
	 * 设置-步骤所有者类型
	 * 
	 * @param value 值
	 */
	void setStepOwnerType(emApprovalStepOwnerType value);

	/**
	 * 获取-步骤所有者
	 * 
	 * @return 值
	 */
	Integer getStepOwner();

	/**
	 * 设置-步骤所有者
	 * 
	 * @param value 值
	 */
	void setStepOwner(Integer value);

	/**
	 * 获取-步骤执行顺序
	 * 
	 * @return 值
	 */
	Integer getStepOrder();

	/**
	 * 设置-步骤执行顺序
	 * 
	 * @param value 值
	 */
	void setStepOrder(Integer value);

	/**
	 * 获取-步骤所有者可修改
	 * 
	 * @return 值
	 */
	emYesNo getStepCanModify();

	/**
	 * 设置-步骤所有者可修改
	 * 
	 * @param value 值
	 */
	void setStepCanModify(emYesNo value);

	/**
	 * 获取-审批模板步骤条件集合
	 * 
	 * @return 值
	 */
	IApprovalTemplateStepConditions getApprovalTemplateStepConditions();

	/**
	 * 设置-审批模板步骤条件集合
	 * 
	 * @param value 值
	 */
	void setApprovalTemplateStepConditions(IApprovalTemplateStepConditions value);

}
