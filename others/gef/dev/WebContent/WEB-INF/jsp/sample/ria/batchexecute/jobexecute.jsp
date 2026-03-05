<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">]]></jsp:text>
<gp:view viewclass="sample.ria.batchexecute.JobExecuteView" scope="request" >
<gp:html version="XHTML 1.0 Transitional" xmlns:ghx="http://www.kccs.co.jp/2011/geframe/xhtml1-extension/XMLSchema">
<head>
	<meta http-equiv="Expires" content="0" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Cache-Control" content="no-cache" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
	<meta http-equiv="Content-Script-Type" content="text/javascript"/>
	<title>バッチ指示画面</title>
	<gp:jspinclude id="Header" page="/WEB-INF/jsp/sample/ria/common/header-ria-inc.jsp"/>
	<link href="${gf:ctxpath()}/public/css/sample.css" rel="stylesheet" type="text/css" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/public/js/sample.js" charset="utf-8"/>
	<gp:script type="text/javascript" charset="utf-8">
	<![CDATA[
		function changeExecuteMode() {
			const checked = $.ge.idSelector("immediateExecute").prop('checked');
			$.ge.idSelector("Hourly").prop('disabled', checked);
			$.ge.idSelector("Hourly.Minutes").prop('disabled', checked);

			$.ge.idSelector("Daily").prop('disabled', checked);
			$.ge.idSelector("Daily.Minutes").prop('disabled', checked);
			$.ge.idSelector("Daily.Hours").prop('disabled', checked);

			$.ge.idSelector("Weekly").prop('disabled', checked);
			$.ge.idSelector("Weekly.Hours").prop('disabled', checked);
			$.ge.idSelector("Weekly.Minutes").prop('disabled', checked);
			$.ge.idSelector("Weekly.Dow.1").prop('disabled', checked);
			$.ge.idSelector("Weekly.Dow.2").prop('disabled', checked);
			$.ge.idSelector("Weekly.Dow.3").prop('disabled', checked);
			$.ge.idSelector("Weekly.Dow.4").prop('disabled', checked);
			$.ge.idSelector("Weekly.Dow.5").prop('disabled', checked);
			$.ge.idSelector("Weekly.Dow.6").prop('disabled', checked);
			$.ge.idSelector("Weekly.Dow.7").prop('disabled', checked);
				
			$.ge.idSelector("Monthly").prop('disabled', checked);
			$.ge.idSelector("Monthly.Day").prop('disabled', checked);
			$.ge.idSelector("Monthly.Hours").prop('disabled', checked);
			$.ge.idSelector("Monthly.Minutes").prop('disabled', checked);
		}
		
		function setListSize(){
			$.ge.idSelector("DuplicateJobList.listsize").val($.ge.idSelector("JobList.listsize").val());
		}
	]]>
	</gp:script>
	<link href="${gf:ctxpath()}/public/css/sample.css" rel="stylesheet" type="text/css" charset="utf-8"/>
</head>
<gp:body onload="changeExecuteMode()">
	<gp:jspinclude page="/geframe/jsp/submit-indicator.jsp" id="submit-indicator"/>
	<gr:keybind keycode="13" element="Search" event="click"/>
	<gp:jspinclude id="SystemHeader" page="/WEB-INF/jsp/sample/ria/common/header.jsp"/>
	<br/>
	<gr:errordialog elements=",formMain" id="edialog" options="{width:700,height:240}" title="${gf:resource('VALIDATE-RESULT-VIEW')}" style="display:none;" errorlabel="${gf:resource('VALIDATE-ERRORS')}" anchor="true">
		<gp:jspinclude id="error" page="/WEB-INF/jsp/sample/ria/common/validate-error.jsp"/>
	</gr:errordialog>

	<gp:form id="formMain" method="post">
		<gp:hidden id="DuplicateJobList.listsize"/>
		<gp:radiogroup id="executeType" value="0"/>
		<gp:radiogroup id="scheduleMode" />
		<b>
			<gp:label id="setting" value="◆ジョブ設定" />
		</b>
 		<table class="condition" cellspacing="1">
 			<tr>
 				<td class="label">
 					<gp:label id="execute_L" value="実行方式"/>
 				</td>
 				<td colspan="5">
	 				<gp:radiooption radiogroup="executeType" id="immediateExecute" value="0" onchange="changeExecuteMode()" /><label id="executetype_0_L">即時実行</label>
	 				<gp:radiooption radiogroup="executeType" id="scheduleExecute" value="1" onchange="changeExecuteMode()" /><label id="executetype_1_L">スケジュール実行</label>
 				</td>
 			</tr>
			<tr>
				<td class="label" rowspan="5">
					<gp:label id="Schedule_L" value="ジョブスケジュール"/>
				</td>
			</tr>
			<tr>
				<td>
					<gp:radiooption radiogroup="scheduleMode" id="Hourly" value="Hourly" />
					<gp:label id="type_0" value="毎時"/>
	 			</td>
	 			<td>
	 				<gp:select id="Hourly.Minutes">
		 				<gp:option value="0" label="00"/>
						<gp:option value="5" label="05" />
						<gp:option value="10" label="10" />
						<gp:option value="15" label="15" />
						<gp:option value="20" label="20" />
						<gp:option value="25" label="25" />
						<gp:option value="30" label="30" />
						<gp:option value="35" label="35" />
						<gp:option value="40" label="40" />
						<gp:option value="45" label="45" />
						<gp:option value="50" label="50" />
						<gp:option value="55" label="55" />
	 				</gp:select>
	 				<gp:label id="Hourly.Minutes_L" value="分"/>
	 			</td>
			</tr>
			<tr>
				<td>
					<gp:radiooption radiogroup="scheduleMode" id="Daily" value="Daily" />
					<gp:label id="type_1" value="毎日"/>
	 			</td>
	 			<td>
					<gp:select id="Daily.Hours">
		 				<gp:option value="0" label="0"/>
						<gp:option value="1" label="1" />
						<gp:option value="2" label="2" />
						<gp:option value="3" label="3" />
						<gp:option value="4" label="4" />
						<gp:option value="5" label="5" />
						<gp:option value="6" label="6" />
						<gp:option value="7" label="7" />
						<gp:option value="8" label="8" />
						<gp:option value="9" label="9" />
						<gp:option value="10" label="10" />
		 				<gp:option value="11" label="11"/>
						<gp:option value="12" label="12" />
						<gp:option value="13" label="13" />
						<gp:option value="14" label="14" />
						<gp:option value="15" label="15" />
						<gp:option value="16" label="16" />
						<gp:option value="17" label="17" />
						<gp:option value="18" label="18" />
						<gp:option value="19" label="19" />
						<gp:option value="20" label="20" />
						<gp:option value="21" label="21" />
						<gp:option value="22" label="22" />
						<gp:option value="23" label="23" />
	 				</gp:select>
	 				<gp:label id="Daily.Hours_L" value="時"/>
	
	 				<gp:select id="Daily.Minutes">
		 				<gp:option value="0" label="00"/>
						<gp:option value="5" label="05" />
						<gp:option value="10" label="10" />
						<gp:option value="15" label="15" />
						<gp:option value="20" label="20" />
						<gp:option value="25" label="25" />
						<gp:option value="30" label="30" />
						<gp:option value="35" label="35" />
						<gp:option value="40" label="40" />
						<gp:option value="45" label="45" />
						<gp:option value="50" label="50" />
						<gp:option value="55" label="55" />
	 				</gp:select>
	 				<gp:label id="Daily.Minutes_L" value="分"/>
	 			</td>
			</tr>
			<tr>
				<td>
	 				<gp:radiooption radiogroup="scheduleMode" id="Weekly" value="Weekly" />
	 				<gp:label id="type_2" value="毎週"/>
	 			</td>
	 			<td>
	 				<div>
		 				<gp:checkbox id="Weekly.Dow.1" >日曜日</gp:checkbox>
		 				<gp:checkbox id="Weekly.Dow.2" >月曜日</gp:checkbox>
		 				<gp:checkbox id="Weekly.Dow.3" >火曜日</gp:checkbox>
		 				<gp:checkbox id="Weekly.Dow.4" >水曜日</gp:checkbox>
		 				<gp:checkbox id="Weekly.Dow.5" >木曜日</gp:checkbox>
		 				<gp:checkbox id="Weekly.Dow.6" >金曜日</gp:checkbox>
		 				<gp:checkbox id="Weekly.Dow.7" >土曜日</gp:checkbox>
					</div>
					<div>
						<gp:select id="Weekly.Hours">
			 				<gp:option value="0" label="0"/>
							<gp:option value="1" label="1" />
							<gp:option value="2" label="2" />
							<gp:option value="3" label="3" />
							<gp:option value="4" label="4" />
							<gp:option value="5" label="5" />
							<gp:option value="6" label="6" />
							<gp:option value="7" label="7" />
							<gp:option value="8" label="8" />
							<gp:option value="9" label="9" />
							<gp:option value="10" label="10" />
			 				<gp:option value="11" label="11"/>
							<gp:option value="12" label="12" />
							<gp:option value="13" label="13" />
							<gp:option value="14" label="14" />
							<gp:option value="15" label="15" />
							<gp:option value="16" label="16" />
							<gp:option value="17" label="17" />
							<gp:option value="18" label="18" />
							<gp:option value="19" label="19" />
							<gp:option value="20" label="20" />
							<gp:option value="21" label="21" />
							<gp:option value="22" label="22" />
							<gp:option value="23" label="23" />
		 				</gp:select>
		 				<gp:label id="Weekly.Hours_L" value="時"/>

		 				<gp:select id="Weekly.Minutes">
			 				<gp:option value="0" label="00"/>
							<gp:option value="5" label="05" />
							<gp:option value="10" label="10" />
							<gp:option value="15" label="15" />
							<gp:option value="20" label="20" />
							<gp:option value="25" label="25" />
							<gp:option value="30" label="30" />
							<gp:option value="35" label="35" />
							<gp:option value="40" label="40" />
							<gp:option value="45" label="45" />
							<gp:option value="50" label="50" />
							<gp:option value="55" label="55" />
			 				</gp:select>
			 				<gp:label id="Weekly.Minutes_L" value="分"/>
		 				</div>
		 			</td>
				</tr>
				<tr>
					<td>
		 				<gp:radiooption radiogroup="scheduleMode" id="Monthly" value="Monthly" />
		 				<gp:label id="type_3" value="毎月"/>
		 			</td>
		 			<td>
		 				<div>
							<gp:select id="Monthly.Day">
							<gp:option value="1" label="1" />
							<gp:option value="2" label="2" />
							<gp:option value="3" label="3" />
							<gp:option value="4" label="4" />
							<gp:option value="5" label="5" />
							<gp:option value="6" label="6" />
							<gp:option value="7" label="7" />
							<gp:option value="8" label="8" />
							<gp:option value="9" label="9" />
							<gp:option value="10" label="10" />
			 				<gp:option value="11" label="11"/>
							<gp:option value="12" label="12" />
							<gp:option value="13" label="13" />
							<gp:option value="14" label="14" />
							<gp:option value="15" label="15" />
							<gp:option value="16" label="16" />
							<gp:option value="17" label="17" />
							<gp:option value="18" label="18" />
							<gp:option value="19" label="19" />
							<gp:option value="20" label="20" />
							<gp:option value="21" label="21" />
							<gp:option value="22" label="22" />
							<gp:option value="23" label="23" />
							<gp:option value="24" label="24" />
							<gp:option value="25" label="25" />
							<gp:option value="26" label="26" />
							<gp:option value="27" label="27" />
							<gp:option value="28" label="28" />
							<gp:option value="29" label="29" />
							<gp:option value="30" label="30" />
							<gp:option value="31" label="31" />
		 				</gp:select>
		 				<gp:label id="Monthly.Day_L" value="日"/>

						<gp:select id="Monthly.Hours">
			 				<gp:option value="0" label="0"/>
							<gp:option value="1" label="1" />
							<gp:option value="2" label="2" />
							<gp:option value="3" label="3" />
							<gp:option value="4" label="4" />
							<gp:option value="5" label="5" />
							<gp:option value="6" label="6" />
							<gp:option value="7" label="7" />
							<gp:option value="8" label="8" />
							<gp:option value="9" label="9" />
							<gp:option value="10" label="10" />
			 				<gp:option value="11" label="11"/>
							<gp:option value="12" label="12" />
							<gp:option value="13" label="13" />
							<gp:option value="14" label="14" />
							<gp:option value="15" label="15" />
							<gp:option value="16" label="16" />
							<gp:option value="17" label="17" />
							<gp:option value="18" label="18" />
							<gp:option value="19" label="19" />
							<gp:option value="20" label="20" />
							<gp:option value="21" label="21" />
							<gp:option value="22" label="22" />
							<gp:option value="23" label="23" />
		 				</gp:select>
		 				<gp:label id="Monthly.Hours_L" value="時"/>

		 				<gp:select id="Monthly.Minutes">
			 				<gp:option value="0" label="00"/>
							<gp:option value="5" label="05" />
							<gp:option value="10" label="10" />
							<gp:option value="15" label="15" />
							<gp:option value="20" label="20" />
							<gp:option value="25" label="25" />
							<gp:option value="30" label="30" />
							<gp:option value="35" label="35" />
							<gp:option value="40" label="40" />
							<gp:option value="45" label="45" />
							<gp:option value="50" label="50" />
							<gp:option value="55" label="55" />
		 				</gp:select>
		 				<gp:label id="Monthly.Minutes_L" value="分"/>
	 				</div>
	 			</td>
			</tr>
		</table>
		<br/>
		
		<b><gp:label id="parameter" value="◆ジョブ実行パラメーター" /></b>
		<table class="condition" cellspacing="1">
			<tr>
				<td class="label">
					<gp:label id="DateFrom_L" value="日付(FROM)"/>
				</td>
				<td width="200">
					<gr:date id="DateFrom" format="yyyy/MM/dd" maxlength="10" size="14" style="ime-mode:disabled" required="true" label="日付(FROM)">
						<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GDateTypeValidator" level="error"/>
					</gr:date>
				</td>
				<td class="label">
					<gp:label id="DateTo_L" value="日付(TO)"/>
				</td>
				<td width="200">
					<gr:date id="DateTo" format="yyyy/MM/dd" maxlength="10" size="14" style="ime-mode:disabled" required="true" label="日付(TO)">
						<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GDateTypeValidator" level="error"/>
					</gr:date>
				</td>
			</tr>
		</table>
		<br />
		<gp:button id="Execute" value="ジョブ実行" accesskey="E" onclick="setListSize()">
			<gp:submitevent event="click" actionbean="sample.ria.batchexecute.JobExecuteAction" actionmethod="doExecuteJob" indicator="submit-indicator" mode="execute" forward="jobexecute.jsp"/>
		</gp:button>
	</gp:form>
	<gp:form id="formSearchResult" method="post">
		<hr width="100%" align="left"/>
		<b><gp:label id="searchlist" value="◆検索結果" style="margin-right:5px"/></b>
		<gp:button id="Search" value="最新表示" accesskey="S">
			<gp:submitevent event="click" actionbean="sample.ria.batchexecute.JobExecuteAction" actionmethod="doSearch" indicator="submit-indicator" mode="search" forward="jobexecute.jsp"/>
		</gp:button>
		<br />
		<br />
		<gp:ajaxrender id="JobListRender">
			<gp:list id="JobList" listsize="10" style="width:100%;" isemptymsg="false">
				<gp:listcaption>
					<gp:listpager id="JobListPager" first="JobListPager.First" previous="JobListPager.Previous" next="JobListPager.Next" last="JobListPager.Last" listelement="JobList" style="display:block;text-align:right;">
						<gr:imgindicator src="${gf:ctxpath()}/geframe/images/ajax-indicator.gif" id="JobListPagerIndicator" alt="" style="display:none;"/>
						
						<gp:button id="JobListPager.First"  value="&lt;&lt;" title="先頭ページへ">
							<gp:submitevent event="click" actionbean="sample.ria.batchexecute.JobExecuteAction" actionmethod="doSearch"  indicator="[%pfx]JobListPagerIndicator" mode="first" forward="jobexecute.jsp" options="{destpage:'JobListPager.First'}"/>
						</gp:button>
						<gp:button id="JobListPager.Previous"  value="&lt;" title="前ページへ">
							<gp:submitevent event="click" actionbean="sample.ria.batchexecute.JobExecuteAction" actionmethod="doSearch" indicator="[%pfx]JobListPagerIndicator" mode="previous" forward="jobexecute.jsp" options="{destpage:'JobListPager.Previous'}"/>
						</gp:button>
						<gp:listpagination id="JobListPager.Pagination">
							<gp:ajaxevent event="click" actionbean="sample.ria.batchexecute.JobExecuteAction" actionmethod="doSearch" render="JobListRender" indicator="[%pfx]JobListPagerIndicator"/>
						</gp:listpagination>
						<gp:button id="JobListPager.Next"  value="&gt;" title="次ページへ">
							<gp:submitevent event="click" actionbean="sample.ria.batchexecute.JobExecuteAction" actionmethod="doSearch" indicator="[%pfx]JobListPagerIndicator"  mode="next" forward="jobexecute.jsp" options="{destpage:'JobListPager.Next'}"/>
						</gp:button>
						<gp:button id="JobListPager.Last"  value="&gt;&gt;" title="最終ページへ">
							<gp:submitevent event="click" actionbean="sample.ria.batchexecute.JobExecuteAction" actionmethod="doSearch" indicator="[%pfx]JobListPagerIndicator"  mode="last" forward="jobexecute.jsp" options="{destpage:'JobListPager.Last'}"/>
						</gp:button>
						<gp:listcountlabel id="JobListPager.ListCount" listelement="JobList"/>
					</gp:listpager>
				</gp:listcaption>
				<gp:listheader>
					<gp:listheaderline>
						<gp:listheadercell id="SeqNo" style="width:2%;">No.</gp:listheadercell>
						<gp:listheadercell id="JobID" style="width:3%;">ジョブID</gp:listheadercell>
						<gp:listheadercell id="JobName" style="width:25%;">ジョブ名</gp:listheadercell>
						<gp:listheadercell id="Status" style="width:20%;">状態</gp:listheadercell>
						<gp:listheadercell id="StartDate" style="width:25%;">開始日時</gp:listheadercell>
						<gp:listheadercell id="EndDate" style="width:25%;">終了日時</gp:listheadercell>
					</gp:listheaderline>
				</gp:listheader>
				<gp:listrow>
					<gp:listrowline>
						<gp:listnumbercell id="SeqNo" style="text-align:right;"/>
						<gp:listrowcell id="JobID_C">
							<gp:label id="JobID" format="##0" style="display:block;text-align:right;"/>
						</gp:listrowcell>
						<gp:listrowcell id="JobName_C">
							<gp:linkedlabel id="JobName" >
								<gp:submitevent event="click" actionbean="sample.ria.batchexecute.JobExecuteAction" actionmethod="doSearchDetail" forward="jobdetail.jsp" indicator="submit-indicator" />
							</gp:linkedlabel>
						</gp:listrowcell>
						<gp:listrowcell id="Status_C">
							<gp:label id="Status"/>
						</gp:listrowcell>
						<gp:listrowcell id="StartDate_C">
							<gp:label id="StartDate"/>
						</gp:listrowcell>
						<gp:listrowcell id="EndDate_C">
							<gp:label id="EndDate"/>
						</gp:listrowcell>
					</gp:listrowline>
				</gp:listrow>
			</gp:list>
		</gp:ajaxrender>
	</gp:form>
</gp:body>
</gp:html>
</gp:view>
</jsp:root>