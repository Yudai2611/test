<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
	xmlns:geframe="http://www.kccs.co.jp/geframe/taglib"
	xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
	xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
	xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
	<jsp:directive.page contentType="text/html; charset=UTF-8" />
	<gp:includeview id="ConditionHistoryListView" viewclass="sample.ria.fqe.view.HistoryConditionView">
		<gr:zoomdialog id="ConditionHistoryListZoom" title="条件一覧画面" options="{width:1000, height:650}" style="display:none; padding-left: 31.2px; ">

			<gp:ajaxevent event="open" actionbean="sample.ria.fqe.action.HistoryConditionAction" actionmethod="searchHistory" mode="init" render="ConditionHistoryListFormRender"  indicator="submit-indicator" grzoomdialog="QueryConditionsHistoryListZoom" validate="none" form="ConditionHistoryListForm"/>
			<gp:ajaxrender id="ConditionHistoryListFormRender">
				<gp:form id="ConditionHistoryListForm" method="post" focus="datasourceLabelKeyword">
					<table class="condition" cellspacing="1">
						<tr class="row">
							<td class="label row left-aligned"><nobr>登録名</nobr></td>
							<td>
								<gp:text id="historyNameKeyword" styleclass="text history" maxlength="50" size="20" style="width: 261px;ime-mode: inactive;" label="登録名" >
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxByteLengthValidator" args="50"/>
								</gp:text>
							</td>
						</tr>
						<tr class="row">
							<td class="label left-aligned"><nobr>データソース名</nobr></td>
							<td>
								<gp:text id="datasourceLabelKeyword" styleclass="text history" maxlength="50" size="20" style="width: 261px;ime-mode: inactive;" label="データソース名" >
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxByteLengthValidator" args="50"/>
								</gp:text>
							</td>
						</tr>
						<tr class="row">
							<td class="label row left-aligned"><nobr>登録者</nobr></td>
							<td>
								<gp:text id="savedByKeyword" styleclass="text history" maxlength="20" size="20" style="width: 263px;ime-mode: inactive;" label="登録者">
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxByteLengthValidator" args="20"/>
								</gp:text>
							</td>
						</tr>

					</table>
					<br />
					<gp:ajaxrender id="ConditionHistoryListRender">
						<gp:button id="ZDHSearch"  value="検索" accesskey="S" styleclass="function-btn">
							<gp:ajaxevent event="click" actionbean="sample.ria.fqe.action.HistoryConditionAction" actionmethod="searchHistory" mode="search" render="ConditionHistoryListFormRender" indicator="submit-indicator" validate="none" />
						</gp:button>

						<gp:button id="ZDHDelete"  value="削除" accesskey="R" enabled="false" styleclass="function-btn" onclick="deleteConfirm();">
							<gp:functionevent func="deleteConfirm();" event="click" />
						</gp:button>
						<gp:button id="ZDHClose" value="閉じる" accesskey="X" styleclass="function-btn" >
							<gr:zoomcloseevent element="ConditionHistoryListZoom" event="click"/>
						</gp:button>

						<gp:list id="historyConditionList" listsize="10" style="width: 100%; table-layout: fixed;">
							<gp:listcaption>
							<gp:listpager id="ZDHPager" previous="ZDHPager.Previous" next="ZDHPager.Next" listelement="historyConditionList" style="display:block;text-align:right;" >
							<gp:button id="ZDHPager.Previous"   value="&lt;" title="前ページへ"  >
								<gp:ajaxevent event="click" actionbean="sample.ria.fqe.action.HistoryConditionAction" actionmethod="searchHistory" mode="previous" render="ConditionHistoryListRender" />
							</gp:button>
							<gp:button id="ZDHPager.Next"  value="&gt;" title="次ページへ">
								<gp:ajaxevent event="click" actionbean="sample.ria.fqe.action.HistoryConditionAction" actionmethod="searchHistory" mode="next" render="ConditionHistoryListRender"  />
							</gp:button>
							<div style="display: inline-block; width: 90px; margin-left: 10px;">
							<gp:listcountlabel id="ConditionHistoryListCount" listelement="historyConditionList" />
							</div>
						</gp:listpager>
							</gp:listcaption>

							<gp:listheader id="HistoryHeader" styleclass="row" style="text-align: center;">
								<gp:listheaderline >
									<gp:listheadercell id="DeleteFG_H" style="width: 21px">
										<gp:checkbox id="DeleteFG" onclick="toggleAllCheck('historyConditionList',this); setDeleteBtnState('historyConditionList', 'ZDHDelete');" />
									</gp:listheadercell>
									<gp:listheadercell id="ConditionsName_H" style="width: 35%;">登録名</gp:listheadercell>
									<gp:listheadercell id="DataSourceName_H" style="width: 35%;">データソース名</gp:listheadercell>
									<gp:listheadercell id="SavedUser_H" style="width: 10%;">登録者</gp:listheadercell>
									<gp:listheadercell id="SavedAt_H" style="width: 20%;">登録日</gp:listheadercell>
								</gp:listheaderline>
							</gp:listheader>
							<gp:listrow id="HistoryRow" styleclass="row" >
								<gp:listrowline>
									<gp:listrowcell id="DeleteFG_C">
										<gp:checkbox id="DeleteFG" onclick="setDeleteBtnState('historyConditionList', 'ZDHDelete');" />
									</gp:listrowcell>
									<gp:listrowcell id="ConditionsName_C">
										<gp:linkedlabel id="historyName">
											<gp:submitevent event="click" actionbean="sample.ria.fqe.action.HistoryConditionAction" actionmethod="selectHistory" forward="dataexport.jsp" mode="select" indicator="DefinitionNameIndicator" />
										</gp:linkedlabel>
										<gp:hidden id="historyId"/>
									</gp:listrowcell>
									<gp:listrowcell id="DataSourceName_C">
										<gp:label id="datasourceLabel"/>
									</gp:listrowcell>
									<gp:listrowcell id="SavedUser_C">
										<gp:label id="savedBy"/>
									</gp:listrowcell>
									<gp:listrowcell id="SavedAt_C">
                                        <gp:label id="savedAt"/>
                                    </gp:listrowcell>
								</gp:listrowline>
							</gp:listrow>
						</gp:list>
					</gp:ajaxrender>
				</gp:form>
			</gp:ajaxrender>
		</gr:zoomdialog>
	</gp:includeview>
</jsp:root>
