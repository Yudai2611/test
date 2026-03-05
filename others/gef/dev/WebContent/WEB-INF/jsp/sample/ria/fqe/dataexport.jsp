<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
	xmlns:geframe="http://www.kccs.co.jp/geframe/taglib"
	xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
	xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
	xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib"
	xmlns:gfqe="http://www.kccs.co.jp/geframe/fqe/ria/taglib">
	<jsp:directive.page contentType="text/html; charset=UTF-8" />
	<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
    <jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">]]></jsp:text>
	<gp:view viewclass="sample.ria.fqe.view.ExportView" scope="request">
		<gp:html version="XHTML 1.0 Transitional" xmlns:ghx="http://www.kccs.co.jp/2011/geframe/xhtml1-extension/XMLSchema">
		<head>
		<meta http-equiv="Expires" content="0" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Cache-Control" content="no-cache" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<title>データ出力画面</title>
		<gp:jspinclude id="header" page="/WEB-INF/jsp/sample/ria/common/header-ria-inc.jsp"/>
		<link href="${gf:ctxpath()}/fqe-ria/ge-fqe-ria.css" rel="stylesheet" type="text/css" charset="utf-8"/>
		<link href="${gf:ctxpath()}/public/css/fqe/dataexport.css" rel="stylesheet" type="text/css" charset="utf-8" />
		<gp:script type="text/javascript" src="${gf:ctxpath()}/fqe-ria/ge-fqe-ria.js" charset="utf-8" />
		<gp:script type="text/javascript" src="${gf:ctxpath()}/public/js/fqe/dataexport.js" charset="utf-8" />
		<link href="${gf:ctxpath()}/public/css/sample.css" rel="stylesheet" type="text/css" charset="utf-8"/>
		<gp:script type="text/javascript" charset="utf-8">
			<![CDATA[
				$(function() {
					initEvent();
					initConfirmBtnStatus("DialogExportName", "ExportBtn");
					initConfirmBtnStatus("DialogSaveName", "SaveOkBtn");
				});
			]]>
		</gp:script>
		</head>
		<gp:body id="body">
	    	<gp:jspinclude page="/geframe/jsp/submit-indicator.jsp" id="submit-indicator"/>
			<gp:div id="blockdiv">
			<gp:jspinclude id="SystemHeader" page="/WEB-INF/jsp/sample/ria/common/header.jsp"/>
			<gp:jspinclude id="datasourceListZoom-inc" page="/WEB-INF/jsp/sample/ria/fqe/datasourcelist.jsp" flush="true"/>
		    <gp:jspinclude id="historylistZoom-inc" page="/WEB-INF/jsp/sample/ria/fqe/historyconditionlist.jsp" flush="true"/>
			<gp:jspinclude id="savedialog-inc" page="/WEB-INF/jsp/sample/ria/fqe/historyconditionlistsavedialog.jsp" flush="false"/>
		    <gp:jspinclude id="exportdialog-inc" page="/WEB-INF/jsp/sample/ria/fqe/dataexportdialog.jsp" flush="false"/>
		    <gp:jspinclude id="datacount-inc" page="/WEB-INF/jsp/sample/ria/fqe/selectcountdialog.jsp" flush="true"/>
			 	<gr:errordialog elements=",formMain" id="edialog" options="{width:700,height:240}" title="${gf:resource('7CEBE2F45F1E45229D1CA59F2B69DA5F')}" style="display:none;" errorlabel="${gf:resource('51E5C5EBB11B4CCE8BA0F17D6984F2A3')}">
					<gp:jspinclude id="error" page="/WEB-INF/jsp/sample/ria/common/validate-error.jsp" />
				</gr:errordialog>

				<gp:form id="formMain" method="post" focus="DatasourceSelectBtn">
					<gp:hidden id="datasourceId" />
					<gp:hidden id="historyName" />
					<gp:hidden id="exportName"/>
					<table class="condition" cellspacing="1" style="margin-left: 20px;">
						<tr style="border-bottom-color: blue; border-bottom-style: solid; border-bottom-width: thin;">
							<td class="label row left-aligned">データソース</td>
							<td class="row" style="vertical-align: middle;white-space: nowrap;" colspan="2">
								<gp:text id="datasourceLabel" styleclass="text" maxlength="15" size="40" label="出力データソース" style="ime-mode:disabled; margin-right: 10px; margin-top: 3px; margin-left: 10px;" readonly="true" onkeydown="return preventSubmit(event);" />
								<gp:button id="DatasourceSelectBtn" accesskey="P" style="float: right;" showaccesskey="true" title="データソース選択" value="データソース選択">
									<gr:zoomopenevent element="DatasourceListZoom" event="click"/>
								</gp:button>
							</td>
						</tr>
						<tr>
							<td class="label left-aligned" rowspan="2">出力形式</td>
							<td class="left-aligned">ファイルタイプ：</td>
							<td class="left-aligned">
								<gp:radiogroup id="fileType" name="fileType" value="CSV"/>
								<gp:radiooption id="fileTypeCSV" radiogroup="fileType" value="CSV"/> <!-- ファイル形式 -->
								<label for="fileTypeCSV">CSV</label>
								<gp:radiooption id="fileTypeTSV" radiogroup="fileType" value="TSV"/>
								<label for="fileTypeTSV">TSV</label>
								<gp:radiooption id="fileTypeExcel" radiogroup="fileType" value="EXCEL"/>
								<label for="fileTypeExcel">Excel</label>
							</td>
						</tr>
						<tr>
							<td class="left-aligned">タイトル行有無：</td>
							<td class="left-aligned">
								<gp:checkbox id="useHeader" />
								<label for="useHeader">先頭行に項目のタイトル情報を付加する</label>
							</td>
						</tr>
					</table>
					<gp:button id="DataExportBtn"  value="データ出力" accesskey="O" title="データ出力" showaccesskey="true" styleclass="function-btn" enabled="false" style="margin-left: 20px;">
						<gp:widgetevent element="DataExportDialog" event="click" widgetname="grdialog" method="open" />
						<gp:functionevent func="initDialog('DialogExportName');" event="click" />
					</gp:button>
					<gp:button id="SaveBtn"  value="条件保存" accesskey="K" title="条件保存" showaccesskey="true" styleclass="function-btn" enabled="false">
						<gp:widgetevent element="SaveDialog" event="click" widgetname="grdialog" method="open" />
						<gp:functionevent func="initDialog('DialogSaveName');" event="click" />
					</gp:button>
					<gp:button id="LoadConditionBtn"  value="条件読込" accesskey="L" showaccesskey="true" title="条件読込" styleclass="function-btn" >
						<gr:zoomopenevent element="ConditionHistoryListZoom" event="click">
							<gr:zoomparam name="exportConditionList.listsize" value="10"/>
						</gr:zoomopenevent>
					</gp:button>
					<gp:button id="CountsCheckBtn"  value="件数確認" accesskey="H" showaccesskey="true" title="件数確認" styleclass="function-btn" enabled="false">
						<gp:widgetevent element="SelectCountDialog" event="click" widgetname="grdialog" method="open" />
						<gp:functionevent func="initDialog('SelectCountOkBtn');" event="click" />
						<gp:submitevent event="click" actionbean="sample.ria.fqe.action.ExportAction" actionmethod="count" mode="count" forward="dataexport.jsp"  form="formMain" indicator="submit-indicator" />
					</gp:button>
					<table style="width:100%; margin-top: 30px;">
						<tr>
							<td style="vertical-align: top; width: 24%;" class="exportAndSortTable">
							<table border="0" cellspacing="0" style="width:100%">
								<tr>
									<td>
										<gfqe:list id="fieldList" isemptymsg="false" styleclass="selectable list" maxlistsize="10" style="table-layout: fixed; min-width: 231px;">
												<gfqe:listheader id="Head" styleclass="row">
													<gp:listheaderline>
														<gp:listheadercell id="isUsed_H" style="width: 21px">
															<gp:checkbox id="isUsedAll" onclick="toggleAllCheck('fieldList',this); setFunctionBtnState('fieldList');" label="チェックボックス"/>
														</gp:listheadercell>
														<gp:listheadercell id="Column_H" styleclass="filedName" style="text-align-last: center;">出力項目</gp:listheadercell>
														<gp:listheadercell id="AddSearchCondition_H" style="text-align: cente" styleclass="filedBtn">条<br />件</gp:listheadercell>
														<gp:listheadercell id="AddSortCondition_H" styleclass="filedBtn">ソー<br />ト</gp:listheadercell>
													</gp:listheaderline>
												</gfqe:listheader>
												<gfqe:listrow id="Row" styleclass="row">
													<gp:listrowline>
														<gp:listrowcell id="isUsed_C" style="width: 15px">
															<gp:checkbox id="isUsed" onclick="setFunctionBtnState('fieldList');"/>
														</gp:listrowcell>
														<gp:listrowcell id="Column_C" onclick="changeSelectable(this, 'ExportColumnMoveUpBtn', 'ExportColumnMoveDownBtn');" onmouseout="refreshList('exportFieldList'); changeToMoveRowBtn('fieldList', 'ExportColumnMoveUpBtn', 'ExportColumnMoveDownBtn'); " >
															<gp:hidden id="fieldId" />
															<gp:label id="fieldLabel" />
														</gp:listrowcell>
														<gp:listrowcell id="AddSearchCondition_C" style="text-align: center;">
															<gp:button id="AddSearchConditionBtn" value="+" styleclass="plus" onclick="addSearchColumn('filterFieldGroupList','filterFieldList',this, 'fieldId', 'fieldLabel'); changeToMoveFilterRowBtn('filterFieldList', 'SearchColumnMoveUpBtn', 'SearchColumnMoveDownBtn');" />
														</gp:listrowcell>
														<gp:listrowcell id="AddSortCondition_C" style="text-align: center;">
															<gp:button id="AddSortConditionBtn" value="+" styleclass="plusS" onclick="addSortColumn('sortFieldList',this, 'fieldId', 'fieldLabel'); changeToMoveRowBtn('sortFieldList', 'SortColumnMoveUpBtn', 'SortColumnMoveDownBtn');" />
														</gp:listrowcell>
													</gp:listrowline>
												</gfqe:listrow>
												
											</gfqe:list>
									</td>
									<td class="moveBtn" style="padding-left: 5px; ">
										<gp:button styleclass="udbtn" id="ExportColumnMoveUpBtn" enabled="false" value="▲" onclick="moveUpColumn('fieldList', this);" /><br />
										<gp:button styleclass="udbtn" id="ExportColumnMoveDownBtn" enabled="false" value="▼" onclick="moveDownColumn('fieldList', this);" />
									</td>
								</tr>
							</table>
							</td>

							<td style="vertical-align: top; width: 50%; padding-top: 11px; padding-left: 19px;">
							<table border="0" cellspacing="0" style="width:100%">
								<tr>
									<td>
									<table border="0" cellspacing="0" style="width:100%">
										<tr>
											<td>
												<gp:label id="AddBtn" value="＋" title="追加"  onclick="addTabSortable('filterFieldGroupList');" />
												<gfqe:tab label="条件" size="5" id="filterFieldGroupList">
													<gp:label id="RemoveBtn" value="×" title="削除"  onclick="removeTabSortable('filterFieldGroupList', this);" />
													<gfqe:list id="filterFieldList" isemptymsg="false" maxlistsize="5" label="条件" styleclass="selectable" style="width:100%; table-layout: fixed; min-width: 500px">
														<gfqe:listheader id="FilterHeader" styleclass="row">
															<gp:listheaderline>
																<gp:listheadercell id="Remove_H" styleclass="filedBtn">削<br />除</gp:listheadercell>
																<gp:listheadercell id="Column_H" styleclass="filedName" style="width: 35%; text-align: center;">条件項目</gp:listheadercell>
																<gp:listheadercell id="Operator_H" styleclass="fileterInputHeader" style="text-align-last: center; width:160px;">抽出条件</gp:listheadercell>
																<gp:listheadercell id="Value_H" styleclass="fileterInputHeader">値</gp:listheadercell>
															</gp:listheaderline>
														</gfqe:listheader>
														<gfqe:listrow id="FilterRow" styleclass="row" >
															<gp:listrowline>
																<gp:listrowcell id="Remove_C" style="text-align: center;">
																	<gp:button id="RemoveBtn" value="-" styleclass="minus" onclick="removeSearchColumn('filterFieldGroupList','filterFieldList',this); changeToMoveFilterRowBtn('filterFieldList', 'filterFieldGroupList', 'SearchColumnMoveUpBtn', 'SearchColumnMoveDownBtn');" />
																	<gp:hidden id="fieldId" />
																</gp:listrowcell>
																<gp:listrowcell id="Column_C" onclick="changeSelectable(this, 'SearchColumnMoveUpBtn', 'SearchColumnMoveDownBtn');" style="text-align: left;" onmouseout="refreshSearchList('filterFieldGroupList','filterFieldList'); changeToMoveFilterRowBtn('filterFieldList', 'filterFieldGroupList', 'SearchColumnMoveUpBtn', 'SearchColumnMoveDownBtn');">
																	<gp:label id="fieldLabel" />
																</gp:listrowcell>
																<gp:listrowcell id="Operator_C" styleclass="inputCell">
																	<gp:select value="0" id="operator" onchange="changeValueField(this);" label="抽出条件" styleclass="inputControl">
																		<gp:option label="等しい（=）" value="0" />
																		<gp:option label="等しくない（&lt;&gt;）" value="1" />
																		<gp:option label="大きい（&gt;）" value="2" />
																		<gp:option label="以上（&gt;=）" value="3" />
																		<gp:option label="小さい（&lt;）" value="4" />
																		<gp:option label="以下（&lt;=）" value="5" />
																		<gp:option label="いずれか" value="6" />
																		<gp:option label="いずれでもない" value="7" />
																		<gp:option label="前方一致" value="8" />
																		<gp:option label="後方一致" value="9" />
																		<gp:option label="部分一致" value="10" />
																		<gp:option label="nullと等しい" value="11" />
																		<gp:option label="nullと等しくない" value="12" />
																	</gp:select>
																</gp:listrowcell>
																<gp:listrowcell id="Value_C" styleclass="inputCell">
																	<gp:textarea id="value" rows="2" cols="16" label="値" style="max-height: 100px; text-align left;" styleclass="inputControl"/>
																</gp:listrowcell>
															</gp:listrowline>
														</gfqe:listrow>
													</gfqe:list>
												</gfqe:tab>

											</td>
										</tr>
									</table>
									</td>
									<td class="moveBtn" style="padding-top: 65px; padding-left: 20px;">
										<gp:button id="SearchColumnMoveUpBtn"  value="▲" title="▲" styleclass="udbtn" enabled="false" onclick="moveUpSearchColumn('filterFieldGroupList','filterFieldList', this);" /> <br />
										<gp:button id="SearchColumnMoveDownBtn"  value="▼" title="▼" styleclass="udbtn" enabled="false" onclick="moveDownSearchColumn('filterFieldGroupList','filterFieldList', this);" />
									</td>
								</tr>
							</table>
							</td>
							<td style="vertical-align: top; width: 26%;" class="exportAndSortTable">
							<table border="0" cellspacing="0" style="width:100%">
								<tr>
									<td>
											<gfqe:list id="sortFieldList" isemptymsg="false" maxlistsize="5" styleclass="selectable list" style="table-layout: fixed; min-width: 231px;">
												<gfqe:listheader id="SortHeader" styleclass="row">
													<gp:listheaderline>
														<gp:listheadercell id="Remove_H" styleclass="filedBtn">削<br />除</gp:listheadercell>
														<gp:listheadercell id="Column_H" styleclass="filedName" style="text-align-last: center;">ソート項目</gp:listheadercell>
														<gp:listheadercell id="Order_H" style="text-align-last: center; width: 70px;"> 出力順</gp:listheadercell>
													</gp:listheaderline>
												</gfqe:listheader>
												<gfqe:listrow id="SortRow" styleclass="row">
													<gp:listrowline>
														<gp:listrowcell id="Remove_C" style="text-align: center;">
															<gp:button id="RemoveBtn" value="-" styleclass="minusS" onclick="removeSortColumn('sortFieldList',this); changeToMoveRowBtn('sortFieldList', 'SortColumnMoveUpBtn', 'SortColumnMoveDownBtn');" />
														</gp:listrowcell>
														<gp:listrowcell id="Column_C" onclick="changeSelectable(this, 'SortColumnMoveUpBtn', 'SortColumnMoveDownBtn');" onmouseout="refreshList('sortFieldList'); changeToMoveRowBtn('sortFieldList', 'SortColumnMoveUpBtn', 'SortColumnMoveDownBtn');">
															<gp:hidden id="fieldId" />
															<gp:label id="fieldLabel" />
														</gp:listrowcell>
														<gp:listrowcell id="Order_C" styleclass="inputCell">
															<gp:select value="0" id="sortOrder" onchange="changeValueField(this);" styleclass="inputControl">
																<gp:option label="昇順" value="ASC" />
																<gp:option label="降順" value="DESC" />
															</gp:select>
														</gp:listrowcell>
													</gp:listrowline>
												</gfqe:listrow>
											</gfqe:list>
									</td>
									<td class="moveBtn">
										<gp:button id="SortColumnMoveUpBtn"  value="▲" title="▲" styleclass="udbtn" enabled="false" onclick="moveUpColumn('sortFieldList', this);" /> <br />
										<gp:button id="SortColumnMoveDownBtn"  value="▼" title="▼" styleclass="udbtn" enabled="false"  onclick="moveDownColumn('sortFieldList', this);" />
									</td>
								</tr>
							</table>
							</td>
						</tr>
					</table>
				</gp:form>

			</gp:div>
		</gp:body>
		</gp:html>
	</gp:view>
</jsp:root>
