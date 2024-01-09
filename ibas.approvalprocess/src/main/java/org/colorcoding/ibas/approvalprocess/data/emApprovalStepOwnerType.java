package org.colorcoding.ibas.approvalprocess.data;

import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.approvalprocess.MyConfiguration;
import org.colorcoding.ibas.bobas.mapping.Value;

@XmlType(namespace = MyConfiguration.NAMESPACE_BO)
public enum emApprovalStepOwnerType {
	/**
	 * 指定用户
	 */
	@Value(value = "U")
	USER,
	/**
	 * 数据所有者
	 */
	@Value(value = "O")
	DATA_OWNER,
	/**
	 * 数据所属组织负责人
	 */
	@Value(value = "G")
	DATA_ORGANIZATION_MANAGER,
	/**
	 * 项目负责人
	 */
	@Value(value = "P")
	PROJECT_MANAGER,
	/**
	 * 项目所属组织负责人
	 */
	@Value(value = "R")
	PROJECT_ORGANIZATION_MANAGER;
}
