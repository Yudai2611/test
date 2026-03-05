<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">]]></jsp:text>
<gp:view scope="request" >
<gp:html version="XHTML 1.0 Transitional">
<head>
	<meta http-equiv="Expires" content="0" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Cache-Control" content="no-cache" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
	<meta http-equiv="Content-Script-Type" content="text/javascript"/>
	<title>バッチ詳細画面</title>
	<gp:jspinclude id="Header" page="/WEB-INF/jsp/sample/ria/common/header-ria-inc.jsp"/>
	<link href="${gf:ctxpath()}/public/css/sample.css" rel="stylesheet" type="text/css" charset="utf-8"/>
</head>
<gp:body>
	<gp:jspinclude page="/geframe/jsp/submit-indicator.jsp" id="submit-indicator"/>
	<gr:keybind keycode="13" element="Search" event="click"/>
	<gp:jspinclude id="SystemHeader" page="/WEB-INF/jsp/sample/ria/common/header.jsp"/>
	<gp:form id="formMain" method="post">
		<gp:button id="btnBack" value="キャンセル" accesskey="C">
			<gp:submitevent event="click" actionbean="sample.ria.batchexecute.JobDetailAction" actionmethod="doCancel" indicator="submit-indicator" mode="search" forward="jobexecute.jsp"/>
		</gp:button>
		<gp:hidden id="JobList.listsize"/>
	</gp:form>

	<table class="condition" cellspacing="1">
		<tr>
			<td class="label" width="200">
				<gp:label id="JobName_L" value="ジョブ名"/>
			</td>
			<td width="600" colspan="3">
				<gp:label id="JobName"/>
			</td>
		</tr>
		<tr>
			<td class="label" width="200">
				<gp:label id="Status_L" value="状態"/>
			</td>
			<td width="200">
				<gp:label id="Status"/>
			</td>
			<td class="label" width="200">
				<gp:label id="UpdateCount_L" value="削除件数"/>
			</td>
			<td width="200" align="right">
				<gp:label id="UpdateCount" format="##0"/>
			</td>
		</tr>
		<tr>
			<td class="label" width="200">
				<gp:label id="User_L" value="実行者"/>
			</td>
			<td width="200">
				<gp:label id="UserID"/>
			</td>
			<td class="label" width="200">
				<gp:label id="ExecuteDate_L" value="実行日時"/>
			</td>
			<td width="200">
				<gp:label id="ExecuteDate" format="yyyy/MM/dd HH:mm:ss"/>
			</td>
		</tr>
		<tr>
			<td class="label" width="200">
				<gp:label id="StartDate_L" value="開始日時"/>
			</td>
			<td width="200">
				<gp:label id="StartDate" format="yyyy/MM/dd HH:mm:ss"/>
			</td>
			<td class="label" width="200">
				<gp:label id="EndDate_L" value="終了日時"/>
			</td>
			<td width="200">
				<gp:label id="EndDate" format="yyyy/MM/dd HH:mm:ss"/>
			</td>
		</tr>
		<tr>
			<td class="label" width="200">
				<gp:label id="Parameter_L" value="パラメータ"/>
			</td>
			<td width="600" colspan="3">
				<gp:label id="Parameter"/>
			</td>
		</tr>
	</table>

	<hr width="100%" align="left"/>

	<gp:list id="JobDetailList" style="width:100%;" emptymsg="該当するデータはありません">
		<gp:listheader>
			<gp:listheaderline>
				<gp:listheadercell id="SeqNo" style="width:2%;">No.</gp:listheadercell>
				<gp:listheadercell id="StepID" style="width:2%;">ステップID</gp:listheadercell>
				<gp:listheadercell id="StepName" style="width:15%;">ステップ名</gp:listheadercell>
				<gp:listheadercell id="StepStatus" style="width:15%;">状態</gp:listheadercell>
				<gp:listheadercell id="StepStartDate" style="width:15%;">開始日時</gp:listheadercell>
				<gp:listheadercell id="StepEndDate" style="width:15%;">終了日時</gp:listheadercell>
				<gp:listheadercell id="StepUpdateCount" style="width:5%;">削除件数</gp:listheadercell>
				<gp:listheadercell id="Description" style="width:31%;">詳細</gp:listheadercell>
			</gp:listheaderline>
		</gp:listheader>

		<gp:listrow>
			<gp:listrowline>
				<gp:listnumbercell id="SeqNo" style="text-align:right;"/>
				<gp:listrowcell id="StepID_C">
					<gp:label id="StepID" format="##0" style="display:block;text-align:right;"/>
				</gp:listrowcell>
				<gp:listrowcell id="StepName_C">
					<gp:label id="StepName"/>
				</gp:listrowcell>
				<gp:listrowcell id="StepStatus_C">
					<gp:label id="StepStatus"/>
				</gp:listrowcell>
				<gp:listrowcell id="StepStartDate_C">
					<gp:label id="StepStartDate"/>
				</gp:listrowcell>
				<gp:listrowcell id="StepEndDate_C">
					<gp:label id="StepEndDate"/>
				</gp:listrowcell>
				<gp:listrowcell id="StepUpdateCount_C">
					<gp:label id="StepUpdateCount" format="##0" style="display:block;text-align:right;"/>
				</gp:listrowcell>
				<gp:listrowcell id="StepExitMessage_C">
					<gp:label id="StepExitMessage"/>
				</gp:listrowcell>
			</gp:listrowline>
		</gp:listrow>
	</gp:list>
</gp:body>
</gp:html>
</gp:view>
</jsp:root>
