package org.colorcoding.ibas.bobas.approval.initial;

import java.util.Iterator;

import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.ApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvalrequest.IApprovalRequest;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.ApprovalTemplate;
import org.colorcoding.ibas.approvalprocess.bo.approvaltemplate.IApprovalTemplate;
import org.colorcoding.ibas.approvalprocess.repository.BORepositoryApprovalProcess;
import org.colorcoding.ibas.bobas.approval.ApprovalException;
import org.colorcoding.ibas.bobas.approval.IApprovalData;
import org.colorcoding.ibas.bobas.approval.IProcessData;
import org.colorcoding.ibas.bobas.common.ConditionOperation;
import org.colorcoding.ibas.bobas.common.ConditionRelationship;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.DateTimes;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.ISort;
import org.colorcoding.ibas.bobas.common.SortType;
import org.colorcoding.ibas.bobas.common.Strings;
import org.colorcoding.ibas.bobas.data.ArrayList;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.db.DbTransaction;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;

/**
 * 审批流程管理员
 * 
 * 需要在app.xml中配置 <add key="ApprovalWay" value="initial" />
 * 
 * @author Niuren.Zhu
 *
 */
public class ApprovalProcessManager extends org.colorcoding.ibas.bobas.approval.ApprovalProcessManager {

	@Override
	public IApprovalRequest loadProcessData(IApprovalData approvalData) throws ApprovalException {
		ICriteria criteria = new Criteria();
		criteria.setResultCount(1);
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(ApprovalRequest.PROPERTY_BOKEYS);
		condition.setValue(approvalData.getIdentifiers());
		condition = criteria.getConditions().create();
		condition.setRelationship(ConditionRelationship.AND);
		condition.setAlias(ApprovalRequest.PROPERTY_ACTIVATED.getName());
		condition.setValue(emYesNo.YES);
		// 先在缓存中查询
		if (this.getTransaction() instanceof DbTransaction) {
			DbTransaction transaction = (DbTransaction) this.getTransaction();
			try {
				IApprovalRequest[] datas = transaction.fetchInCache(IApprovalRequest.class, criteria);
				if (datas.length > 0) {
					return datas[0];
				}
			} catch (Exception e) {
				throw new ApprovalException(e);
			}
		}
		// 未找到则数据库查询
		try (BORepositoryApprovalProcess boRepository = new BORepositoryApprovalProcess()) {
			boRepository.setTransaction(this.getTransaction());
			boRepository.setUserToken(OrganizationFactory.SYSTEM_USER.getToken());
			IOperationResult<IApprovalRequest> operationResult = boRepository.fetchApprovalRequest(criteria);
			if (operationResult.getError() != null) {
				throw operationResult.getError();
			}
			return operationResult.getResultObjects().firstOrDefault();
		} catch (Exception e) {
			throw new ApprovalException(e);
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	protected ApprovalProcess createApprovalProcess(IProcessData approvalRequest) {
		return new ApprovalProcess((IApprovalRequest) approvalRequest);
	}

	@Override
	@SuppressWarnings("unchecked")
	public Iterator<ApprovalProcess> createApprovalProcess(String boCode) {
		if (Strings.isNullOrEmpty(boCode)) {
			return new ArrayList<ApprovalProcess>(0).iterator();
		}
		// 根据 boCode 查询审批流程模板 AT
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setBracketOpen(1);
		condition.setAlias(ApprovalTemplate.PROPERTY_APPROVALOBJECTCODE.getName());
		condition.setValue(boCode);
		condition = criteria.getConditions().create();
		condition.setRelationship(ConditionRelationship.AND);
		condition.setAlias(ApprovalTemplate.PROPERTY_ACTIVATED.getName());
		condition.setValue(emYesNo.YES);
		condition.setBracketClose(1);
		// 审模板的有效日期
		DateTime today = DateTimes.today();
		condition = criteria.getConditions().create();
		condition.setBracketOpen(1);
		condition.setAlias(ApprovalTemplate.PROPERTY_VALIDDATE.getName());
		condition.setOperation(ConditionOperation.IS_NULL);
		condition = criteria.getConditions().create();
		condition.setRelationship(ConditionRelationship.OR);
		condition.setBracketOpen(1);
		condition.setAlias(ApprovalTemplate.PROPERTY_VALIDDATE.getName());
		condition.setOperation(ConditionOperation.NOT_NULL);
		condition = criteria.getConditions().create();
		condition.setBracketClose(2);
		condition.setAlias(ApprovalTemplate.PROPERTY_VALIDDATE.getName());
		condition.setOperation(ConditionOperation.LESS_EQUAL);
		condition.setValue(today);
		// 失效日期
		condition = criteria.getConditions().create();
		condition.setBracketOpen(1);
		condition.setAlias(ApprovalTemplate.PROPERTY_INVALIDDATE.getName());
		condition.setOperation(ConditionOperation.IS_NULL);
		condition = criteria.getConditions().create();
		condition.setRelationship(ConditionRelationship.OR);
		condition.setBracketOpen(1);
		condition.setAlias(ApprovalTemplate.PROPERTY_INVALIDDATE.getName());
		condition.setOperation(ConditionOperation.NOT_NULL);
		condition = criteria.getConditions().create();
		condition.setBracketClose(2);
		condition.setAlias(ApprovalTemplate.PROPERTY_INVALIDDATE.getName());
		condition.setOperation(ConditionOperation.GRATER_EQUAL);
		condition.setValue(today);
		// 排序，最新优先
		ISort sort = criteria.getSorts().create();
		sort.setAlias(ApprovalTemplate.PROPERTY_OBJECTKEY.getName());
		sort.setSortType(SortType.DESCENDING);
		try (BORepositoryApprovalProcess boRepository = new BORepositoryApprovalProcess()) {
			// 新事务查询，避免锁表
			// boRepository.setTransaction(this.getTransaction());
			boRepository.setUserToken(OrganizationFactory.SYSTEM_USER.getToken());
			IOperationResult<IApprovalTemplate> operationResult = boRepository.fetchApprovalTemplate(criteria);
			if (operationResult.getError() != null) {
				Logger.log(operationResult.getError());
			}
			return new Iterator<ApprovalProcess>() {
				Iterator<IApprovalTemplate> tpltIteraor = operationResult.getResultObjects().iterator();

				@Override
				public boolean hasNext() {
					return this.tpltIteraor.hasNext();
				}

				@Override
				public ApprovalProcess next() {
					return ApprovalProcess.create(this.tpltIteraor.next());
				}
			};
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

}
