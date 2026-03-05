<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<gp:view>
<gp:html id="html" version="XHTML 1.0 Transitional">
<head>
	<meta http-equiv="Expires" content="0" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Cache-Control" content="no-cache" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
	<meta http-equiv="Content-Script-Type" content="text/javascript" />
	<title>ログアウト</title>
	<gp:jspinclude id="header" page="/WEB-INF/jsp/sample/ria/common/header-ria-inc.jsp"/>
</head>
<gp:body id="body">
	<gp:form id="formMain" method="post">
		<br/>
		<br/>
		<br/>
		<div align="center">
			<gp:img id="image_gelogo" alt="" src="${gf:ctxpath()}/public/images/title.gif" style="width:171px; height:153px;"/>
		</div>
		<br/>
		<br/>
		<div style="text-align:center;font-size:x-large;">
			お疲れ様でした。
		</div>
		<br/>
		<br/>
		<div align="center">
			<gp:button id="button_login" value="ログイン">
				<gp:functionevent func="location.href='${gf:ctxpath()}/login.jsp';" event="click" />
			</gp:button>
		</div>
	</gp:form>
</gp:body>
</gp:html>
</gp:view>
</jsp:root>