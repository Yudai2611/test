<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> ]]></jsp:text>
<gp:view>
<gp:html version="XHTML 1.0 Transitional" xmlns:ghx="http://www.kccs.co.jp/2011/geframe/xhtml1-extension/XMLSchema">
<head>
	<meta http-equiv="Expires" content="0" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Cache-Control" content="no-cache" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
	<meta http-equiv="Content-Script-Type" content="text/javascript" />
	<title><gp:labelvalue id="title" value="${gf:resource('AUTHENTICATION-ERROR')}"/></title>
	<gp:jspinclude id="Header" page="/WEB-INF/jsp/sample/ria/common/header-ria-inc.jsp"/>
</head>
<gp:body>
	<div align="center">
		<gp:img id="imgtitle" alt="" style="border:0px;" src="${gf:ctxpath()}/public/images/title.gif" />
		<br /><br /><br />
		<h2 style="color:red;font-size:large;"><gp:labelvalue id="message" value="${gf:resource('ACCESS-PROHIBITED')}"/></h2><br/>
		<hr width="600" /><br />
		<span><gp:labelvalue id="description1" value="${gf:resource('SESSION-TIMEOUT')}"/></span><br />
		<span><gp:labelvalue id="description2" value="${gf:resource('LOGIN-AGAIN')}" /></span><br /><br />
		<gp:anchor id="login" href="${gf:ctxpath()}/login.jsp" target="_parent"><gp:labelvalue id="caption" value="${gf:resource('GO-TO-LOGIN-PAGE')}" /></gp:anchor>
	</div>
</gp:body>
</gp:html>
</gp:view>
</jsp:root>