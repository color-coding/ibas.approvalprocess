package org.colorcoding.ibas.approvalprocess.bo.approvaltemplate;

import org.colorcoding.ibas.bobas.bo.IBOSimple;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.emYesNo;

/**
 * 审批模板 接口
 * 
 */
public interface IApprovalTemplate extends IBOSimple {

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
	 * 获取-数据所属组织
	 * 
	 * @return 值
	 */
	String getOrganization();

	/**
	 * 设置-数据所属组织
	 * 
	 * @param value 值
	 */
	void setOrganization(String value);

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
	 * 获取-审批流程名称
	 * 
	 * @return 值
	 */
	String getName();

	/**
	 * 设置-审批流程名称
	 * 
	 * @param value 值
	 */
	void setName(String value);

	/**
	 * 获取-审批的对象类型
	 * 
	 * @return 值
	 */
	String getApprovalObjectCode();

	/**
	 * 设置-审批的对象类型
	 * 
	 * @param value 值
	 */
	void setApprovalObjectCode(String value);

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
	 * 获取-生效日期
	 * 
	 * @return 值
	 */
	DateTime getValidDate();

	/**
	 * 设置-生效日期
	 * 
	 * @param value 值
	 */
	void setValidDate(DateTime value);

	/**
	 * 获取-失效日期
	 * 
	 * @return 值
	 */
	DateTime getInvalidDate();

	/**
	 * 设置-失效日期
	 * 
	 * @param value 值
	 */
	void setInvalidDate(DateTime value);

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
	* 获取-可重入审批
	* 
	* @return 值
	*/
	emYesNo getReentrant();

	/**
	* 设置-可重入审批
	* 
	* @param value 值
	*/
	void setReentrant(emYesNo value);

	/**
	 * 获取-审批模板步骤集合
	 * 
	 * @return 值
	 */
	IApprovalTemplateSteps getApprovalTemplateSteps();

	/**
	 * 设置-审批模板步骤集合
	 * 
	 * @param value 值
	 */
	void setApprovalTemplateSteps(IApprovalTemplateSteps value);

}
