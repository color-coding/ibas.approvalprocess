package org.colorcoding.ibas.approvalprocess.bo.approvalrequest;

import org.colorcoding.ibas.bobas.bo.IBOSimple;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.emApprovalStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;

/**
 * 审批记录 接口
 * 
 */
public interface IApprovalRequest extends IBOSimple {

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
	 * 获取-服务系列
	 * 
	 * @return 值
	 */
	Integer getSeries();

	/**
	 * 设置-服务系列
	 * 
	 * @param value 值
	 */
	void setSeries(Integer value);

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
	 * 获取-数据所有者
	 * 
	 * @return 值
	 */
	Integer getDataOwner();

	/**
	 * 设置-数据所有者
	 * 
	 * @param value 值
	 */
	void setDataOwner(Integer value);

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
	 * 获取-审批请求名称
	 * 
	 * @return 值
	 */
	String getName();

	/**
	 * 设置-审批请求名称
	 * 
	 * @param value 值
	 */
	void setName(String value);

	/**
	 * 获取-激活的
	 * 
	 * @return 值
	 */
	emYesNo getActivated();

	/**
	 * 设置-激活的
	 * 
	 * @param value 值
	 */
	void setActivated(emYesNo value);

	/**
	 * 获取-审批对象类型
	 * 
	 * @return 值
	 */
	String getApprovalObjectCode();

	/**
	 * 设置-审批对象类型
	 * 
	 * @param value 值
	 */
	void setApprovalObjectCode(String value);

	/**
	 * 获取-审批模板
	 * 
	 * @return 值
	 */
	Integer getApprovalTemplate();

	/**
	 * 设置-审批模板
	 * 
	 * @param value 值
	 */
	void setApprovalTemplate(Integer value);

	/**
	 * 获取-审批状态
	 * 
	 * @return 值
	 */
	emApprovalStatus getApprovalStatus();

	/**
	 * 设置-审批状态
	 * 
	 * @param value 值
	 */
	void setApprovalStatus(emApprovalStatus value);

	/**
	 * 获取-审批所有者
	 * 
	 * @return 值
	 */
	Integer getApprovalOwner();

	/**
	 * 设置-审批所有者
	 * 
	 * @param value 值
	 */
	void setApprovalOwner(Integer value);

	/**
	 * 获取-业务对象标识
	 * 
	 * @return 值
	 */
	String getBOKeys();

	/**
	 * 设置-业务对象标识
	 * 
	 * @param value 值
	 */
	void setBOKeys(String value);

	/**
	 * 获取-审批摘要
	 * 
	 * @return 值
	 */
	String getSummary();

	/**
	 * 设置-审批摘要
	 * 
	 * @param value 值
	 */
	void setSummary(String value);

	/**
	 * 获取-开始时间
	 * 
	 * @return 值
	 */
	DateTime getStartedTime();

	/**
	 * 设置-开始时间
	 * 
	 * @param value 值
	 */
	void setStartedTime(DateTime value);

	/**
	 * 获取-结束时间
	 * 
	 * @return 值
	 */
	DateTime getFinishedTime();

	/**
	 * 设置-结束时间
	 * 
	 * @param value 值
	 */
	void setFinishedTime(DateTime value);

	/**
	 * 获取-语言类型
	 * 
	 * @return 值
	 */
	String getClassName();

	/**
	 * 设置-语言类型
	 * 
	 * @param value 值
	 */
	void setClassName(String value);

	/**
	 * 获取-审批请求步骤集合
	 * 
	 * @return 值
	 */
	IApprovalRequestSteps getApprovalRequestSteps();

	/**
	 * 设置-审批请求步骤集合
	 * 
	 * @param value 值
	 */
	void setApprovalRequestSteps(IApprovalRequestSteps value);

}
