package org.colorcoding.ibas.approvalprocess.data;

import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.approvalprocess.MyConfiguration;
import org.colorcoding.ibas.bobas.mapping.Value;

/**
 * 审批条件比较类型
 * 
 * @author Niuren.Zhu
 * 
 */
@XmlType(namespace = MyConfiguration.NAMESPACE_BO)
public enum emApprovalConditionType {
	/**
	 * 对象属性值
	 */
	@Value(value = "P")
	PROPERTY_VALUE,
	/**
	 * SQL脚本
	 */
	@Value(value = "S")
	SQL_SCRIPT;
}
