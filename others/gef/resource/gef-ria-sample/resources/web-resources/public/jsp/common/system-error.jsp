<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> ]]></jsp:text>
<gp:view viewclass="sample.ria.common.SystemErrorView">
<gp:html version="XHTML 1.0 Transitional" xmlns:ghx="http://www.kccs.co.jp/2011/geframe/xhtml1-extension/XMLSchema">
<head>
	<meta http-equiv="Expires" content="0"/>
	<meta http-equiv="Pragma" content="no-cache"/>
	<meta http-equiv="Cache-Control" content="no-cache"/>
	<meta http-equiv="Content-Style-Type" content="text/css"/>
	<meta http-equiv="Content-Script-Type" content="text/javascript"/>
	<title>System Error</title>
	<link href="${gf:ctxpath()}/richview/lib/jqueryui/jquery-ui.custom.css" rel="stylesheet" type="text/css" charset="utf-8"/>
	<link href="${gf:ctxpath()}/richview/ge-richview.css" rel="stylesheet" type="text/css" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/richview/lib/jquery/jquery.js" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/richview/lib/jqueryui/jquery-ui.custom.js" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/richview/ge-richview.js" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/richview/ge-richview.i18n.js" charset="utf-8"/>
</head>
<gp:body>
<gp:form id="formMain">
	<font color="red" size="5" >System Error</font><br/><br/>
	<gp:list id="errorList" listsize="5" style="width:100%;">
		<gp:listheader>
			<gp:listheaderline>
				<gp:listheadercell id="errorKindLabel_H" style="min-width:50px;width:5%;">
					<gp:labelvalue id="errorKindLabel" value="ErrorType"/>
				</gp:listheadercell>
				<gp:listheadercell id="errorcodeLabel_H" style="min-width:200px;width:20%;">
					<gp:labelvalue id="errorcodeLabel" value="ErrorCode"/>
				</gp:listheadercell>
				<gp:listheadercell id="errorMessageLabel_H" style="width:auto;">
					<gp:labelvalue id="errorMessageLabel" value="ErrorMessage"/>
				</gp:listheadercell>
			</gp:listheaderline>
		</gp:listheader>
		<gp:listrow>
			<gp:listrowline>
				<gp:listrowcell id="ErrorKind_C">
					<gp:label id="ErrorKind" style="width:auto;"/>
				</gp:listrowcell>
				<gp:listrowcell id="ErrorCode_C">
					<gp:label id="ErrorCode" style="width:auto;"/>
				</gp:listrowcell>
				<gp:listrowcell id="ErrorMessage_C">
					<gp:label id="ErrorMessage" style="width:auto;"/>
				</gp:listrowcell>
			</gp:listrowline>
		</gp:listrow>
	</gp:list>
	<gp:textarea id="trace" rows="25" cols="100" wrap="off" style="width:auto;" readonly="true"/>
	<hr/>
	<gp:button id="back" value="Back">
		<gp:functionevent func="history.length > 0 ? window.history.back() : window.close();" event="click"/>
	</gp:button>
	<br/>
</gp:form>
</gp:body>
</gp:html>
</gp:view>
</jsp:root>
