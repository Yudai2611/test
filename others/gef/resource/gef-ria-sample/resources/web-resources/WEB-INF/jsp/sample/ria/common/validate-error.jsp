<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<gp:includeview id="validate-error" viewclass="sample.ria.common.ValidateErrorView">
	<gp:list id="ValidateErrors" listsize="10" style="width:100%;" zebrarow="false">
		<gp:listheader id="errorheader">
			<gp:listheaderline>
				<gp:listheadercell id="ErrorKind" style="width:300px;"><nobr><gp:labelvalue id="ErrorKindLabel" value="${gf:resource('LEVEL')}"/></nobr></gp:listheadercell>
				<gp:listheadercell id="ErrorCode" style="width:80px;"><nobr><gp:labelvalue id="ErrorcodeLabel" value="${gf:resource('CODE')}"/></nobr></gp:listheadercell>
				<gp:listheadercell id="ErrorMessage" style="width:300px;"><nobr><gp:labelvalue id="ErrorMessageLabel" value="${gf:resource('MESSAGE')}"/></nobr></gp:listheadercell>
				<gp:listheadercell id="ErrorField" style="width:100px;"><nobr><gp:labelvalue id="ErrorFieldLabel" value="${gf:resource('FIELD')}"/></nobr></gp:listheadercell>
				<gp:listheadercell id="ErrorPosition" style="width:80px;"><nobr><gp:labelvalue id="ErrorPosition" value="${gf:resource('POSITION')}"/></nobr></gp:listheadercell>
				<gp:listheadercell id="ErrorDescription" style="width:200px;"><nobr><gp:labelvalue id="ErrorDescriptionLabel" value="${gf:resource('DESCRIPTION')}"/></nobr></gp:listheadercell>
			</gp:listheaderline>
		</gp:listheader>
		<gp:listrow id="errorrows" styleclass="rowcolor1">
			<gp:listrowline>
				<gp:listrowcell id="ErrorKind" style="width:300px;"><nobr><gp:label id="ErrorKind"/></nobr></gp:listrowcell>
				<gp:listrowcell id="ErrorCode" style="width:80px;"><nobr><gp:label id="ErrorCode" /></nobr></gp:listrowcell>
				<gp:listrowcell id="ErrorMessage" style="width:300px;"><nobr><gp:label id="ErrorMessage"/></nobr></gp:listrowcell>
				<gp:listrowcell id="ErrorField" style="width:100px;"><nobr><gp:label id="ErrorField" /></nobr></gp:listrowcell>
				<gp:listrowcell id="ErrorPosition" style="width:80px;"><nobr><gp:label id="ErrorPosition" /></nobr></gp:listrowcell>
				<gp:listrowcell id="ErrorDescription" style="width:200px;"><nobr><gp:label id="ErrorDescription" /></nobr></gp:listrowcell>
			</gp:listrowline>
		</gp:listrow>
	</gp:list>
	<br/>
	<gp:button id="ValidateErrorClose"  value="閉じる" accesskey="v">
		<gp:functionevent func="$(this).closest('.geui-grerrordialog-content').dialog('close');" event="click" />
	</gp:button>
</gp:includeview>
</jsp:root>
